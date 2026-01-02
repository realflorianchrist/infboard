'use client'
import * as React from "react"
import {useEffect, useMemo, useState} from "react"
import SearchBar from "@/src/components/searchbar/SearchBar"
import {Popover, PopoverAnchor, PopoverContent} from "@workspace/ui/components/popover"
import {useGetSearchPreviews} from "@/src/api/hooks/api_hooks/searchHooks"
import {isFolder} from "@workspace/types";
import SearchResultContainer from "@/src/components/searchbar/SearchResultContainer";
import FolderItem from "@/src/components/data_table/FolderItem";
import FileItem from "@/src/components/data_table/FileItem";
import ResultPath from "@/src/components/searchbar/ResultPath";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {useRouter} from "next/navigation";
import routes from "@/src/constants/routes";

type Props = {
    isSearching: boolean
    setIsSearching: (v: boolean) => void
}

export default function SearchBarWithResults({isSearching, setIsSearching}: Props) {
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);

    const {data: result} = useGetSearchPreviews(q);
    const {path, pushFolderById} = useFolderPath();
    const router = useRouter();

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
                        <SearchResultContainer
                            key={d.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                if (isFolder(d)) {
                                    pushFolderById(d.id);
                                } else if (d.parentFolderId !== ROOT_FOLDER_ID) {
                                    pushFolderById(d.parentFolderId!);
                                } else {
                                    router.push(routes.HOME);
                                }
                                setOpen(false)
                            }}
                        >
                            {isFolder(d)
                                ? <FolderItem folder={d}/>
                                : <FileItem file={d}/>
                            }
                            <ResultPath parentFolderId={d.parentFolderId} className={'self-end'}/>
                        </SearchResultContainer>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
