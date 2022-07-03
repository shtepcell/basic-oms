import { SWRConfig } from 'swr';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import createEmotionCache from '../lib/createEmotionCache';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import theme from '../theme';

import './globals.css';
import { useCallback, useState } from 'react';
import { Snackbar } from '@mui/material';
import { SnackbarProvider } from '../context/Snackbar';

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('Что-то пошло не так');
    const [snackbarVariant, setSnackbarVariant] = useState('success');

    const openSnackbar = useCallback((text, variant = 'success') => {
        setShowSnackbar(true);
        setSnackbarText(text);
        setSnackbarVariant(variant);
    }, [])

    const onCloseSnackbar = useCallback(() => {
        setShowSnackbar(false);
    }, [])

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <SWRConfig value={pageProps.fallback}>

                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <SnackbarProvider value={{ openSnackbar }}>
                        <Component {...pageProps} />
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={showSnackbar}
                            autoHideDuration={3000}
                            onClose={onCloseSnackbar}
                            message={snackbarText}
                        />
                    </SnackbarProvider>
                </SWRConfig>

            </ThemeProvider>
        </CacheProvider>
    );
}
