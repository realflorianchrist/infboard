import {useGetFileDownloadUrl} from "@/src/api/hooks/api_hooks/fileHooks";
import {useGetFileFromUrl} from "@/src/api/hooks/s3_hooks/fileHooks";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const useDownloadFile = () => {

    const getFileDownloadUrl = useGetFileDownloadUrl();
    const getFileFromUrl = useGetFileFromUrl();

    const downloadFile = (id: string) => {
        getFileDownloadUrl.mutate({id: id}, {
            onSuccess: (data) => {
                window.open(data.url);
            }
        });
    }

    const downloadFiles = async (ids: string[]) => {
        const zip = new JSZip();

        try {
            const urls = await Promise.all(
                ids.map(async (id) => {
                    const data = await getFileDownloadUrl.mutateAsync({ id });
                    return {
                        fileName: data.file.name ?? `file_${id}`,
                        url: data.url
                    };
                })
            );

            await Promise.all(
                urls.map(async ({ fileName, url }) => {
                    const file = await getFileFromUrl.mutateAsync({ url });
                    zip.file(fileName, file);
                })
            );

            const zipBlob = await zip.generateAsync({ type: "blob" });
            saveAs(zipBlob, "download.zip");

        } catch (error) {
            console.error("Download failed:", error);
            // todo: add UI warning
        }
    };

    return {
        getFileDownloadUrl,
        getFileFromUrl,
        downloadFile,
        downloadFiles,
    };
};
