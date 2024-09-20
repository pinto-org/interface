import { BrowserRouter, Route, Routes } from "react-router-dom";
import Frame from "./components/Frame";
import Field from "./pages/Field";
import { Market } from "./pages/Market";
import Silo from "./pages/Silo";
import StartPage from "./pages/StartPage";
import Swap from "./pages/Swap";
import { anvilTestClient } from "./wagmi";
import Overview from "./pages/Overview";

function App() {
  anvilTestClient.impersonateAccount({ address: "0xe543357d4f0eb174cfc6bed6ef5e7ab5762f1b2b" });

  return (
    <BrowserRouter>
      <Frame />
      <div className="mt-0 mx-4 mb-4">
        <Routes>
          {/* <Route index element={<StartPage />} /> */}
          <Route index element={<Overview />} />
          <Route path="/silo" element={<Silo />} />
          <Route path="/field" element={<Field />} />
          <Route path="/market" element={<Market />} />
          <Route path="/market/:mode" element={<Market />} />
          <Route path="/market/:mode/:id" element={<Market />} />
          <Route path="/swap" element={<Swap />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
