import {useAddFile} from "@/src/api/hooks/api_hooks/fileHooks";
import {useQueryClient} from "@tanstack/react-query";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {usePutFileToUrl} from "@/src/api/hooks/s3_hooks/fileHooks";

type UploadResult = {
    file: File;
    status: 'success' | 'error';
    error?: Error;
};

export function useUploadFiles() {
    const {mutateAsync: addFile} = useAddFile();
    const {mutateAsync: uploadToUrl} = usePutFileToUrl();
    // const { mutateAsync: deleteFile } = useDeleteFile();
    const queryClient = useQueryClient();

    const uploadFiles = async (files: File[], parentFolderId?: string): Promise<UploadResult[]> => {
        const results: UploadResult[] = [];

        for (const file of files) {
            try {
                const response = await addFile({
                    file: {
                        name: file.name,
                        contentType: file.type,
                        size: file.size,
                        parentFolderId,
                    }
                });

                try {
                    await uploadToUrl({file, uploadUrl: response.file.url});
                    results.push({file, status: 'success'});
                } catch (uploadError) {
                    // todo: delete file from db
                    // try {
                    //     await deleteFile({ fileId: response.file.id });
                    //     console.warn(`Rollback erfolgreich für Datei ${file.name}`);
                    // } catch (rollbackError) {
                    //     console.error(`Rollback fehlgeschlagen für Datei ${file.name}`, rollbackError);
                    // }

                    results.push({file, status: 'error', error: uploadError as Error});
                }
            } catch (creationError) {
                results.push({file, status: 'error', error: creationError as Error});
            }
        }

        await queryClient.invalidateQueries({
            queryKey: [`${ApiRoutes.folders.base}${ApiRoutes.folders.byId(parentFolderId ?? 'root')}`]
        });

        return results;
    };

    return {uploadFiles};
}
