import META from "@/constants/meta";
import { cn, isDev } from "@/utils/utils";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageMetaWrapper from "./components/PageMetaWrapper";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/nav/nav/Navbar";
import { externalLinks } from "./constants/links";
import { useMetaCRM } from "./utils/meta-crm";

// Eagerly load small/critical components
import Error404 from "./pages/Error404";

// Lazy load chunk 1: Landing page
const Landing = lazy(() => import("./pages/Landing"));
const Whitepaper = lazy(() => import("./pages/Whitepaper"));
const NewUserView = lazy(() => import("./pages/overview/NewUserView"));

// Lazy load chunk 2: Explorer page
const Explorer = lazy(() => import("./pages/Explorer"));

// Lazy load chunk 3: Main application components
const Overview = lazy(() => import("./pages/Overview"));
const Silo = lazy(() => import("./pages/Silo"));
const SiloToken = lazy(() => import("./pages/SiloToken"));
const Field = lazy(() => import("./pages/Field"));
const Swap = lazy(() => import("./pages/Swap"));
const Market = lazy(() => import("./pages/Market"));
const Transfer = lazy(() => import("./pages/Transfer"));
const DevPage = lazy(() => import("./components/DevPage"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-pinto-green border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ScrollToTop />
      <div className={cn("relative z-[1] w-screen")}>
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </div>
    </div>
  );
}

function ProtectedLayout() {
  return (
    <Routes>
      <Route
        path="/overview"
        element={
          <PageMetaWrapper metaKey="overview">
            <Overview />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/how-pinto-works"
        element={
          <PageMetaWrapper metaKey="overview">
            <NewUserView />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/silo"
        element={
          <PageMetaWrapper metaKey="silo">
            <Silo />
          </PageMetaWrapper>
        }
      />
      <Route path="/silo/:tokenAddress" element={<SiloToken />} />
      <Route path="/wrap" element={<SiloToken />} />
      <Route
        path="/field"
        element={
          <PageMetaWrapper metaKey="field">
            <Field />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/swap"
        element={
          <PageMetaWrapper metaKey="swap">
            <Swap />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/market/pods"
        element={
          <PageMetaWrapper metaKey="market">
            <Market />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/market/pods/:mode"
        element={
          <PageMetaWrapper metaKey="market">
            <Market />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/market/pods/:mode/:id"
        element={
          <PageMetaWrapper metaKey="market">
            <Market />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/transfer"
        element={
          <PageMetaWrapper metaKey="transfer">
            <Transfer />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/transfer/:mode"
        element={
          <PageMetaWrapper metaKey="transfer">
            <Transfer />
          </PageMetaWrapper>
        }
      />
      {isDev() && <Route path="/dev" element={<DevPage />} />}
      <Route
        path="*"
        element={
          <PageMetaWrapper metaKey="404">
            <Error404 />
          </PageMetaWrapper>
        }
      />
    </Routes>
  );
}

// Separate Explorer routes for chunk 2
function ExplorerRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageMetaWrapper metaKey="explorer">
            <Explorer />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/:tab"
        element={
          <PageMetaWrapper metaKey="explorer">
            <Explorer />
          </PageMetaWrapper>
        }
      />
    </Routes>
  );
}

function App() {
  useMetaCRM();

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Chunk 1: Landing page routes */}
          <Route
            index
            element={
              <PageMetaWrapper metaKey="index">
                <Landing />
              </PageMetaWrapper>
            }
          />
          <Route
            path="/how-pinto-works"
            element={
              <PageMetaWrapper metaKey="overview">
                <NewUserView />
              </PageMetaWrapper>
            }
          />
          <Route path="/whitepaper" element={<Whitepaper />} />

          {/* Chunk 2: Explorer routes */}
          <Route path="/explorer/*" element={<ExplorerRoutes />} />

          {/* Chunk 3: Main app routes */}
          <Route path="/*" element={<ProtectedLayout />} />

          {/* External redirect */}
          <Route
            path="/announcing-pinto"
            Component={() => {
              window.location.replace(externalLinks.announcingPinto);
              return null;
            }}
          />

          {/* 404 route */}
          <Route
            path="/404"
            element={
              <PageMetaWrapper metaKey="404">
                <Error404 />
              </PageMetaWrapper>
            }
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
