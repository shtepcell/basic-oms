import { SWRConfig } from 'swr';

import './globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={pageProps.fallback}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default MyApp
