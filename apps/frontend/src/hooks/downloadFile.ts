import {useGetFileDownloadUrl} from "@/src/api/hooks/api_hooks/fileHooks";
import {useGetFileFromUrl} from "@/src/api/hooks/s3_hooks/fileHooks";
import JSZip from "jszip";
import {saveAs} from "file-saver";
import {toast} from "sonner";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import {ErrorType} from "@workspace/types/apiResponses";


export const useDownloadFile = () => {

    const getFileDownloadUrl = useGetFileDownloadUrl();
    const getFileFromUrl = useGetFileFromUrl();

    const downloadFile = async (id: string) => {

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

        } catch (error) {
            toast.error(getErrorMessage(ErrorType.DOWNLOAD_ERROR));
        }
    };

    const downloadFiles = async (ids: string[]) => {
        const zip = new JSZip();

        try {
            const urls = await Promise.all(
                ids.map(async (id) => {
                    const data = await getFileDownloadUrl.mutateAsync({id});
                    return {
                        fileName: data.file.name ?? `file_${id}`,
                        url: data.url
                    };
                })
            );

            await Promise.all(
                urls.map(async ({fileName, url}) => {
                    const file = await getFileFromUrl.mutateAsync({url});
                    zip.file(fileName, file);
                })
            );

            const zipBlob = await zip.generateAsync({type: "blob"});
            saveAs(zipBlob, "download.zip");

        } catch (error) {
            toast(getErrorMessage(ErrorType.DOWNLOAD_ERROR));
        }
    };

    return {
        getFileDownloadUrl,
        getFileFromUrl,
        downloadFile,
        downloadFiles,
    };
};
