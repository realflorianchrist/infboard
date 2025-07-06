import { Folder } from "@workspace/types/data";

export const dummyFolderTree: Folder[] = [
    {
        id: "folder-1",
        name: "Projekte",
        files: [
            {
                id: "file-root-1",
                name: "Übersicht.pdf",
                version: 1,
                url: "/files/uebersicht.pdf",
                extension: "pdf",
                size: 125000,
                updatedAt: "2025-06-01T10:00:00Z",
                userName: "Admin",
                comment: "Projektübersicht für alle Projekte"
            }
        ],
        children: [
            {
                id: "folder-1-1",
                name: "Projekt A",
                files: [
                    {
                        id: "file-a-1",
                        name: "Projektbeschreibung.txt",
                        version: 1,
                        url: "/files/projektbeschreibung.txt",
                        extension: "txt",
                        size: 7500,
                        updatedAt: "2025-06-10T09:00:00Z",
                        userName: "Florian Christ",
                        comment: "Kurzfassung"
                    },
                    {
                        id: "file-a-2",
                        name: "Budget.xlsx",
                        version: 2,
                        url: "/files/budget.xlsx",
                        extension: "xlsx",
                        size: 230000,
                        updatedAt: "2025-06-12T11:30:00Z",
                        userName: "Sebastian Wernli"
                    }
                ],
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
                    },
                    {
                        id: "folder-1-1-2",
                        name: "Berichte",
                        files: [
                            {
                                id: "file-4",
                                name: "Kostenübersicht.xlsx",
                                version: 5,
                                url: "/files/kosten.xlsx",
                                extension: "xlsx",
                                size: 850000,
                                updatedAt: "2025-07-02T09:00:00Z",
                                userName: "Lukas Planer",
                                meta: ["Finanzen"],
                                comment: "Letztes Update mit neuen Preisen"
                            }
                        ]
                    }
                ]
            },
            {
                id: "folder-1-2",
                name: "Projekt B",
                children: [
                    {
                        id: "folder-1-2-1",
                        name: "Modelle",
                        files: [
                            {
                                id: "file-5",
                                name: "3D-Modell.rvt",
                                version: 2,
                                url: "/files/modell.rvt",
                                extension: "rvt",
                                size: 4096000,
                                updatedAt: "2025-06-10T13:20:00Z",
                                userName: "Anna Beispiel",
                                meta: ["Revit", "Modell"]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
