import express, {Router} from 'express';
import folderController from "@src/api/controllers/folder";
import {Routes} from "@workspace/routes/routes";


const dispatcher: Router = express.Router();

dispatcher.use(Routes.folders.base, folderController);

export default dispatcher;
