"use client";

import * as React from "react";

import { cn } from "@/utils/cn";

interface SearchbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Searchbar({ className, ...props }: SearchbarProps) {
  return (
    <div
      className={cn(
        "w-full rounded-lg pl-2 pr-1 py-1 border-2 border-double border-zinc-300 flex items-center gap-3",
        className,
      )}
      {...props}
    >
      <input
        type="text"
        placeholder="What are we looking for today?"
        className="w-full bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none text-sm px-1"
      />
      <button className="bg-zinc-800 text-zinc-100 rounded-md px-4 py-2 hover:bg-zinc-800/[0.9]">
        Search
      </button>
    </div>
  );
}
