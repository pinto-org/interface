import { Link, useNavigate } from "react-router-dom";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { useEffect } from "react";

export default function Error404() {
  const navigate = useNavigate();
  const path = window.location.pathname;

  useEffect(() => {
    if (path !== "/404") {
      navigate("/404");
    }
  }, [path, navigate]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="p-8 mt-[10rem] rounded-[1rem] bg-pinto-off-white border-pinto-gray-2 border flex flex-col min-w-[calc(100%-2rem)] sm:min-w-[30rem]">
        <div className="flex flex-col gap-6 justify-center items-center">
          <img src={pintoIcon} className="w-10 h-10" />
          <div className="pinto-h3 sm:pinto-h2 self-center">Page not found.</div>
          <div className="pinto-body text-pinto-light">
            {"Looks like you took a wrong turn on your way to the Pinto farm :("}
          </div>
          <Link to="/overview" className="pinto-body text-pinto-green-4 hover:underline transition-all">
            Return to overview →
          </Link>
        </div>
      </div>
    </div>
  );
}
