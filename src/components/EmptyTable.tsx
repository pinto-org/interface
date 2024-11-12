import { Link } from "react-router-dom";
import Text from "./ui/Text";

type EmptyTableProps = {
  type?: "deposits" | "plots";
};

const EMPTY_TABLE_CONTENT = {
  deposits: {
    message: "Your Deposits will appear here.",
    link: {
      text: "Deposit in the Silo for Stalk and Seed",
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
} as const;

export default function EmptyTable({ type }: EmptyTableProps) {
  const renderContent = () => {
    const content = type && EMPTY_TABLE_CONTENT[type];

    if (!content) {
      return (
        <Text variant="body-light" color="light">
          No data found.
        </Text>
      );
    }

    return (
      <>
        <Text variant="body-light" color="light">
          {content.message}
        </Text>
        <Text variant="body-light" color="green4" className="hover:underline">
          <Link to={content.link.to}>{content.link.text}</Link>
        </Text>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full h-[22.5rem] border rounded-[0.75rem] bg-white border-pinto-gray-2">
      {renderContent()}
    </div>
  );
}
