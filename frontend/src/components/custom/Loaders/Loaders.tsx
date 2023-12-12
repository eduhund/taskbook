import { Loader, LoaderProps } from "@consta/uikit/Loader";
import {
	SkeletonBrick,
	SkeletonCircle,
	SkeletonText,
} from "@consta/uikit/Skeleton";

function EduSpinLoader({ size }: LoaderProps) {
	return <Loader size={size} />;
}

function EduSkeletonBrick({ width, height }: any) {
	return <SkeletonBrick width={width} height={height} />;
}

export { EduSpinLoader as SpinLoader, EduSkeletonBrick as SkeletonBrick };
