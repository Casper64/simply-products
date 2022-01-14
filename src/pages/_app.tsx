import { UserProvider } from '@auth0/nextjs-auth0';
import "styles/main.scss"
import "styles/markdown.scss"
import { MyAppProps } from 'types';
import { ReactNode } from 'react';
import MainLayout from '@/Layouts'

function MyApp({ Component, pageProps }: MyAppProps) {
    const Layout = Component.getLayout || ((page: ReactNode) => page);

    return (
        <UserProvider>
            <MainLayout>
                { Layout(<Component {...pageProps} />) }
            </MainLayout>
        </UserProvider>
    )
}

export default MyApp
