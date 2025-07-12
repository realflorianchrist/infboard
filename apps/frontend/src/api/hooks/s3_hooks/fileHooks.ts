import {useMutation} from "@tanstack/react-query";
import {HttpMethod} from "@/src/api/client/client";

type UploadToUrlArgs = {
    file: File;
    uploadUrl: string;
};

export const usePutFileToUrl = () => {
    return useMutation<void, Error, UploadToUrlArgs>({
        mutationFn: async ({file, uploadUrl}) => {
            const res = await fetch(uploadUrl, {
                method: HttpMethod.PUT,
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

// export const useDeleteFileFromUrl = () => {
//     return useMutation<void, Error, { url: string }>({
//         mutationFn: async ({url}) => {
//             const res = await fetch(url, {
//                 method: HttpMethod.DELETE,
//             });
//
//             if (!res.ok) {
//                 throw new Error("Delete failed");
//             }
//         }
//     });
// };