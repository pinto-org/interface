import React from "react";
import ReactDOM from "react-dom/client";

import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import Providers from "./Providers.tsx";

import "./index.css";
import { activateDiscordLogging } from "./utils/error.ts";

// biome-ignore lint/style/noNonNullAssertion:
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Providers>
  </React.StrictMode>,
);

activateDiscordLogging();

// Log unhandled errors
window.addEventListener("error", (event) => {
  console.error("Unhandled error:", event.message, event.filename, event.lineno);
});
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled rejection:", event.reason);
});
