import express, {Router} from "express";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {FileMeta, NewFileInput} from "@workspace/types/data";
import {StatusCodes} from "http-status-codes";
import {ApiError} from "@src/api/utils/apiError";
import {ErrorType} from "@workspace/types/apiResponses";
import {FileModel} from "@src/models/File";
import {generateFileKey, generatePresignedUploadUrl} from "@src/services/s3Service";
import logger from "jet-logger";

const fileController: Router = express.Router();

fileController.post(
    ApiRoutes.files.add,
    handleRequest<{ file: NewFileInput }, { file: FileMeta }>(
        async (req) => {

            const {file} = req.body;

            try {
                const newFile = await FileModel.create({
                    name: file.name,
                    contentType: file.contentType,
                    size: file.size,
                    comment: file.comment,
                    parentFolderId: file.parentFolderId,
                });

                const url = await generatePresignedUploadUrl(
                    generateFileKey(newFile._id.toString()), newFile.contentType
                );

                await FileModel.findByIdAndUpdate(newFile._id, { url });

                return {
                    status: StatusCodes.OK,
                    data: {
                        file: {
                            id: newFile._id.toString(),
                            name: newFile.name,
                            url: url,
                            contentType: newFile.contentType,
                            size: newFile.size,
                            comment: newFile.comment,
                            parentFolderId: newFile.parentFolderId,
                        },
                    },
                };
            } catch (error) {
                logger.err(error);
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.API_ERROR);
            }
        }
    )
);


export default fileController;