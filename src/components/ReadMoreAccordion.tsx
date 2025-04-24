import { cn } from "@/utils/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { Col } from "./Container";

interface IReadMoreAccordion {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onChange?: (open: boolean) => void;
}
export default function ReadMoreAccordion({ children, defaultOpen = false, onChange }: IReadMoreAccordion) {
  const [open, setOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newValue = !open;
    setOpen(newValue);
    onChange?.(newValue);
  };

  return (
    <Col>
      <Col className={cn("relative overflow-hidden")}>
        <motion.div
          initial={{ height: defaultOpen ? "auto" : 0, opacity: defaultOpen ? 1 : 0 }}
          animate={{
            height: open ? "auto" : 0,
            opacity: open ? 1 : 0,
          }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={cn(
            "text-pinto-light sm:text-pinto-light pinto-sm-light sm:pinto-body-light",
            open ? "flex flex-col" : "",
          )}
        >
          {children}
        </motion.div>
      </Col>
      <div
        onClick={handleToggle}
        className={cn("cursor-pointer w-max pinto-sm-light text-pinto-green", open && "mt-2")}
      >
        {open ? "Read less" : "Read more"}
      </div>
    </Col>
  );
}
