import SocialLogin from '@/(presentation)/auth/components/login/social-login.component';
import EmailLogin from '@/(presentation)/auth/components/login/email-login.component';
import Register from '@/(presentation)/auth/components/login/register.component';
import { redirect } from 'next/navigation';
import { isAuthenticationComplete } from '@/(presentation)/shared/helpers/authentication.helper';
import PageLayout from '@/(presentation)/(pages)/login/_components/page-layout.component';
import Introduce from '@/(presentation)/(pages)/login/_components/introduce.component';
import Divider from '@/(presentation)/(pages)/login/_components/divider.component';
import Header from '@/(presentation)/(pages)/login/_components/header.component';

export default async function Login() {
    const isLoggedIn = await isAuthenticationComplete();

    if (isLoggedIn) {
        redirect('/');
    }

    return (
        <PageLayout
            introduce={<Introduce />}
            form={
                <>
                    <Header />
                    <SocialLogin />
                    <Divider />
                    <EmailLogin />
                    <Register />
                </>
            }
        />
    );
}
