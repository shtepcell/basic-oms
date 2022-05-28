import { SWRConfig } from 'swr';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import createEmotionCache from '../lib/createEmotionCache';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import theme from '../theme';

import './globals.css';

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <SWRConfig value={pageProps.fallback}>

                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <Component {...pageProps} />
                </SWRConfig>

            </ThemeProvider>
        </CacheProvider>
    );
}
