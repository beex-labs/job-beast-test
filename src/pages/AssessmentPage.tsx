import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import {
  DEFAULT_JOB_INPUT,
  type BenefitFlags,
  type JobInput,
  type Level,
  type RatingId,
  type RiskFlags,
} from "@/core/types";
import {
  BENEFIT_FIELDS,
  BOUNDARY_FIELDS,
  EXPERIENCE_YEARS_FIELD,
  FORM_STEPS,
  FREEDOM_FIELDS,
  GROWTH_FIELDS,
  MONEY_FIELDS,
  RISK_FIELDS,
  STABILITY_FIELDS,
  TIME_FIELDS,
  type LevelFieldDef,
} from "@/data/field-copy";
import { buildFullResult } from "@/core/explain";
import { getRatingCopy } from "@/data/rating-copy";
import { getRatingRule } from "@/core/rating";
import {
  clearDraft,
  flushDraft,
  readDraft,
  scheduleDraftWrite,
  writeDraftSync,
} from "@/infra/form-storage";
import { patchResult, writeResult } from "@/infra/result-storage";
import { submitFirstBrowserRating } from "@/infra/rating-stats-client";
import { navigate } from "@/app/router";
import { BottomActionBar } from "@/components/BottomActionBar";
import { ChoiceGroup } from "@/components/ChoiceGroup";
import { ConsentSheet } from "@/components/ConsentSheet";
import { ProgressHeader } from "@/components/ProgressHeader";
import { RiskCard } from "@/components/RiskCard";
import { ToggleCard } from "@/components/ToggleCard";

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export interface AssessmentPageProps {
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function AssessmentPage({
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: AssessmentPageProps) {
  const [input, setInput] = useState<JobInput>(() => {
    const draft = readDraft();
    return deepClone(draft?.input ?? DEFAULT_JOB_INPUT);
  });
  const [stepIdx, setStepIdx] = useState<number>(() => {
    const s = readDraft()?.step ?? 0;
    return Math.min(Math.max(s, 0), FORM_STEPS.length - 1);
  });
  const [showConsent, setShowConsent] = useState(false);
  const [consentRating, setConsentRating] = useState<RatingId | null>(null);

  const handlePageHide = useCallback(() => flushDraft(), []);

  useEffect(() => {
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [handlePageHide]);

  // Auto-save draft
  useEffect(() => {
    scheduleDraftWrite({ step: stepIdx, input });
  }, [input, stepIdx]);

  const step = FORM_STEPS[stepIdx];
  const isLast = stepIdx === FORM_STEPS.length - 1;

  const updateInput = (patch: Partial<JobInput>) => {
    const next = { ...input, ...patch };
    setInput(next);
  };

  const updateField = (key: string, value: number) => {
    const patch: Partial<JobInput> = { [key]: value };
    if (key === "workDaysPerWeek") {
      patch.remoteDaysPerWeek = Math.min(input.remoteDaysPerWeek, value);
    } else if (key === "remoteDaysPerWeek") {
      patch.remoteDaysPerWeek = Math.min(value, input.workDaysPerWeek);
    }
    updateInput(patch);
  };

  const updateLevel = (field: LevelFieldDef, value: Level) => {
    const patch: Record<string, unknown> = {};
    patch[field.key] = value;
    updateInput(patch as Partial<JobInput>);
  };

  const updateBenefit = (key: keyof BenefitFlags, value: boolean) => {
    updateInput({
      benefits: { ...input.benefits, [key]: value },
    });
  };

  const updateRisk = (key: keyof RiskFlags, value: boolean) => {
    updateInput({
      risks: { ...input.risks, [key]: value },
    });
  };

  const handleNext = () => {
    if (isLast) {
      const full = buildFullResult(input);
      const { breakdown, modifier, explanation } = full;
      writeResult({
        score: breakdown.finalScore,
        rating: breakdown.rating,
        modifierId: modifier ? modifier.id : null,
        modifierLabel: modifier ? modifier.label : null,
        dimensions: breakdown.dimensions,
        appliedCaps: breakdown.appliedCaps,
        mainConclusion: explanation.mainConclusion,
        quip: explanation.quip,
        advantages: explanation.advantages,
        losses: explanation.losses,
        statsConsent: false,
        statsSubmissionState: "idle",
        annualCash: breakdown.annualCash,
        annualLoadHours: breakdown.annualLoadHours,
        effectiveHourlyPay: breakdown.effectiveHourlyPay,
      });

      // Save the very first rating ever
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          if (!window.localStorage.getItem("job_beast_first_rating_ever_v1")) {
            window.localStorage.setItem("job_beast_first_rating_ever_v1", breakdown.rating);
          }
        } catch (e) {
          // ignore
        }
      }

      setConsentRating(breakdown.rating);
      clearDraft();
      setShowConsent(true);
      return;
    }
    const nextStep = stepIdx + 1;
    writeDraftSync({ step: nextStep, input });
    setStepIdx(nextStep);
  };

  const handleBack = () => {
    if (stepIdx <= 0) return;
    const prevStep = stepIdx - 1;
    writeDraftSync({ step: prevStep, input });
    setStepIdx(prevStep);
  };

  const handleConsentAccept = () => {
    setShowConsent(false);
    patchResult({ statsConsent: true, statsSubmissionState: "pending" });
    navigate("/result");

    // Use the first-ever rating (localStorage) for upload, not the current one.
    // This prevents gaming: user fills carefully the 1st time (no upload),
    // then fills randomly the 2nd time just to unlock the leaderboard.
    let ratingToSubmit = consentRating;
    try {
      const firstEver = window.localStorage.getItem("job_beast_first_rating_ever_v1");
      if (firstEver) {
        ratingToSubmit = firstEver as RatingId;
      }
    } catch {
      // ignore
    }

    queueMicrotask(() => {
      if (!ratingToSubmit) return;
      submitFirstBrowserRating(ratingToSubmit, "new-assessment")
        .then((outcome) => {
          patchResult({
            statsSubmissionState:
              outcome === "submitted"
                ? "submitted"
                : outcome === "failed"
                  ? "failed"
                  : "submitted",
          });
        })
        .catch(() => patchResult({ statsSubmissionState: "failed" }));
    });
  };

  const handleConsentDecline = () => {
    setShowConsent(false);
    patchResult({ statsConsent: false });
    navigate("/result");
  };

  const renderStepContent = () => {
    switch (step.id) {
      case "money":
        return (
          <div
            className="field-group"
            data-qoder-id="qel-field-group-a1252e79"
            data-qoder-source='{"qoderId":"qel-field-group-a1252e79","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-group","loc":{"line":791,"column":11}}'
          >
            {MONEY_FIELDS.map((f) => (
              <div
                className="field"
                key={f.key}
                data-qoder-id="qel-field-03e97864"
                data-qoder-source='{"qoderId":"qel-field-03e97864","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field","loc":{"line":829,"column":15}}'
              >
                <label
                  className="field-label"
                  data-qoder-id="qel-field-label-1350aac3"
                  data-qoder-source='{"qoderId":"qel-field-label-1350aac3","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-label","loc":{"line":830,"column":17}}'
                >
                  {f.label}
                </label>
                {f.help && (
                  <p
                    className="field-help"
                    data-qoder-id="qel-field-help-820f9f75"
                    data-qoder-source='{"qoderId":"qel-field-help-820f9f75","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-help","loc":{"line":831,"column":28}}'
                  >
                    {f.help}
                  </p>
                )}
                <ChoiceGroup
                  options={f.options ?? []}
                  value={input[f.key as keyof JobInput] as number}
                  onChange={(v) => updateField(f.key, v)}
                  data-qoder-id="qel-choicegroup-79bff2a4"
                  data-qoder-source='{"qoderId":"qel-choicegroup-79bff2a4","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"choicegroup","loc":{"line":832,"column":17}}'
                />
              </div>
            ))}
          </div>
        );
      case "time":
        return (
          <div
            className="field-group"
            data-qoder-id="qel-field-group-9f252b53"
            data-qoder-source='{"qoderId":"qel-field-group-9f252b53","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-group","loc":{"line":809,"column":11}}'
          >
            {TIME_FIELDS.map((f) => (
              <div
                className="field"
                key={f.key}
                data-qoder-id="qel-field-03e97864"
                data-qoder-source='{"qoderId":"qel-field-03e97864","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field","loc":{"line":829,"column":15}}'
              >
                <label
                  className="field-label"
                  data-qoder-id="qel-field-label-1350aac3"
                  data-qoder-source='{"qoderId":"qel-field-label-1350aac3","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-label","loc":{"line":830,"column":17}}'
                >
                  {f.label}
                </label>
                {f.help && (
                  <p
                    className="field-help"
                    data-qoder-id="qel-field-help-820f9f75"
                    data-qoder-source='{"qoderId":"qel-field-help-820f9f75","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-help","loc":{"line":831,"column":28}}'
                  >
                    {f.help}
                  </p>
                )}
                <ChoiceGroup
                  options={f.options ?? []}
                  value={input[f.key as keyof JobInput] as number}
                  onChange={(v) => updateField(f.key, v)}
                  data-qoder-id="qel-choicegroup-79bff2a4"
                  data-qoder-source='{"qoderId":"qel-choicegroup-79bff2a4","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"choicegroup","loc":{"line":832,"column":17}}'
                />
              </div>
            ))}
            {/* Display years of experience range input (required by project test logic) */}
            <div
              className="field"
              key={EXPERIENCE_YEARS_FIELD.key}
              data-qoder-id="qel-field-03e97864"
              data-qoder-source='{"qoderId":"qel-field-03e97864","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field","loc":{"line":829,"column":15}}'
            >
              <label
                className="field-label"
                data-qoder-id="qel-field-label-1350aac3"
                data-qoder-source='{"qoderId":"qel-field-label-1350aac3","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-label","loc":{"line":830,"column":17}}'
              >
                {EXPERIENCE_YEARS_FIELD.label}
              </label>
              {EXPERIENCE_YEARS_FIELD.help && (
                <p
                  className="field-help"
                  data-qoder-id="qel-field-help-820f9f75"
                  data-qoder-source='{"qoderId":"qel-field-help-820f9f75","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-help","loc":{"line":831,"column":28}}'
                >
                  {EXPERIENCE_YEARS_FIELD.help}
                </p>
              )}
              <ChoiceGroup
                options={EXPERIENCE_YEARS_FIELD.options ?? []}
                value={input.yearsOfExperience}
                onChange={(v) => updateField(EXPERIENCE_YEARS_FIELD.key, v)}
                data-qoder-id="qel-choicegroup-79bff2a4"
                data-qoder-source='{"qoderId":"qel-choicegroup-79bff2a4","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"choicegroup","loc":{"line":832,"column":17}}'
              />
            </div>
          </div>
        );
      case "boundary":
        return (
          <div
            className="field-group"
            data-qoder-id="qel-field-group-a52534c5"
            data-qoder-source='{"qoderId":"qel-field-group-a52534c5","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-group","loc":{"line":827,"column":11}}'
          >
            {BOUNDARY_FIELDS.map((f) => (
              <div
                className="field"
                key={f.key}
                data-qoder-id="qel-field-03e97864"
                data-qoder-source='{"qoderId":"qel-field-03e97864","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field","loc":{"line":829,"column":15}}'
              >
                <label
                  className="field-label"
                  data-qoder-id="qel-field-label-1350aac3"
                  data-qoder-source='{"qoderId":"qel-field-label-1350aac3","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-label","loc":{"line":830,"column":17}}'
                >
                  {f.label}
                </label>
                {f.help && (
                  <p
                    className="field-help"
                    data-qoder-id="qel-field-help-820f9f75"
                    data-qoder-source='{"qoderId":"qel-field-help-820f9f75","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-help","loc":{"line":831,"column":28}}'
                  >
                    {f.help}
                  </p>
                )}
                <ChoiceGroup
                  options={f.options}
                  value={input[f.key as keyof JobInput] as Level}
                  onChange={(v) => updateLevel(f, v as Level)}
                  data-qoder-id="qel-choicegroup-79bff2a4"
                  data-qoder-source='{"qoderId":"qel-choicegroup-79bff2a4","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"choicegroup","loc":{"line":832,"column":17}}'
                />
              </div>
            ))}
          </div>
        );
      case "growth":
        return (
          <div
            className="field-group"
            data-qoder-id="qel-field-group-a825397e"
            data-qoder-source='{"qoderId":"qel-field-group-a825397e","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-group","loc":{"line":843,"column":11}}'
          >
            {GROWTH_FIELDS.map((f) => (
              <div
                className="field"
                key={f.key}
                data-qoder-id="qel-field-86ec8534"
                data-qoder-source='{"qoderId":"qel-field-86ec8534","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field","loc":{"line":845,"column":15}}'
              >
                <label
                  className="field-label"
                  data-qoder-id="qel-field-label-a849468d"
                  data-qoder-source='{"qoderId":"qel-field-label-a849468d","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-label","loc":{"line":846,"column":17}}'
                >
                  {f.label}
                </label>
                <ChoiceGroup
                  options={f.options}
                  value={input[f.key as keyof JobInput] as Level}
                  onChange={(v) => updateLevel(f, v as Level)}
                  data-qoder-id="qel-choicegroup-6dbda129"
                  data-qoder-source='{"qoderId":"qel-choicegroup-6dbda129","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"choicegroup","loc":{"line":847,"column":17}}'
                />
              </div>
            ))}
          </div>
        );
      case "stability":
        return (
          <div
            className="field-group"
            data-qoder-id="qel-field-group-9e31f5b3"
            data-qoder-source='{"qoderId":"qel-field-group-9e31f5b3","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-group","loc":{"line":858,"column":11}}'
          >
            {STABILITY_FIELDS.map((f) => (
              <div
                className="field"
                key={f.key}
                data-qoder-id="qel-field-82ec7ee8"
                data-qoder-source='{"qoderId":"qel-field-82ec7ee8","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field","loc":{"line":860,"column":15}}'
              >
                <label
                  className="field-label"
                  data-qoder-id="qel-field-label-a4494041"
                  data-qoder-source='{"qoderId":"qel-field-label-a4494041","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-label","loc":{"line":861,"column":17}}'
                >
                  {f.label}
                </label>
                <ChoiceGroup
                  options={f.options}
                  value={input[f.key as keyof JobInput] as Level}
                  onChange={(v) => updateLevel(f, v as Level)}
                  data-qoder-id="qel-choicegroup-71bda775"
                  data-qoder-source='{"qoderId":"qel-choicegroup-71bda775","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"choicegroup","loc":{"line":862,"column":17}}'
                />
              </div>
            ))}
          </div>
        );
      case "freedom":
        return (
          <div
            className="field-group"
            data-qoder-id="qel-field-group-a231fbff"
            data-qoder-source='{"qoderId":"qel-field-group-a231fbff","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-group","loc":{"line":873,"column":11}}'
          >
            {FREEDOM_FIELDS.map((f) => (
              <div
                className="field"
                key={f.key}
                data-qoder-id="qel-field-7eec789c"
                data-qoder-source='{"qoderId":"qel-field-7eec789c","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field","loc":{"line":875,"column":15}}'
              >
                <label
                  className="field-label"
                  data-qoder-id="qel-field-label-a04939f5"
                  data-qoder-source='{"qoderId":"qel-field-label-a04939f5","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-label","loc":{"line":876,"column":17}}'
                >
                  {f.label}
                </label>
                <ChoiceGroup
                  options={f.options}
                  value={input[f.key as keyof JobInput] as Level}
                  onChange={(v) => updateLevel(f, v as Level)}
                  data-qoder-id="qel-choicegroup-85bb885a"
                  data-qoder-source='{"qoderId":"qel-choicegroup-85bb885a","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"choicegroup","loc":{"line":877,"column":17}}'
                />
              </div>
            ))}
          </div>
        );
      case "benefits":
        return (
          <div
            className="field-group"
            data-qoder-id="qel-field-group-a4343dbc"
            data-qoder-source='{"qoderId":"qel-field-group-a4343dbc","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-group","loc":{"line":888,"column":11}}'
          >
            {BENEFIT_FIELDS.map((f) => (
              <ToggleCard
                key={f.key}
                label={f.label}
                desc={f.desc}
                checked={input.benefits[f.key]}
                onChange={(v) => updateBenefit(f.key, v)}
                data-qoder-id="qel-togglecard-bf813e6c"
                data-qoder-source='{"qoderId":"qel-togglecard-bf813e6c","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"togglecard","loc":{"line":890,"column":15}}'
              />
            ))}
          </div>
        );
      case "risk":
        return (
          <div
            className="field-group"
            data-qoder-id="qel-field-group-a63440e2"
            data-qoder-source='{"qoderId":"qel-field-group-a63440e2","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"field-group","loc":{"line":902,"column":11}}'
          >
            {RISK_FIELDS.map((f) => (
              <RiskCard
                key={f.key}
                label={f.label}
                desc={f.desc}
                checked={input.risks[f.key]}
                onChange={(v) => updateRisk(f.key, v)}
                data-qoder-id="qel-riskcard-6c5c9dc8"
                data-qoder-source='{"qoderId":"qel-riskcard-6c5c9dc8","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"riskcard","loc":{"line":904,"column":15}}'
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main
      className={["page-main", className].filter(Boolean).join(" ")}
      id="main"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <div
        className="container page-section assessment-step"
        data-component="AssessmentPage"
        data-qoder-id="qel-assessmentpage-43cdd264"
        data-qoder-source='{"qoderId":"qel-assessmentpage-43cdd264","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"assessmentpage","loc":{"line":921,"column":7}}'
      >
        <ProgressHeader
          current={stepIdx + 1}
          total={FORM_STEPS.length}
          title={step.title}
          description={step.description}
          data-qoder-id="qel-progressheader-d0bd83cb"
          data-qoder-source='{"qoderId":"qel-progressheader-d0bd83cb","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"progressheader","loc":{"line":922,"column":9}}'
        />
        {renderStepContent()}
      </div>
      <BottomActionBar
        onBack={stepIdx > 0 ? handleBack : null}
        onNext={handleNext}
        isLast={isLast}
        data-qoder-id="qel-bottomactionbar-d7c4259a"
        data-qoder-source='{"qoderId":"qel-bottomactionbar-d7c4259a","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"bottomactionbar","loc":{"line":930,"column":7}}'
      />
      <ConsentSheet
        open={showConsent}
        ratingZh={consentRating ? getRatingRule(consentRating).zh : undefined}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
        data-qoder-id="qel-consentsheet-a4839303"
        data-qoder-source='{"qoderId":"qel-consentsheet-a4839303","filePath":"react-vite/src/App.jsx","componentName":"AssessmentPage","elementRole":"consentsheet","loc":{"line":935,"column":7}}'
      />
    </main>
  );
}
