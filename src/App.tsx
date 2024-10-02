import { BrowserRouter, Route, Routes } from "react-router-dom";
import Frame from "./components/Frame";
import Field from "./pages/Field";
import Silo from "./pages/Silo";
import Swap from "./pages/Swap";
import Overview from "./pages/Overview";
import SiloToken from "./pages/SiloToken";
import { Market } from "./pages/Market";

function App() {

  return (
    <BrowserRouter>
      <Frame />
      <div className="pt-36 mx-4 mb-4 relative z-[1]">
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
