import { isDev } from "@/utils/utils";
import { Navigate, Route, Routes } from "react-router-dom";
import DevPage from "./components/DevPage";
import PageMetaWrapper from "./components/PageMetaWrapper";
import Collection from "./pages/Collection";
import Error404 from "./pages/Error404";
import Explorer from "./pages/Explorer";
import Field from "./pages/Field";
import { Market as MarketPage } from "./pages/Market";
import Overview from "./pages/Overview";
import Silo from "./pages/Silo";
import SiloToken from "./pages/SiloToken";
import Swap from "./pages/Swap";
import Transfer from "./pages/Transfer";
import NewUserView from "./pages/overview/NewUserView";

export default function ProtectedLayout() {
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
      <Route path="/sPinto" element={<SiloToken />} />
      <Route path="/wrap" element={<Navigate to="/sPinto" replace />} />
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
            <MarketPage />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/market/pods/:mode"
        element={
          <PageMetaWrapper metaKey="market">
            <MarketPage />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/market/pods/:mode/:id"
        element={
          <PageMetaWrapper metaKey="market">
            <MarketPage />
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
      <Route
        path="/explorer/"
        element={
          <PageMetaWrapper metaKey="explorer">
            <Explorer />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/explorer/:tab"
        element={
          <PageMetaWrapper metaKey="explorer">
            <Explorer />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/collection"
        element={
          <PageMetaWrapper metaKey="nftCollection">
            <Collection />
          </PageMetaWrapper>
        }
      />
      <Route
        path="/404"
        element={
          <PageMetaWrapper metaKey="404">
            <Error404 />
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
