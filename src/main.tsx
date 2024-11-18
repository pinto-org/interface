import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import Providers from "./Providers.tsx";
import ScreenSizeGuard from "./ScreenSizeGuard.tsx";

import "./index.css";

// biome-ignore lint/style/noNonNullAssertion:
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <ScreenSizeGuard>
        <App />
      </ScreenSizeGuard>
    </Providers>
  </React.StrictMode>,
);
