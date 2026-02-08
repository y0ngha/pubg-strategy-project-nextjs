import { User } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { cn } from '@/(presentation)/shared/utils/class-names.util';

function UserAvatar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                `flex h-full w-full shrink-0 items-center justify-center`,
                className
            )}
            {...props}
        >
            <User />
        </div>
    );
}

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
