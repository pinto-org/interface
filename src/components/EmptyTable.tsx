import { Link } from "react-router-dom";
import Text from "./ui/Text";

type EmptyTableProps = {
  type?: "deposits" | "plots" | "plots-field";
};

const EMPTY_TABLE_CONTENT = {
  deposits: {
    message: "Your Deposits will appear here.",
    link: {
      text: "Deposit in the Silo for Stalk and Seeds",
      to: "/silo",
    },
  },
  plots: {
    message: "Your Pods will appear here.",
    link: {
      text: "Sow in the Field for Pods",
      to: "/field",
    },
  },
  "plots-field": {
    message: "Your Pods will appear here.",
    link: {
      text: "",
      to: "",
    },
  },
} as const;

export default function EmptyTable({ type }: EmptyTableProps) {
  const renderContent = () => {
    const content = type && EMPTY_TABLE_CONTENT[type];

    if (!content) {
      return <div className="pinto-body-light text-pinto-light">No data found.</div>;
    }

    return (
      <>
        <div className="pinto-body-light text-pinto-light">{content.message}</div>
        {type !== "plots-field" && (
          <div className="pinto-body-light text-pinto-green-4 hover:underline">
            <Link to={content.link.to}>{content.link.text}</Link>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full h-[22.5rem] border rounded-[0.75rem] bg-pinto-off-white border-pinto-gray-2">
      {renderContent()}
    </div>
  );
}
