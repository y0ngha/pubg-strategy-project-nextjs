import React, { ReactElement, ReactNode } from 'react';
import { useSafetyContext } from '@/(presentation)/shared/hooks/useSafetyContext';

type SwitchCaseValue = string | boolean | number;

interface SwitchCaseProps {
    value: SwitchCaseValue;
    children: ReactElement<CaseProps> | ReactElement<CaseProps>[];
}

interface SwitchCaseContextValue {
    value: SwitchCaseValue;
}

const SwitchCaseContext = React.createContext<
    SwitchCaseContextValue | undefined
>(undefined);

function Switch({ value, children }: SwitchCaseProps) {
    return (
        <SwitchCaseContext.Provider value={{ value }}>
            {children}
        </SwitchCaseContext.Provider>
    );
}

interface CaseProps {
    value: SwitchCaseValue;
    children: ReactNode;
}

function Case({ value, children }: CaseProps) {
    const context = useSafetyContext(
        SwitchCaseContext,
        'Switch.Case 컴포넌트는 Switch 컴포넌트 안에 위치해야합니다.'
    );

    if (value !== context?.value) {
        return null;
    }

    return children;
}

Switch.Case = Case;

export default Switch;
