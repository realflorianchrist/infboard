// import {useAddFile, useDeleteFileUrl} from "@/src/api/hooks/api_hooks/fileHooks";
// import {useDeleteFileFromUrl, usePutFileToUrl} from "@/src/api/hooks/s3_hooks/fileHooks";
// import {useQueryClient} from "@tanstack/react-query";
// import {ApiRoutes} from "@workspace/routes/apiRoutes";
// import {useState} from "react";
//
// type DeleteResult = {
//     id: string;
//     status: 'success' | 'error';
//     error?: Error;
// };
//
// export const useDeleteFile = () => {
//     const [isDeleting, setIsDeleting] = useState(false);
//
//     const { mutateAsync: deleteFile } = useDeleteFileUrl();
//     const { mutateAsync: deleteFromUrl } = useDeleteFileFromUrl();
//
//     const queryClient = useQueryClient();
//
//     const uploadFiles = async (
//         id: string,
//         parentFolderId?: string
//     ): Promise<DeleteResult[]> => {
//         setIsDeleting(true);
//         const results: DeleteResult[] = [];
//
//             try {
//                 const response = await deleteFile({id});
//
//                 try {
//                     await deleteFromUrl({ url: response.url! });
//                     results.push({ id, status: "success" });
//                 } catch (deleteError) {
//                     // TODO: Rollback
//                     // try {
//                     //     await deleteFile({ fileId: response.file.id });
//                     //     console.warn(Rollback erfolgreich für Datei ${file.name});
//                     // } catch (rollbackError) {
//                     //     console.error(Rollback fehlgeschlagen für Datei ${file.name}, rollbackError);
//                     // }
//                     results.push({
//                         id,
//                         status: "error",
//                         error: deleteError as Error,
//                     });
//                 }
//             } catch (createDeleteUrlError) {
//                 results.push({
//                     id,
//                     status: "error",
//                     error: createDeleteUrlError as Error,
//                 });
//             }
//
//
//         await queryClient.invalidateQueries({
//             queryKey: [
//                 `${ApiRoutes.folders.base}${ApiRoutes.folders.byId(parentFolderId ?? "root")}`,
//             ],
//         });
//
//         setIsDeleting(false);
//         return results;
//     };
//
//     return { uploadFiles, isUploading: isDeleting };
// }