import {useGetFileDownloadUrl, useGetFileDownloadUrlsForFolder} from "@/src/api/hooks/api_hooks/fileHooks";
import {useGetFileFromUrl} from "@/src/api/hooks/s3_hooks/fileHooks";
import JSZip from "jszip";
import {saveAs} from "file-saver";
import {toast} from "sonner";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import {ErrorType, FileMeta} from "@workspace/types";
import findFolderPathById from "@/src/utils/findFolderPathById";
import {useGetAllFolders} from "@/src/api/hooks/api_hooks/folderHooks";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {useState} from "react";
import {ApiRoutes} from "@workspace/routes";
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {useQueryClient} from "@tanstack/react-query";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";


export const useDownloadFile = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const queryClient = useQueryClient();

    const {setSelected} = useContextMenu();

    const {path} = useFolderPath();
    const parentFolderId = path[path.length - 1]?.id;

    const {data: folderData} = useGetAllFolders();

    const getFileDownloadUrlsForFolder = useGetFileDownloadUrlsForFolder();
    const getFileDownloadUrl = useGetFileDownloadUrl();
    const getFileFromUrl = useGetFileFromUrl();

    const downloadFile = async (id: string) => {
        setIsDownloading(true);

        try {
            const data = await getFileDownloadUrl.mutateAsync({id});

            const blob = await getFileFromUrl.mutateAsync({url: data.url});

            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;

            const filename = data.file?.name ?? `file_${id}`;

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);

            await queryClient.invalidateQueries({
                queryKey: [
                    `${ApiRoutes.folders.base}${ApiRoutes.folders.byId(parentFolderId ?? ROOT_FOLDER_ID)}`,
                ],
            });

            setSelected([]);

        } catch (error) {
            toast.error(getErrorMessage(ErrorType.DOWNLOAD_ERROR));
        } finally {
            setIsDownloading(false);
        }
    };

    const getRelativeFilePath = (file: FileMeta): string => {
        const fullFolderPath = findFolderPathById(folderData?.folders, file.parentFolderId) ?? [];
        const relativePathSegments = fullFolderPath.slice(path.length);
        const relativeFolderPath = relativePathSegments.map(s => s.name).join("/");

        return relativeFolderPath
            ? `${relativeFolderPath}/${file.name ?? `file_${file.id}`}`
            : file.name ?? `file_${file.id}`;
    };

    const downloadFiles = async (ids: { fileIds: string[], folderIds: string[] }) => {
        setIsDownloading(true);
        const zip = new JSZip();

        try {
            const childrenUrls = (
                await Promise.all(
                    ids.folderIds.map(async (id) => {
                        const data = await getFileDownloadUrlsForFolder.mutateAsync({folderId: id});

                        return data.map((d) => {
                            return {
                                path: getRelativeFilePath(d.file),
                                url: d.url
                            };
                        });
                    })
                )
            ).flat();

            const urls = await Promise.all(
                ids.fileIds.map(async (id) => {
                    const data = await getFileDownloadUrl.mutateAsync({id});

                    return {
                        path: getRelativeFilePath(data.file),
                        url: data.url
                    };
                })
            );

            await Promise.all(
                [...urls, ...childrenUrls].map(async ({path, url}) => {
                    const file = await getFileFromUrl.mutateAsync({url});
                    zip.file(path, file);
                })
            );

            const zipBlob = await zip.generateAsync({type: "blob"});
            saveAs(zipBlob, "download.zip");

            await queryClient.invalidateQueries({
                queryKey: [
                    `${ApiRoutes.folders.base}${ApiRoutes.folders.byId(parentFolderId ?? ROOT_FOLDER_ID)}`,
                ],
            });

            setSelected([]);

        } catch (error) {
            toast.error(getErrorMessage(ErrorType.DOWNLOAD_ERROR));
        } finally {
            setIsDownloading(false);
        }
    };

    return {
        isDownloading,
        getFileDownloadUrl,
        getFileFromUrl,
        downloadFile,
        downloadFiles,
    };
};
