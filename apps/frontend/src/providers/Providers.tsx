import {PropsWithChildren} from "react";
import {FolderPathProvider} from "@/src/providers/FolderPathProvider";
import {ThemeProvider} from "@/src/providers/ThemeProvider";

export default function Providers({children}: Readonly<PropsWithChildren>) {
    return (
        <ThemeProvider>
            <FolderPathProvider>
                {children}
            </FolderPathProvider>
        </ThemeProvider>
    );
}