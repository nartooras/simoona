import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { readRuntimeDataFromDocument } from "./app/runtime-data";

const rootElement = document.getElementById("app");

if (!(rootElement instanceof HTMLElement)) {
  throw new Error("Missing #app root element.");
}

const runtimeData = readRuntimeDataFromDocument(
  `${window.location.pathname}${window.location.search}`
);

window.__SIMOONA_RUNTIME_DATA__ = runtimeData;

createRoot(rootElement).render(
  <StrictMode>
    <App initialData={runtimeData} />
  </StrictMode>
);
