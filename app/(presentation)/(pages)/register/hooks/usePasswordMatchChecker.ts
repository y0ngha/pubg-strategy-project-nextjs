import { ChangeEvent, useEffect, useState } from 'react';

export function usePasswordMatchChecker() {
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isMatch, setIsMatch] = useState<boolean>(true);

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const onConfirmPasswordChangeHandler = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(event.target.value);
    };

    useEffect(() => {
        setIsMatch(password === confirmPassword);
    }, [password, confirmPassword]);

    return {
        isMatch: isMatch,
        onPasswordChangeHandler,
        onConfirmPasswordChangeHandler,
    };
}
