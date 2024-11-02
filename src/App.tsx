import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/nav/nav/Navbar";
import Field from "./pages/Field";
import { Market } from "./pages/Market";
import Overview from "./pages/Overview";
import Silo from "./pages/Silo";
import SiloToken from "./pages/SiloToken";
import Swap from "./pages/Swap";
import Transfer from "./pages/Transfer";
import DevPage from "./components/DevPage";

function App() {
  return (
    <BrowserRouter>
      <div className="relative">
        <Navbar />
        <div className="pt-40 mx-4 mb-4 relative z-[1]">
          <Routes>
            {/* <Route index element={<StartPage />} /> */}
            <Route index element={<Overview />} />
            <Route path="/silo" element={<Silo />} />
            <Route path="/silo/:tokenAddress" element={<SiloToken />} />
            <Route path="/field" element={<Field />} />
            <Route path="/podmarket" element={<Market />} />
            <Route path="/podmarket/:mode" element={<Market />} />
            <Route path="/podmarket/:mode/:id" element={<Market />} />
            <Route path="/market" element={<Swap />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/transfer/:mode" element={<Transfer />} />
            {import.meta.env.DEV && <Route path="/dev" element={<DevPage />} />}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
