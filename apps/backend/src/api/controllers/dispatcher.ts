import express, {Router} from 'express';
import folderController from "@src/api/controllers/folder";
import {Routes} from "@workspace/routes/routes";
import fileController from "@src/api/controllers/file";


const dispatcher: Router = express.Router();

dispatcher.use(Routes.folders.base, folderController);
dispatcher.use(Routes.files.base, fileController);

export default dispatcher;
