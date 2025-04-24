import { cn } from "@/utils/utils";
import clsx from "clsx";
import React, { HTMLAttributes, useRef } from "react";
import { Col } from "./Container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/Accordion";

/**
 * @oaram key - the key of the item. Accordion group uses this value to differentiate between items
 * @param title - the title of the accordion item
 * @param content - the content of the accordion item
 */
export interface IBaseAccordionContent {
  key: string;
  title: string | JSX.Element;
  content: string | JSX.Element;
}

/**
 * @param groupTitle - The title of the accordion group.
 * @param items - The items to display in the accordion group.
 */
export interface IAccordionGroup extends HTMLAttributes<HTMLDivElement> {
  groupTitle: string | JSX.Element;
  items: IBaseAccordionContent[];
  allExpanded?: boolean;
  size?: "large" | "small";
}

const AccordionGroup = ({ groupTitle, items, allExpanded = true, size = "large", ...props }: IAccordionGroup) => {
  const defaultValue = useRef<string[]>(allExpanded ? items.map(({ key }) => key) : []);

  return (
    // Gap is 5 b/c accordion trigger has p-y of 4
    <Col className={`w-full ${styles.titleGap[size]}`} {...props}>
      <div className={`text-pinto-primary ${styles.title[size]}`}>{groupTitle}</div>
      <Accordion defaultValue={defaultValue.current} className="AccordionRoot" type="multiple">
        <Col className="w-full gap-1">
          {items.map(({ title, content, key }, i) => (
            <AccordionItem className="AccordionItem" value={key} key={`accordion-group-item-${i}-${key}`}>
              <AccordionTrigger className={`text-pinto-secondary ${styles.trigger[size]}`}>{title}</AccordionTrigger>
              <AccordionContent className="pinto-sm font-thin text-pinto-light">{content}</AccordionContent>
            </AccordionItem>
          ))}
        </Col>
      </Accordion>
    </Col>
  );
};

export default React.memo(AccordionGroup);

const styles = {
  trigger: {
    large: clsx("pinto-h3"),
    small: clsx("pinto-body py-2"),
  },
  titleGap: {
    large: clsx("gap-5"),
    small: clsx("gap-0"),
  },
  groupGap: {
    large: clsx("gap-1"),
    small: clsx("gap-1"),
  },
  title: {
    large: clsx("pinto-h3"),
    small: clsx("pinto-h4 py-3"),
  },
} as const;
