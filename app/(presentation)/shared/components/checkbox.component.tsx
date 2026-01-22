import { Check } from 'lucide-react';
import { InputHTMLAttributes, useId } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

function Checkbox({ error, children, ...props }: CheckboxProps) {
    const id = useId();

    return (
        <div className={'flex flex-col gap-1.5'}>
            <div className={'flex items-start space-x-2'}>
                <div className={'relative flex items-center'}>
                    <input
                        type={'checkbox'}
                        id={id}
                        className={
                            'peer border-primary bg-background focus-visible:ring-ring checked:bg-primary checked:text-primary-foreground h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                        }
                        {...props}
                    />
                    <Check
                        className={
                            'text-primary-foreground pointer-events-none absolute top-0 left-0 hidden h-4 w-4 peer-checked:block'
                        }
                        strokeWidth={3}
                    />
                </div>

                {children && (
                    <label
                        htmlFor={id}
                        className={
                            'text-muted-foreground hover:text-foreground cursor-pointer text-sm leading-none font-medium transition-colors select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        }
                    >
                        {children}
                    </label>
                )}
            </div>

            {error && (
                <p
                    className={
                        'text-destructive animate-fadeIn text-[0.8rem] font-medium'
                    }
                >
                    {error}
                </p>
            )}
        </div>
    );
}

Checkbox.displayName = 'Checkbox';

export default Checkbox;
