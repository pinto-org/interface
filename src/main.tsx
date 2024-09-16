import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import App from "./App.tsx";
import { testConfig } from "./wagmi.ts";

import "./index.css";
import { Toaster } from "sonner";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={testConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster richColors toastOptions={{ className: "font-nacelle" }} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
