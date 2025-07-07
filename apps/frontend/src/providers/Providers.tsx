'use client'
import {PropsWithChildren, useState} from "react";
import {FolderPathProvider} from "@/src/providers/FolderPathProvider";
import {ThemeProvider} from "@/src/providers/ThemeProvider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export default function Providers({children}: Readonly<PropsWithChildren>) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <FolderPathProvider>
                    {children}
                </FolderPathProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}