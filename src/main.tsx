import { render } from "preact";
import { App } from "@/app/App";
import "@/styles/tokens.css";
import "@/styles/themes.css";
import "@/styles/base.css";
import "@/styles/controls.css";
import "@/styles/pages.css";

const root = document.getElementById("app");
if (root) {
  render(<App />, root);
}
