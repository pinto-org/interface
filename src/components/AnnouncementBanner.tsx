import { Link, useLocation, useNavigate } from "react-router-dom";

export const renderAnnouncement = true;

const ANNOUNCEMENT_URL =
  "https://mirror.xyz/0xEA13D1fB14934E41Ee7074198af8F089a6d956B5/hH9-i4IJrU_BBiRRh2m8tc29JsQnrEt1AeGzbH1w06k";

export default function AnnouncementBanner() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on the overview page
  /*
  if (location.pathname === "/announcing-pinto") {
    return null;
  }
  */

  return (
    <div className="w-full hidden sm:block">
      <div className="font-pinto inset-0 bg-gradient-light flex items-center justify-center">
        <div className="bg-white shadow-none border-b border-pinto-gray-4 p-2 w-full text-center">
          <AnnouncementBannerContent />
        </div>
      </div>
    </div>
  );
}

const AnnouncementBannerContent = () => {
  return (
    <div className="flex flex-row justify-center">
      <div className="pinto-sm text-black text-center">
        <Link
          to={ANNOUNCEMENT_URL}
          rel="noopener noreferrer"
          target="_blank"
          className="pinto-sm text-pinto-green-4 cursor-pointer underline inline"
        >
          The Soil Orderbook, powered by Tractor, is live! 🚜
        </Link>
      </div>
    </div>
  );
};
