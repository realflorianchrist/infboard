'use client'
import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import SearchBar from "@/src/components/header/SearchBar"
import { Popover, PopoverAnchor, PopoverContent } from "@workspace/ui/components/popover"
import { useGetSearchPreviews } from "@/src/api/hooks/api_hooks/searchHooks"

type Props = {
    isSearching: boolean
    setIsSearching: (v: boolean) => void
}

export default function SearchBarWithResults({ isSearching, setIsSearching }: Props) {
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);

    const { data: result } = useGetSearchPreviews(q);

    const previews = useMemo(() => result?.searchPreviews ?? [], [result]);
    const hasResults = previews.length > 0;

    useEffect(() => {
        if (q.trim().length === 0) {
            setOpen(false);
            return;
        }
        setOpen(hasResults);
    }, [q, hasResults]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverAnchor asChild>
                <SearchBar
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    value={q}
                    onChange={(e) => {
                        setQ(e.target.value)
                    }}
                    onFocus={() => {
                        if (q.trim().length > 0) setOpen(hasResults)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setOpen(false)
                    }}
                    autoComplete="off"
                    autoFocus
                />
            </PopoverAnchor>

            <PopoverContent
                side="bottom"
                align="center"
                className="w-[30rem] p-1"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="max-h-64 overflow-auto rounded-md">
                    {previews.map((d) => (
                        <button
                            key={d.id}
                            type="button"
                            className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent/15"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                setQ(d.name)
                                setOpen(false)
                            }}
                        >
                            {d.name}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
