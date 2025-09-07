export const apiRoutes = {
    base: '/api',

    auth: {
        base: '/open/auth',
        register: '/register',
        login: '/login',
        validateToken: '/validate-token',
        confirmEmail: '/confirmEmail',
        resendConfirmEmail: '/resend-confirm-email',
    },

    folders: {
        base: '/folders',
        all: '/all',
        byId: (id: string) => `/${id}`,
        add: '/add',
        update: '/update',
        delete: (id: string) => `/delete/${id}`,
        hasDeletedFiles: (id: string) => `/has-deleted-files/${id}`,
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

    data: {
        base: '/data',
        move: '/move',
    }
};