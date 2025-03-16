"use client";

import * as React from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TagsInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagsInput({
  value = [],
  onChange,
  placeholder = "Add tags...",
  maxTags = 10,
  className,
  ...props
}: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // If the last character is a comma, add the tag
    if (newValue.endsWith(",")) {
      addTag(newValue.slice(0, -1));
    } else {
      setInputValue(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove the last tag when backspace is pressed and input is empty
      removeTag(value.length - 1);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  // Focus the input when clicking on the container
  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-wrap gap-2 p-2 rounded-md min-h-10 transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900 focus-within:ring-zinc-600",
        className,
      )}
      onClick={focusInput}
    >
      {value.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="secondary"
          className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 border-none flex items-center gap-1 h-7 px-2 py-1"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            aria-label={`Remove ${tag} tag`}
            className="rounded-full hover:bg-zinc-600 p-0.5 ml-1"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      <div className="flex items-center flex-1 min-w-[120px]">
        {value.length === 0 && <Plus className="h-3 w-3 text-zinc-500 mr-1" />}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 h-7 text-sm text-zinc-100 placeholder:text-zinc-500"
          {...props}
        />
      </div>

      {value.length > 0 && value.length < maxTags && (
        <div className="text-xs text-zinc-500 ml-auto self-end">
          {value.length}/{maxTags}
        </div>
      )}
    </div>
  );
}
