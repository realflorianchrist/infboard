import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@workspace/ui/components/breadcrumb";
import {Fragment} from "react";
import {useGetAllFolders} from "@/src/api/hooks/api_hooks/folderHooks";
import findFolderPathById from "@/src/utils/findFolderPathById";

type Props = {parentFolderId?: string | null};
export default function ModalBreadCrumbs({parentFolderId}: Props) {

    const {data} = useGetAllFolders();
    const path = findFolderPathById(data?.folders, parentFolderId);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>Home</BreadcrumbItem>
                {(path?.length ?? 0) > 0 && <BreadcrumbSeparator/>}
                {path?.map((pathSegment, index) => (
                    <Fragment key={pathSegment.id}>
                        <BreadcrumbItem>
                            <span>{pathSegment.name}</span>
                        </BreadcrumbItem>
                        {index < path?.length - 1 && <BreadcrumbSeparator/>}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
