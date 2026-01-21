type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={`w-full animate-pulse rounded-md bg-zinc-800/50 ${className}`}
            {...props}
        />
    );
}

Skeleton.displayName = 'Skeleton';

export default Skeleton;
