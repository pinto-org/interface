import { BrowserRouter, Route, Routes } from "react-router-dom";
import Frame from "./components/Frame";
import Navi from "./components/Navi";
import Field from "./pages/Field";
import { Market } from "./pages/Market";
import Silo from "./pages/Silo";
import StartPage from "./pages/StartPage";
import Swap from "./pages/Swap";
import { anvilTestClient } from "./wagmi";

function App() {
  anvilTestClient.impersonateAccount({ address: "0x43B9F935c798522aaaCB2bFEa2F407cE5A291e9D" });

  return (
    <div className="font-nacelle">
      <Frame />
      <BrowserRouter>
        <div className="flex flex-row justify-center items-center my-4">
          <Navi />
        </div>
        <div className="mt-0 mx-4 mb-4">
          <Routes>
            <Route index element={<StartPage />} />
            <Route path="/silo" element={<Silo />} />
            <Route path="/field" element={<Field />} />
            <Route path="/market" element={<Market />} />
            <Route path="/market/:mode" element={<Market />} />
            <Route path="/market/:mode/:id" element={<Market />} />
            <Route path="/swap" element={<Swap />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
