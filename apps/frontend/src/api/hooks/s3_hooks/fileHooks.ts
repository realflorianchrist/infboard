import {useMutation} from "@tanstack/react-query";

type UploadToUrlArgs = {
    file: File;
    uploadUrl: string;
};

export const usePutFileToUrl = () => {
    return useMutation<void, Error, UploadToUrlArgs>({
        mutationFn: async ({ file, uploadUrl }) => {
            const res = await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }
        }
    });
};