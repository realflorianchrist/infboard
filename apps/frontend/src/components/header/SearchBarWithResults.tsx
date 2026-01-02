'use client'
import * as React from "react"
import {useMemo, useState} from "react"
import SearchBar from "@/src/components/header/SearchBar";
import {Popover, PopoverAnchor, PopoverContent} from "@workspace/ui/components/popover";

const results = ["depa", "vesys", "oop1", "oop2", "cloud", "sysad"]

const filterResults = (q: string) => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return results.filter(r => r.toLowerCase().includes(s)).slice(0, 10)
}

type Props = {
    isSearching: boolean;
    setIsSearching: (v: boolean) => void;
}

export default function SearchBarWithResults({isSearching, setIsSearching}: Props) {
    const [q, setQ] = useState("")
    const [open, setOpen] = useState(false)

    const filtered = useMemo(() => filterResults(q), [q])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverAnchor asChild>
                <SearchBar
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    value={q}
                    onChange={(e) => {
                        const nextQ = e.target.value
                        setQ(nextQ)
                        setOpen(filterResults(nextQ).length > 0)
                    }}
                    onFocus={() => setOpen(filterResults(q).length > 0)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') setOpen(false)
                    }}
                    autoComplete={'off'}
                />
            </PopoverAnchor>
            <PopoverContent
                side={'bottom'}
                align={'center'}
                className={'w-[30rem] p-1'}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className={'max-h-64 overflow-auto rounded-md'}>
                    {filtered.map((r) => (
                        <button
                            key={r}
                            type={'button'}
                            className={'w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent/15'}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                setQ(r)
                                setOpen(false)
                            }}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
