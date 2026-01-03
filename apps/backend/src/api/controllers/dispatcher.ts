import express, {Router} from 'express';
import folderController from "@src/api/controllers/folder";
import {apiRoutes} from "@workspace/routes";
import fileController from "@src/api/controllers/file";
import authController from "@src/api/controllers/auth";
import dataController from "@src/api/controllers/data";
import openController from "@src/api/controllers/open";
import searchController from "@src/api/controllers/search";

/**
 * Central API route dispatcher.
 *
 * Responsibilities:
 * - Creates a single Express router instance for the API.
 * - Mounts all feature-specific controllers under their respective base paths.
 * - Keeps route registration centralized and predictable.
 *
 * Mounted routes:
 * - Authentication routes under `apiRoutes.auth.base`
 * - Folder routes under `apiRoutes.folders.base`
 * - File routes under `apiRoutes.files.base`
 * - Data routes under `apiRoutes.data.base`
 * - Search routes under `apiRoutes.search.base`
 *
 * Intended use:
 * - Imported and mounted once in the main Express application, for example:
 *   `app.use("/api", dispatcher);`
 */
const dispatcher: Router = express.Router();

dispatcher.use(apiRoutes.auth.base, authController);
dispatcher.use(apiRoutes.folders.base, folderController);
dispatcher.use(apiRoutes.files.base, fileController);
dispatcher.use(apiRoutes.data.base, dataController);
dispatcher.use(apiRoutes.search.base, searchController);

export default dispatcher;
