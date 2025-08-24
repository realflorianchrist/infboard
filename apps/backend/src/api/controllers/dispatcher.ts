import express, {Router} from 'express';
import folderController from "@src/api/controllers/folder";
import {Index} from "@workspace/routes";
import fileController from "@src/api/controllers/file";
import authController from "@src/api/controllers/auth";
import dataController from "@src/api/controllers/data";


const dispatcher: Router = express.Router();

dispatcher.use(Index.auth.base, authController);
dispatcher.use(Index.folders.base, folderController);
dispatcher.use(Index.files.base, fileController);
dispatcher.use(Index.data.base, dataController);

export default dispatcher;
