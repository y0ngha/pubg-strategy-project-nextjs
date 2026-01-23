import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/(presentation)/shared/utils/class-names.util';

const ContainerVariants = cva(
    'border-border bg-surface/50 text-foreground rounded-xl border shadow-sm backdrop-blur-sm'
);

interface ContainerProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof ContainerVariants> {}

function Container({ children, className, ...props }: ContainerProps) {
    return (
        <div className={cn(ContainerVariants(), className)} {...props}>
            {children}
        </div>
    );
}

Container.displayName = 'Container';

export default Container;
