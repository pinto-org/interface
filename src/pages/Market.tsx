import AccordionGroup, { IBaseAccordionContent } from "@/components/AccordionGroup";
import { navLinks } from "@/components/nav/nav/Navbar";
import { Separator } from "@/components/ui/Separator";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AllActivityTable } from "./market/AllActivityTable";
import { FarmerActivityTable } from "./market/FarmerActivityTable";
import MarketModeSelect from "./market/MarketModeSelect";
import { PodListingsTable } from "./market/PodListingsTable";
import { PodOrdersTable } from "./market/PodOrdersTable";
import CreateListing from "./market/actions/CreateListing";
import CreateOrder from "./market/actions/CreateOrder";
import FillListing from "./market/actions/FillListing";
import FillOrder from "./market/actions/FillOrder";

const TABLE_SLUGS = ["activity", "listings", "orders", "my-activity"];
const TABLE_LABELS = ["Activity", "Listings", "Orders", "My Activity"];

export function Market() {
  const { mode, id } = useParams();
  const [tab, handleChangeTab] = useState(TABLE_SLUGS[0]);
  const navigate = useNavigate();

  // Upon initial page load only, navigate to a page other than Activity if the url is granular.
  // In general it is allowed to be on Activity tab with these granular urls, hence the empty dependency array.
  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally run on initial mount only. `mode` will be populated.
  useEffect(() => {
    if (mode === "buy") {
      handleChangeTab(TABLE_SLUGS[1]);
    } else if (mode === "sell") {
      handleChangeTab(TABLE_SLUGS[2]);
    }
  }, []);

  const handleChangeTabFactory = useCallback(
    (selection: string) => () => {
      if (selection === TABLE_SLUGS[1]) {
        navigate(`/market/pods/buy/fill`);
      } else if (selection === TABLE_SLUGS[2]) {
        navigate(`/market/pods/sell/fill`);
      }
      handleChangeTab(selection);
    },
    [navigate],
  );

  const handleSecondaryTabClick = useCallback(
    (v: string) => {
      if (v === "fill") {
        handleChangeTab(!mode || mode === "buy" ? TABLE_SLUGS[1] : TABLE_SLUGS[2]);
      }
    },
    [mode],
  );

  const viewMode = !mode || mode === "buy" ? "buy" : "sell";
  const fillView = !!id;

  return (
    <>
      <div className="sm:hidden mt-[100px] flex flex-col gap-4 items-center justify-center">
        <p className="text-center text-gray-500">Your screen size is too small to access the Pod Market.</p>
        <p className="hidden sm:block text-center text-gray-500">
          If you're on Desktop, zoom out on your browser to access the Pod Market.
        </p>
      </div>
      <div className="hidden sm:block">
        <div className={`flex flex-col`}>
          <div className="flex flex-row gap-4 border-t border-pinto-gray-2 mt-4 h-[calc(100vh-7.75rem)] lg:h-[calc(100vh-11rem)] overflow-hidden">
            <div className="flex flex-col flex-grow ml-4">
              <div className="flex gap-10 ml-2.5 mt-8 mb-[1.625rem]">
                {TABLE_SLUGS.map((s, idx) => (
                  <p
                    key={s}
                    className={`pinto-h4 cursor-pointer ${s === tab ? "text-pinto-primary" : "text-pinto-light hover:text-pinto-green-3"}`}
                    onClick={handleChangeTabFactory(s)}
                  >
                    {TABLE_LABELS[idx]}
                  </p>
                ))}
              </div>
              <Separator />
              <div className="flex-grow overflow-auto scrollbar-none -ml-4 -mr-4">
                {tab === TABLE_SLUGS[0] && <AllActivityTable />}
                {tab === TABLE_SLUGS[1] && <PodListingsTable />}
                {tab === TABLE_SLUGS[2] && <PodOrdersTable />}
                {tab === TABLE_SLUGS[3] && <FarmerActivityTable />}
              </div>
            </div>
            <div className="flex flex-col gap-4 self-start px-4 py-4 border-l border-pinto-gray-2 h-full w-[384px] min-w-[384px] 3xl:w-[540px] 3xl:min-w-[540px] flex-shrink-0 overflow-auto scrollbar-none">
              <div>
                <MarketModeSelect onSecondarySelectionChange={handleSecondaryTabClick} />
                {viewMode === "buy" && !fillView && <CreateOrder />}
                {viewMode === "buy" && fillView && <FillListing />}
                {viewMode === "sell" && !fillView && <CreateListing />}
                {viewMode === "sell" && fillView && <FillOrder />}
              </div>
              <Separator className="bg-pinto-gray-2" />
              <div className="pt-4">
                <AccordionGroup
                  items={FAQ_ITEMS}
                  size="small"
                  groupTitle="Frequently Asked Questions"
                  allExpanded={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- MARKET FAQ ----------

const FAQ_ITEMS: IBaseAccordionContent[] = [
  {
    key: "what-is-the-pod-market",
    title: "What is the Pod Market?",
    content:
      "The Pod Market is where farmers can buy Pods from other farmers on the secondary market. Pods are Pinto's unique debt asset, minted whenever the protocol borrows Pinto from the open market.",
  },
  {
    key: "why-purchase-pods-on-the-pod-market",
    title: "Why buy Pods on the Pod Market instead of directly in the Field?",
    content:
      "In the Field, you can buy new Pods at the back of the queue or redeem your Pods once they reach the front. The Pod Market lets you buy or sell Pods at any position in the line.",
  },
  {
    key: "pod-listing-vs-pod-order",
    title: "What's the difference between a Pod Listing and a Pod Order?",
    content:
      "A Pod Listing is an offer to sell Pods at a specified price, while a Pod Order is an offer to buy Pods at a specified price. Farmers can both create and fill Pod Listings and Pod Orders.",
  },
  {
    key: "how-can-i-learn-more-on-the-pod-marketplace",
    title: "How can I learn more about the Pod marketplace?",
    content: (
      <>
        Head to the{" "}
        <Link
          className="text-pinto-green-4 hover:underline transition-all"
          to={`${navLinks.docs}/farm/toolshed/pod-market`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Pinto docs
        </Link>{" "}
        for more info, or ask any questions in the{" "}
        <Link
          className="text-pinto-green-4 hover:underline transition-all"
          to={navLinks.discord}
          rel="noopener noreferrer"
          target="_blank"
        >
          discord
        </Link>{" "}
        community!
      </>
    ),
  },
];
