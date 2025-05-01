import { HideColumnDropdown } from "@/components/HideColumnDropdown";
import FrameAnimator from "@/components/LoadingSpinner";
import { SeasonsTable } from "@/components/tables/SeasonsTable";
import { Button } from "@/components/ui/Button";
import useIsMobile from "@/hooks/display/useIsMobile";
import useSeasonsData from "@/state/useSeasonsData";
import { useSunData } from "@/state/useSunData";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
export interface SeasonColumn {
  id: string;
  name: string;
  classes: string;
  dropdownName?: string;
  width: number;
}

export const nonHideableFields = ["season"];

export const seasonColumns: SeasonColumn[] = [
  { id: "season", name: "Season", classes: "text-left  w-[150px]", width: 150 },
  {
    id: "instantDeltaP",
    name: "Instant. ∆P",
    dropdownName: "Instantaneous ∆P",
    classes: "text-right  w-[125px]",
    width: 125,
  },
  { id: "twaDeltaP", name: "TWA ∆P", classes: "text-right  w-[125px]", width: 125 },
  { id: "pintoSupply", name: "Pinto Supply", classes: "text-right  w-[135px]", width: 135 },
  { id: "totalSoil", name: "Total Soil", classes: "text-right  w-[110px]", width: 110 },
  { id: "soilSown", name: "Soil Sown", classes: "text-right  w-[125px]", width: 125 },
  { id: "timeSown", name: "Time All Sown", classes: "text-right  w-[150px]", width: 150 },
  { id: "price", name: "Price", classes: "text-right  w-[125px]", width: 125 },
  { id: "twaPrice", name: "TWA Price", classes: "text-right  w-[125px]", width: 125 },
  { id: "l2sr", name: "L2SR", classes: "text-right  w-[150px]", width: 150 },
  { id: "podRate", name: "Pod Rate", classes: "text-right  w-[150px]", width: 150 },
  { id: "deltaDemand", name: "Delta Demand", classes: "text-right  w-[150px]", width: 150 },
  { id: "cropScalar", name: "Crop Scalar", classes: "text-right  w-[150px]", width: 150 },
  { id: "cropRatio", name: "Crop Ratio", classes: "text-right  w-[125px]", width: 125 },
  { id: "temperature", name: "Max Temperature", classes: "text-right w-[175px]", width: 175 },
];

export interface SortColumn {
  column: string;
  dir: "asc" | "desc";
}

const PAGE_SIZE = 100;

const SeasonsExplorer = () => {
  const localStorageHiddenFields = JSON.parse(localStorage.getItem("pinto.seasonsExplorer.hiddenFields") || "[]");
  const currentSeason = useSunData().current;

  const [hiddenFields, setHiddenFields] = useState<string[]>(localStorageHiddenFields);
  const [displayPage, setDisplayPage] = useState<number | string>("1");
  const [page, setPage] = useState(1);
  const [jumpToSeason, setJumpToSeason] = useState(0);
  const [seasons, setSeasons] = useState<any>([]);
  const [fromSeason, setFromSeason] = useState(currentSeason);

  const totalPages = Math.ceil(currentSeason / PAGE_SIZE);
  const isMobile = useIsMobile();
  const seasonsData = useSeasonsData(fromSeason, currentSeason);

  const calculateSeasonPageToJump = (season: number) => {
    return Math.min(Math.floor((currentSeason - season) / PAGE_SIZE) + 1, totalPages);
  };

  useEffect(() => {
    if (seasonsData?.data?.length && page * PAGE_SIZE > seasonsData?.data?.length) {
      setFromSeason(Math.max(0, fromSeason - 1000));
    }
    setSeasons(seasonsData?.data?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
  }, [seasonsData?.data?.length, page, seasonsData?.isFetching]);

  useEffect(() => {
    setFromSeason(Math.max(0, currentSeason - 1000));
  }, [currentSeason]);

  const goToPreviousPage = () => {
    setPage(Math.max(page - 1, 1));
    setDisplayPage(Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setPage(Math.min(page + 1, totalPages));
    setDisplayPage(Math.min(page + 1, totalPages));
  };

  const setHiddenFieldsWithLocalStorage = (newHiddenFields: string[]) => {
    localStorage.setItem("pinto.seasonsExplorer.hiddenFields", JSON.stringify(newHiddenFields));
    setHiddenFields(newHiddenFields);
  };

  const hideColumn = (id: string) => {
    if (nonHideableFields.includes(id)) {
      return;
    }
    const newHiddenFields = [...hiddenFields, id];
    setHiddenFieldsWithLocalStorage(newHiddenFields);
  };

  const toggleColumn = (id: string) => {
    const newHiddenFields = hiddenFields.includes(id)
      ? hiddenFields.filter((field) => field !== id)
      : [...hiddenFields, id];
    setHiddenFieldsWithLocalStorage(newHiddenFields);
  };

  const onDisplayPageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const asNumber = Math.min(Math.max(Number(displayPage), 1), totalPages);
      const clampedPage = Number.isNaN(asNumber) ? 1 : asNumber;
      setPage(clampedPage);
      setDisplayPage(clampedPage);
    }
  };

  const resetAllHiddenColumns = () => {
    setHiddenFieldsWithLocalStorage([]);
  };

  const onJumpToSeasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const season = Math.min(currentSeason, Number(e.target.value));
    setJumpToSeason(season);
  };

  const handleJumpToSeason = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const seasonToJumpTo = calculateSeasonPageToJump(jumpToSeason);
    setPage(seasonToJumpTo);
    setDisplayPage(seasonToJumpTo);
  };

  const onJumpToSeasonKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJumpToSeason(e);
    }
  };

  const isLoading = seasonsData.isFetching && seasonsData.data?.length === 0;

  return (
    <>
      <div className="flex flex-row gap-x-2 ml-4">
        <HideColumnDropdown
          hiddenFields={hiddenFields}
          toggleColumn={toggleColumn}
          resetAllHiddenColumns={resetAllHiddenColumns}
        />
      </div>
      {isLoading ? (
        <FrameAnimator className="flex self-center" size={250} />
      ) : (
        <SeasonsTable seasonsData={seasons} hiddenFields={hiddenFields} hideColumn={hideColumn} />
      )}
      <div className="self-center w-[100vw] flex justify-center flex-row gap-x-2 bg-pinto-gray-1 border border-pinto-gray-2 h-[50px] fixed bottom-0 left-0 right-0 font-medium z-[1]">
        <div className="w-full min-w-0 2xl:max-w-[1550px] 3xl:max-w-[2560px] flex items-center gap-2 sm:px-12 px-8 3xl:px-4">
          <Button
            variant="pagination"
            size="xs"
            onClick={goToPreviousPage}
            disabled={page === 1 || seasonsData.isFetching}
            className="cursor-pointer"
          >
            <ArrowLeftIcon />
          </Button>
          <span>Page</span>
          <input
            className="border border-pinto-gray-4 w-12 px-[4px] text-center rounded-[4px]"
            type="text"
            value={displayPage}
            onKeyDown={onDisplayPageKeyDown}
            onChange={(e) => setDisplayPage(e.target.value)}
          />
          <span> of {totalPages}</span>
          <Button
            variant="pagination"
            size="xs"
            onClick={goToNextPage}
            disabled={page === totalPages || seasonsData.isFetching}
            className="cursor-pointer"
          >
            <ArrowLeftIcon className=" rotate-180" />
          </Button>
          {!isMobile && (
            <>
              <span>Jump to Season</span>
              <input
                className="border border-pinto-gray-4 w-14 px-[4px] text-center rounded-[4px]"
                type="text"
                onKeyDown={onJumpToSeasonKeyDown}
                value={jumpToSeason}
                onChange={onJumpToSeasonChange}
              />
              <Button
                variant="pagination"
                size="xs"
                onClick={handleJumpToSeason}
                disabled={seasonsData.isFetching}
                className="cursor-pointer"
              >
                <ArrowLeftIcon className=" rotate-180" />
              </Button>
            </>
          )}
          <span className="text-pinto-gray-4">{currentSeason} Records</span>
        </div>
      </div>
    </>
  );
};
export default SeasonsExplorer;
