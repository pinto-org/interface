import { Buffer } from "buffer";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Web3Provider } from "./Web3Provider.tsx";
import "./index.css";
import { Toaster } from "sonner";

globalThis.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3Provider>
      <App />
      <Toaster
        richColors
        toastOptions={{
          className: "font-pinto rounded-full text-[1.25rem] font-[340] shadow-none border-pinto-gray-2 border",
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </Web3Provider>
  </React.StrictMode>,
);
