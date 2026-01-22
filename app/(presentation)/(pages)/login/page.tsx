import LoginIntroduce from '@/(presentation)/(pages)/login/components/login-introduce.component';
import SocialLogin from '@/(presentation)/(pages)/login/components/social-login.component';
import EmailLogin from '@/(presentation)/(pages)/login/components/email-login.component';
import LoginPageLayout from '@/(presentation)/(pages)/login/components/login-page-layout.component';
import Register from '@/(presentation)/(pages)/login/components/register.component';
import EmailLoginDivider from '@/(presentation)/(pages)/login/components/email-login-divider.component';
import LoginHeader from '@/(presentation)/(pages)/login/components/login-header.component';
import { redirect } from 'next/navigation';
import { isAuthenticationComplete } from '@/(presentation)/shared/helpers/authentication.helper';

export default async function Login() {
    const isLoggedIn = await isAuthenticationComplete();

    if (isLoggedIn) {
        redirect('/');
    }

    return (
        <LoginPageLayout
            introduce={<LoginIntroduce />}
            form={
                <>
                    <LoginHeader />
                    <SocialLogin />
                    <EmailLoginDivider />
                    <EmailLogin />
                    <Register />
                </>
            }
        />
    );
}
