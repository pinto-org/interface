
import eyeballCrossed from "@/assets/misc/eyeball-crossed.svg";
import chevronDown from "@/assets/misc/ChevronDown.svg";
import IconImage from "@/components/ui/IconImage";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { nonHideableFields, SeasonColumn } from "@/pages/explorer/SeasonsExplorer";

interface HideColumnDropdownProps {
    seasonColumns: SeasonColumn[]
    hiddenFields: string[]
    toggleColumn: (id: string) => void
    resetAllHiddenColumns: () => void
}

export const HideColumnDropdown = ({ seasonColumns, hiddenFields, toggleColumn, resetAllHiddenColumns }: HideColumnDropdownProps) => {

    const columnDropdownLabel = hiddenFields.length > 0 ? `${hiddenFields.length} column${hiddenFields.length > 1 ? 's' : ''} hidden` : 'Hide Columns'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="rounded-full border border-pinto-gray-2 bg-pinto-gray-1 text-base h-6">
                <Button className="justify-between" variant="outline">
                    <IconImage className="mr-2" src={eyeballCrossed} size={4} />
                    {columnDropdownLabel}
                    <IconImage className="ml-2" src={chevronDown} size={4} />
                </Button>
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