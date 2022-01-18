import Document, { Html, Head, Main, NextScript } from 'next/document'
import manifest from 'assets/manifest.json'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <link key="g1" rel="preconnect" href="https://fonts.googleapis.com"/>
                <link key="g2" rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=''/>
                <link key="g3" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ" crossOrigin="anonymous"/>
		
		<meta name='mobile-web-app-capable' content='yes' />
		<meta name='apple-mobile-web-app-capable' content='yes' />
		<meta name='apple-mobile-web-app-status-bar-style' content='default' />
		<meta name='apple-mobile-web-app-title' content='Simply Notes' />
		<meta name='application-name' content='Simply Notes' />
		{ /* <link rel='manifest' href={manifest.src} /> */ }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
