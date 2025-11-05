import { cn, isDev } from "@/utils/utils";
import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DevPage from "./components/DevPage";
import PageMetaWrapper from "./components/PageMetaWrapper";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/nav/nav/Navbar";
import { externalLinks } from "./constants/links";

// Create two main chunks: Landing page and the rest of the app
const Landing = lazy(() => import("./pages/Landing"));
const ProtectedLayoutLazy = lazy(() => import("./ProtectedLayout"));
const Whitepaper = lazy(() => import("./pages/Whitepaper"));

import Footer from "@/components/Footer";
import { MobileActionBarProvider } from "@/components/MobileActionBarContext";
import TourOfTheFarm from "@/components/TourOfTheFarm";
import { useLocation } from "react-router-dom";
import DevToolsInstall from "./pages/DevToolsInstall";
import Hypernative from "./pages/Hypernative";
import { useMetaCRM } from "./utils/meta-crm";

export const RENDER_HYPERNATIVE = false;

function HypernativeActive() {
  return <Hypernative />;
}

function AppLayout({ children }) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {!isLandingPage && <Navbar />}
      <ScrollToTop />
      <div className={cn("relative z-[1] w-screen flex-1")}>{children}</div>
      {!isLandingPage && <Footer />}
    </div>
  );
}

function App() {
  useMetaCRM();

  if (RENDER_HYPERNATIVE) {
    return <HypernativeActive />;
  }

  return (
    <BrowserRouter>
      <MobileActionBarProvider>
        <AppLayout>
          <Routes>
            <Route
              index
              element={
                <PageMetaWrapper metaKey="index">
                  <Suspense fallback={<div className="h-screen w-screen" />}>
                    <Landing />
                  </Suspense>
                </PageMetaWrapper>
              }
            />
            <Route
              path="/whitepaper"
              element={
                <Suspense fallback={<div className="h-screen w-screen" />}>
                  <Whitepaper />
                </Suspense>
              }
            />
            <Route
              path="/*"
              element={
                <Suspense fallback={<div className="h-screen w-screen" />}>
                  <ProtectedLayoutLazy />
                </Suspense>
              }
            />
            <Route
              path="/announcing-pinto"
              Component={() => {
                window.location.replace(externalLinks.announcingPinto);
                return null;
              }}
            />
          </Routes>
        </AppLayout>
      </MobileActionBarProvider>
    </BrowserRouter>
  );
}

export default App;
