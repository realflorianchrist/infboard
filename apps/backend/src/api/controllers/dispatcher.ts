import express, {Router} from 'express';
import folderController from "@src/api/controllers/folder";
import {apiRoutes} from "@workspace/routes";
import fileController from "@src/api/controllers/file";
import authController from "@src/api/controllers/auth";
import dataController from "@src/api/controllers/data";
import openController from "@src/api/controllers/open";
import searchController from "@src/api/controllers/search";


const dispatcher: Router = express.Router();

dispatcher.use(apiRoutes.auth.base, authController);
dispatcher.use(apiRoutes.folders.base, folderController);
dispatcher.use(apiRoutes.files.base, fileController);
dispatcher.use(apiRoutes.data.base, dataController);
dispatcher.use(apiRoutes.search.base, searchController);

dispatcher.use("/open", openController);

export default dispatcher;
