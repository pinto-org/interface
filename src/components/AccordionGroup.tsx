import { HTMLAttributes } from "react";
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
}

export default function AccordionGroup({ groupTitle, items, ...props }: IAccordionGroup) {
  const defaultChecked = items.map(({ key }) => key);
  return (
    // Gap is 5 b/c accordion trigger has p-y of 4
    <div className="flex flex-col gap-5 w-full" {...props}>
      <div className="pinto-h3 text-pinto-primary">{groupTitle}</div>
      <Accordion
        defaultChecked
        className="AccordionRoot"
        type="multiple"
        defaultValue={defaultChecked}
      >
        <div className="flex flex-col w-full gap-1">
          {items.map(({ title, content, key }, i) => (
            <AccordionItem className="AccordionItem" value={key} key={`accordion-group-item-${i}-${key}`}>
              <AccordionTrigger>
                {typeof title === "string" ? (
                  <div className="pinto-lg text-pinto-secondary">{title}</div>
                ) : (
                  title
                )}
              </AccordionTrigger>
              <AccordionContent>
                {typeof title === "string" ? (
                  <div className="pinto-sm font-thin text-pinto-light">{content}</div>
                ) : (
                  content
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
      </Accordion>
    </div>
  )
}