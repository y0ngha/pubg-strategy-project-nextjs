import LoginIntroduce from '@/(presentation)/login/components/login-introduce.component';
import SocialLogin from '@/(presentation)/login/components/social-login.component';
import EmailLogin from '@/(presentation)/login/components/email-login.component';
import LoginPageLayout from '@/(presentation)/login/components/login-page-layout.component';
import Register from '@/(presentation)/login/components/register.component';
import EmailLoginDivider from '@/(presentation)/login/components/email-login-divider.component';
import LoginHeader from '@/(presentation)/login/components/login-header.component';

export default function Login() {
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
