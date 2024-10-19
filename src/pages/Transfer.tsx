import { Separator } from "@/components/ui/Separator";

function Transfer() {

    
    return (
        <div className="flex flex-col items-center">
        <div className="flex flex-col gap-6 w-[80%]">
          <div className="flex flex-col gap-2">
            <div className="inline-flex gap-2 items-center">
              <span className="font-[300] text-[3.5rem] text-black">Send tokens</span>
            </div>
            <div className="font-[400] text-xl text-pinto-gray-4">
              Move tokens to a different address on Base.
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
        </div>
        </div>
      </div>
    );
  }
  
  export default Transfer;
  