'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@workspace/ui/components/breadcrumb";
import {useFolderPath} from "@/src/providers/FolderPathProvider";
import {Fragment} from "react";

export function FolderPath({withLinks}: { withLinks?: boolean }) {

    const {path, setPath, resetPath} = useFolderPath();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    {withLinks ? (
                        <BreadcrumbLink
                            asChild
                            onClick={() => resetPath()}
                            className={'cursor-pointer'}
                        >
                            <span>Home</span>
                        </BreadcrumbLink>
                    ) : (
                        <span>Home</span>
                    )}
                </BreadcrumbItem>
                {path.length > 0 && <BreadcrumbSeparator/>}
                {path.map((pathSegment, index) => (
                    <Fragment key={pathSegment.id}>
                        <BreadcrumbItem>
                            {index < path.length - 1 && withLinks ? (
                                <BreadcrumbLink
                                    asChild
                                    onClick={() => setPath(path.slice(0, index + 1))}
                                    className={'cursor-pointer'}
                                >
                                    <span>{pathSegment.name}</span>
                                </BreadcrumbLink>
                            ) : (
                                <span>{pathSegment.name}</span>
                            )}
                        </BreadcrumbItem>
                        {index < path.length - 1 && <BreadcrumbSeparator/>}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}