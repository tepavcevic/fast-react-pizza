import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { Provider } from 'react-redux';
import '~/styles/tailwind.css';
import Loader from '~/components/loader';
import AppLayout from '~/components/app-layout';
import store from './store/store';

// export const links: LinksFunction = () => [
//   { rel: 'stylesheet', href: stylesheet },
// ];

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Fast React Pizza Co.',
    },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍕</text></svg>"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body className="bg-stone-100 text-stone-700">
        {navigation.state === 'loading' ? <Loader /> : children}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  );
}

export function HydrateFallback() {
  return <Loader />;
}
