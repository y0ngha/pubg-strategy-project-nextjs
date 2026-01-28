'use client';

import Button from '@/(presentation)/shared/components/button.component';
import { Plus } from 'lucide-react';

function StrategiyCreateButton({ ...props }) {
    return (
        <Button className={'shadow-primary/20 gap-2 shadow-lg'} {...props}>
            <Plus className={'h-4 w-4'} /> 새 작전 수립
        </Button>
    );
}

StrategiyCreateButton.displayName = 'StrategiyCreateButton';

export default StrategiyCreateButton;
