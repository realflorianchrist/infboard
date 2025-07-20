export const ApiRoutes = {
    base: '/api',

    folders: {
        base: '/folders',
        all: '/all',
        byId: (id: string) => `/${id}`,
        add: '/add',
        update: '/update',
        delete: (id: string) => `/delete/${id}`,
    },

    files: {
        base: '/files',
        all: '/all',
        byId: (id: string) => `/${id}`,
        downloadUrlById: (id: string) => `/download/${id}`,
        downloadUrlsByFolderId: (folderId: string) => `/download/folder/${folderId}`,
        add: '/add',
        update: '/update',
        delete: (id: string) => `/delete/${id}`,
        rollback: (id: string) => `/rollback/${id}`,
    },
};