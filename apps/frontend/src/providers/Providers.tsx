'use client'
import {PropsWithChildren, Suspense, useState} from "react";
import {FolderPathProvider} from "@/src/providers/FolderPathProvider";
import {ThemeProvider} from "@/src/providers/ThemeProvider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ContextMenuProvider} from "@/src/providers/ContextMenuProvider";

export default function Providers({children}: Readonly<PropsWithChildren>) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <Suspense>
                    <FolderPathProvider>
                        <ContextMenuProvider>
                            {children}
                        </ContextMenuProvider>
                    </FolderPathProvider>
                </Suspense>
            </ThemeProvider>
        </QueryClientProvider>
    );
}