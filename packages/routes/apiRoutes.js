"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRoutes = void 0;
exports.ApiRoutes = {
    base: '/api',
    folders: {
        base: '/folders',
        all: '/all',
        byId: (id) => `/${id}`,
        add: '/add',
        update: '/update',
        delete: (id) => `/delete/${id}`,
    },
    files: {
        base: '/files',
        all: '/all',
        byId: (id) => `/${id}`,
        add: '/add',
        update: '/update',
        delete: (id) => `/delete/${id}`,
    },
};
