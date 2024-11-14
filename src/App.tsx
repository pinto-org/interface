import { isDev, logEnv } from "@/utils/utils";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DevPage from "./components/DevPage";
import Navbar from "./components/nav/nav/Navbar";
import Field from "./pages/Field";
import { Market } from "./pages/Market";
import Overview from "./pages/Overview";
import Silo from "./pages/Silo";
import SiloToken from "./pages/SiloToken";
import Swap from "./pages/Swap";
import Transfer from "./pages/Transfer";

function App() {
  logEnv();
  return (
    <BrowserRouter>
      <div className="relative">
        <Navbar />
        <div
          // 72px is navbar height on mobile
          // 124px is navbar height on desktop (includes nested links)
          className={`relative z-[1] w-screen h-[calc(100vh-72px)] top-[72px] sm:h-[calc(100vh-124px)] sm:top-[124px]`}
        >
          <Routes>
            {/* <Route index element={<StartPage />} /> */}
            <Route index element={<Overview />} />
            <Route path="/silo" element={<Silo />} />
            <Route path="/silo/:tokenAddress" element={<SiloToken />} />
            <Route path="/silo/:tokenAddress/:action" element={<SiloToken />} />
            <Route path="/field" element={<Field />} />
            <Route path="/field/:action" element={<Field />} />
            <Route path="/podmarket" element={<Market />} />
            <Route path="/podmarket/:mode" element={<Market />} />
            <Route path="/podmarket/:mode/:id" element={<Market />} />
            <Route path="/market" element={<Swap />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/transfer/:mode" element={<Transfer />} />
            {isDev() && <Route path="/dev" element={<DevPage />} />}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
