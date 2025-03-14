import { Web3Provider } from "./Web3Provider";
import StateProvider from "./state/StateProvider";

import { Toaster } from "sonner";
import { CheckmarkIcon, CloseIconAlt } from "./components/Icons.tsx";
import LoadingSpinner from "./components/LoadingSpinner.tsx";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3Provider>
      <StateProvider>
        {children}
        <div className="sm:[&_[data-sonner-toaster]]:w-full max-sm:[&_[data-sonner-toaster]]:!w-full max-sm:[&_[data-sonner-toast]]:!w-fit">
          <Toaster
            toastOptions={{
              unstyled: true,
              className:
                "font-pinto left-0 right-0 mx-auto w-fit rounded-full break-words truncate max-h-[5rem] text-[1.25rem] font-[340] bg-white border-pinto-gray-2 border items-center self-center shadow-[0_1px_8px_0px_#E9F0F6] px-4 py-2 flex flex-row gap-2",
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
        </div>
      </StateProvider>
    </Web3Provider>
  );
};

export default Providers;
