import {useGetFileDownloadUrl} from "@/src/api/hooks/api_hooks/fileHooks";

export const useDownloadFile = () => {

    const getFileDownloadUrl = useGetFileDownloadUrl();

    const downloadFile = (id: string) => {
        getFileDownloadUrl.mutate({id: id}, {
            onSuccess: (data) => {
                window.open(data.url);
            }
        });
    }

    return {
        ...getFileDownloadUrl,
        downloadFile,
    };
};
