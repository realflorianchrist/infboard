import { useState } from "react";
import {useAddFile, useRollbackFile} from "@/src/api/hooks/api_hooks/fileHooks";
import { useQueryClient } from "@tanstack/react-query";
import { ApiRoutes } from "@workspace/routes";
import { usePutFileToUrl } from "@/src/api/hooks/s3_hooks/fileHooks";
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {ValidationErrorType} from "@workspace/types";
import {ApiClientError} from "@/src/api/client/client";

type UploadResult = {
    file: File;
    status: 'success' | 'error';
    error?: Error;
    validationErrors?: ValidationErrorType[];
};

export const useUploadFiles = () => {
    const [isUploading, setIsUploading] = useState(false);

    const { mutateAsync: addFile } = useAddFile();
    const { mutateAsync: uploadToUrl } = usePutFileToUrl();
    const { mutateAsync: rollbackFile } = useRollbackFile();
    const queryClient = useQueryClient();

    const uploadFiles = async (
        files: {file: File; comment: string}[],
        parentFolderId?: string
    ): Promise<UploadResult[]> => {
        setIsUploading(true);
        const results: UploadResult[] = [];

        for (const {file, comment} of files) {
            try {
                const response = await addFile({
                    file: {
                        name: file.name,
                        contentType: file.type,
                        size: file.size,
                        comment,
                        parentFolderId,
                    },
                });

                try {
                    await uploadToUrl({ file, uploadUrl: response.file.url! });
                    results.push({ file, status: "success" });
                } catch (uploadError) {
                    try {
                        await rollbackFile({ file: response.file });
                    } catch (rollbackError) {
                        console.error(`Rollback failed for file: ${file.name}`, rollbackError);
                    }

                    results.push({
                        file,
                        status: "error",
                        error: uploadError as Error,
                    });
                }
            } catch (creationError) {

                const validationErrors = creationError instanceof ApiClientError
                    ? creationError.validationErrors
                    : undefined;

                results.push({
                    file,
                    status: "error",
                    error: creationError as Error,
                    validationErrors: validationErrors,
                });
            }
        }

        await queryClient.invalidateQueries({
            queryKey: [
                `${ApiRoutes.folders.base}${ApiRoutes.folders.byId(parentFolderId ?? ROOT_FOLDER_ID)}`,
            ],
        });

        setIsUploading(false);
        return results;
    };

    return { uploadFiles, isUploading };
};
