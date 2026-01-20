import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/(presentation)/shared/utils/class-names.util';

const CardVariants = cva(
    'border-border bg-surface/50 text-foreground rounded-xl border shadow-sm backdrop-blur-sm'
);

interface CardProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof CardVariants> {}

function Card({ children, className }: CardProps) {
    return <div className={cn(CardVariants(), className)}>{children}</div>;
}

Card.displayName = 'Card';

export default Card;
