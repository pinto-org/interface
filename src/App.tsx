import { isDev } from "@/utils/utils";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScreenSizeGuard from "./ScreenSizeGuard";
import DevPage from "./components/DevPage";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/nav/nav/Navbar";
import Explorer from "./pages/Explorer";
import Field from "./pages/Field";
import Landing from "./pages/Landing";
// import { Market } from "./pages/Market";
import Overview from "./pages/Overview";
import Silo from "./pages/Silo";
import SiloToken from "./pages/SiloToken";
import Swap from "./pages/Swap";
import Transfer from "./pages/Transfer";
import LaunchArticle from "./pages/landing/Article";

function AppLayout({ children }) {
  return (
    <div className="relative">
      <Navbar />
      <ScrollToTop />
      <div className="relative z-[1] w-screen h-[calc(100vh-72px)] top-[72px] sm:h-[calc(100vh-124px)] sm:top-[124px]">
        {children}
      </div>
    </div>
  );
}

function ProtectedLayout() {
  return (
    <ScreenSizeGuard>
      <Routes>
        <Route path="/overview" element={<Overview />} />
        <Route path="/silo" element={<Silo />} />
        <Route path="/silo/:tokenAddress" element={<SiloToken />} />
        <Route path="/silo/:tokenAddress/:action" element={<SiloToken />} />
        <Route path="/field" element={<Field />} />
        <Route path="/field/:action" element={<Field />} />
        <Route path="/market" element={<Swap />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/transfer/:mode" element={<Transfer />} />
        <Route path="/explorer/" element={<Explorer />} />
        <Route path="/explorer/:tab" element={<Explorer />} />
        {isDev() && <Route path="/dev" element={<DevPage />} />}
      </Routes>
    </ScreenSizeGuard>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route index element={<Landing />} />
          <Route path="/announcing-pinto" element={<LaunchArticle />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
