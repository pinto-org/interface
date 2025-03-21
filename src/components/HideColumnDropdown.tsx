
import eyeballCrossed from "@/assets/misc/eyeball-crossed.svg";
import IconImage from "@/components/ui/IconImage";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { nonHideableFields, SeasonColumn } from "@/pages/explorer/SeasonsExplorer";
import useIsMobile from "@/hooks/display/useIsMobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import { useState } from "react";
interface HideColumnDropdownProps {
    seasonColumns: SeasonColumn[]
    hiddenFields: string[]
    toggleColumn: (id: string) => void
    resetAllHiddenColumns: () => void
}

export const HideColumnDropdown = ({ seasonColumns, hiddenFields, toggleColumn, resetAllHiddenColumns }: HideColumnDropdownProps) => {

    const isMobile = useIsMobile();
    const columnDropdownLabel = hiddenFields.length > 0 ? `${hiddenFields.length} column${hiddenFields.length > 1 ? 's' : ''} hidden` : 'Hide Columns'
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    const trigger = (
        <Button className="justify-between sm:h-6 h-8 rounded-full" variant="outline">
            <IconImage className="mr-2" src={eyeballCrossed} size={4} />
            {columnDropdownLabel}
        </Button>
    )

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={() => toggle()}>
                <DrawerTrigger>{trigger}</DrawerTrigger>
                <DrawerContent className="px-4 pb-2">
                    <div className="max-h-[300px] overflow-auto my-2">
                        {seasonColumns.map(({ id, dropdownName, name }) => {
                            if (nonHideableFields.includes(id)) {
                                return null
                            }
                            const checked = hiddenFields.includes(id)
                            const extraClasses = hiddenFields.includes(id) ? 'line-through' : ''
                            return (
                                <div key={id} onClick={() => toggleColumn(id)} className={`flex items-center h-[36px] gap-2 ${extraClasses}`}>
                                    <IconImage className={`${!checked ? 'opacity-100' : 'opacity-0'} flex items-center justify-center`} src={eyeballCrossed} size={4} />
                                    <span >{dropdownName || name}</span>
                                </div>
                            )
                        })}
                    </div>
                    <Button className="w-full text-base h-10" onClick={resetAllHiddenColumns} variant="outline">Reset</Button>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="border border-pinto-gray-2 bg-pinto-gray-1 text-base">
                {trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="overflow-auto" avoidCollisions={false} onCloseAutoFocus={() => { }} align="start">
                {seasonColumns.map(({ id, dropdownName, name }) => {
                    if (nonHideableFields.includes(id)) {
                        return null
                    }
                    const checked = hiddenFields.includes(id)
                    const extraClasses = hiddenFields.includes(id) ? 'line-through' : ''
                    return (
                        <DropdownMenuCheckboxItem key={id} onSelect={(e) => e.preventDefault()} // no auto close on selection
                            checkedIcon={<IconImage src={eyeballCrossed} size={4} />}
                            checked={checked}
                            onCheckedChange={() => toggleColumn(id)}
                            className={`group hover:bg-pinto-gray-1 ${extraClasses}`}
                        >
                            {!checked && <IconImage className="opacity-0 group-hover:opacity-50 absolute left-2 flex items-center justify-center" src={eyeballCrossed} size={4} />}
                            {dropdownName || name}
                        </DropdownMenuCheckboxItem>
                    )
                })}
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Button className="w-full text-base h-8 rounded-sm" onClick={resetAllHiddenColumns} variant="outline">Reset</Button> </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}