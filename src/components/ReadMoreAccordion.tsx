import { cn } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Col } from "./Container";

interface IReadMoreAccordion {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onChange?: (open: boolean) => void;
  inline?: boolean;
}
export default function ReadMoreAccordion({
  children,
  defaultOpen = false,
  onChange,
  inline = false,
}: IReadMoreAccordion) {
  const [open, setOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newValue = !open;
    setOpen(newValue);
    onChange?.(newValue);
  };

  if (inline) {
    return (
      <span>
        <AnimatePresence initial={false}>
          {open && (
            <motion.span
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={cn(
                "inline-block overflow-hidden align-top text-pinto-light sm:text-pinto-light pinto-sm-light sm:pinto-body-light leading-[140%] sm:leading-[140%]",
              )}
            >
              <span> {children}</span>
            </motion.span>
          )}
        </AnimatePresence>
        <span onClick={handleToggle} className="cursor-pointer pinto-body-light text-pinto-green">
          {open ? " Read less" : " Read more"}
        </span>
      </span>
    );
  }

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
            "text-pinto-light sm:text-pinto-light pinto-sm-light sm:pinto-body-light leading-[140%] sm:leading-[140%]",
            open ? "flex flex-col" : "",
          )}
        >
          {children}
        </motion.div>
      </Col>
      <div
        onClick={handleToggle}
        className={cn("cursor-pointer w-max pinto-body-light text-pinto-green", open && "mt-2")}
      >
        {open ? "Read less" : "Read more"}
      </div>
    </Col>
  );
}
