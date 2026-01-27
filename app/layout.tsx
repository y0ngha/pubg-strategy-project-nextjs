import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ReactQueryProviders from '@/react-query-provider';
import { ReactNode } from 'react';
import UserDehydrate from '@/dehydrate-components/user-dehydrate.component';
import Footer from '@/footer';
import Navigation from '@/navigation';
import AuthFeedbackListner from '@/auth-feedback-listner.component';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'PUBG.OP | 배틀그라운드 전략 관리 및 전적 검색',
    description: '배틀그라운드 전적 검색, 전략 생성 및 공유를 제공합니다.',
    icons: {
        icon: '/images/favicon.ico',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
            >
                <Navigation />
                <ReactQueryProviders>
                    <UserDehydrate>
                        <main className={'w-full flex-1'}>{children}</main>
                    </UserDehydrate>
                </ReactQueryProviders>

                <AuthFeedbackListner />
                <ToastContainer position={'bottom-center'} theme={'dark'} />
                <Footer />
            </body>
        </html>
    );
}
