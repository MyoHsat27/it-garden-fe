"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  id: number | string;
  label: string;
  disabled?: boolean;
}

interface SearchableSelectProps {
  value?: number | string;
  onChange: (value?: number | string) => void;
  options?: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  allowUnselect?: boolean;
}

export function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled,
  allowUnselect = true,
}: SearchableSelectProps) {
  const selected = options.find((opt) => opt.id === value);

  const handleSelect = (id: number | string) => {
    if (allowUnselect && id === value) {
      onChange(undefined);
    } else {
      onChange(id);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            !selected && "text-muted-foreground"
          )}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt.id}
                value={opt.label}
                onSelect={() => handleSelect(opt.id)}
                disabled={opt.disabled}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    opt.id === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
