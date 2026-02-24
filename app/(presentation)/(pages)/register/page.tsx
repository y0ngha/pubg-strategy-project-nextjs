import { isAuthenticationComplete } from '@/(presentation)/shared/helpers/authentication.helper';
import { redirect } from 'next/navigation';
import RegisterIntroduce from '@/(presentation)/(pages)/register/_components/register-introduce.component';
import RegisterPageLayout from '@/(presentation)/(pages)/register/_components/register-page-layout.component';
import RegisterHeader from '@/(presentation)/(pages)/register/_components/register-header.component';
import SocialRegister from '@/(presentation)/auth/components/register/social-register.component';
import EmailRegisterDivider from '@/(presentation)/(pages)/register/_components/email-register-divider.component';
import EmailRegister from '@/(presentation)/auth/components/register/email-register.component';
import Login from '@/(presentation)/auth/components/register/login.component';

export default async function Register() {
    const isLoggedIn = await isAuthenticationComplete();

    if (isLoggedIn) {
        redirect('/');
    }

    return (
        <RegisterPageLayout
            introduce={<RegisterIntroduce />}
            form={
                <>
                    <RegisterHeader />
                    <SocialRegister />
                    <EmailRegisterDivider />
                    <EmailRegister />
                    <Login />
                </>
            }
        />
    );
}
