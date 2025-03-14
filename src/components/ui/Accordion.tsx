"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { cn } from "@/utils/utils";
import { cva, VariantProps } from "class-variance-authority";

const Accordion = AccordionPrimitive.Root

const accordionItemVariants = cva("",
  {
    variants: {
      border: {
        default: "border-none",
        bottom: "border-b",
      }
    }
  }
)

export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
  & VariantProps<typeof accordionItemVariants>

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, border, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ border }), className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

export type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  noIcon?: boolean;
  underlineOnHover?: boolean;
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, noIcon, underlineOnHover = false, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 pinto-lg text-pinto-secondary transition-all text-left [&[data-state=open]>svg]:rotate-180",
        underlineOnHover && "hover:underline",
        className
      )}
      {...props}
    >
      {children}
      {!noIcon && <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
