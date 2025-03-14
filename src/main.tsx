import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import Providers from "./Providers.tsx";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";

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
