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

export default function FolderPath() {

    const {path, setPath, resetPath} = useFolderPath();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <button
                            className={'cursor-pointer'}
                            onClick={() => resetPath()}
                        >
                            Home
                        </button>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {path.length > 0 && <BreadcrumbSeparator/>}
                {path.map((pathSegment, index) => (
                    <Fragment key={pathSegment.id}>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                {index < path.length - 1 ? (
                                    <button
                                        className="cursor-pointer"
                                        onClick={() => setPath(path.slice(0, index + 1))}
                                    >
                                        {pathSegment.name}
                                    </button>
                                ) : (
                                    <span className="text-muted-foreground">{pathSegment.name}</span>
                                )}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index < path.length - 1 && <BreadcrumbSeparator/>}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}