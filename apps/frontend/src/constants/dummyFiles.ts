import {Folder} from "@workspace/types/data";

export const dummyFolderTree: Folder[] = [
    {
        id: "folder-1",
        name: "Projekte",
        children: [
            {
                id: "folder-1-1",
                name: "Projekt A",
                children: [
                    {
                        id: "folder-1-1-1",
                        name: "Pläne",
                        files: [
                            {
                                id: "file-1",
                                name: "Grundriss.pdf",
                                version: 3,
                                url: "/files/grundriss.pdf",
                                extension: "pdf",
                                size: 1024000,
                                updatedAt: "2025-07-01T12:00:00Z",
                                userName: "Max Mustermann",
                                meta: ["EG", "Genehmigt"],
                                comment: "Aktuelle Version mit allen Änderungen"
                            },
                            {
                                id: "file-2",
                                name: "Schnitt.dwg",
                                version: 1,
                                url: "/files/schnitt.dwg",
                                extension: "dwg",
                                size: 2048000,
                                updatedAt: "2025-06-15T08:30:00Z",
                                userName: "Erika Musterfrau"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "folder-2",
        name: "Dokumentation",
        files: [
            {
                id: "file-3",
                name: "Baubeschrieb.docx",
                version: 2,
                url: "/files/baubeschrieb.docx",
                extension: "docx",
                size: 512000,
                updatedAt: "2025-06-20T14:45:00Z",
                userName: "Florian Christ",
                comment: "Entwurf überarbeitet"
            }
        ]
    }
];
