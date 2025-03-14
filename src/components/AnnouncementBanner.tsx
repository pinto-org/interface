import { Link, useLocation, useNavigate } from "react-router-dom";

export const renderAnnouncement = true;

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
          to={"/whitepaper"}
          rel="noopener noreferrer"
          target="_blank"
          className="pinto-sm text-pinto-green-4 cursor-pointer underline inline"
        >
          The Pinto Whitepaper is now available!
        </Link>
      </div>
    </div>
  );
};
