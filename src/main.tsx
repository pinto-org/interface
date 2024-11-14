import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Web3Provider } from "./Web3Provider.tsx";
import "./index.css";
import { Toaster } from "sonner";
import { CheckmarkIcon, CloseIconAlt } from "./components/Icons.tsx";
import LoadingSpinner from "./components/LoadingSpinner.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3Provider>
      <App />
      <Toaster
        toastOptions={{
          unstyled: true,
          className:
            "font-pinto left-0 right-0 mx-auto w-fit rounded-full text-wrap truncate max-w-[20rem] max-h-[10rem] text-[1.25rem] font-[340] bg-white border-pinto-gray-2 border items-center self-center shadow-[0_1px_8px_0px_#E9F0F6] px-4 py-2 flex flex-row gap-2",
          classNames: {
            loading: "px-6 gap-3 bg-white",
            success: "bg-white text-pinto-green-4",
            error: "gap-3 bg-white text-pinto-red-2",
            warning: "bg-white text-orange-500",
            info: "bg-white text-blue-500",
          },
        }}
        icons={{
          loading: <LoadingSpinner className="mt-[0.85rem]" size={52} />,
          error: <CloseIconAlt color={"currentColor"} />,
          success: (
            <div className="text-pinto-green-3">
              <CheckmarkIcon color={"currentColor"} />
            </div>
          ),
        }}
        position="bottom-center"
      />
    </Web3Provider>
  </React.StrictMode>,
);
