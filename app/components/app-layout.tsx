import { Outlet } from '@remix-run/react';

import CartOverview from '~/features/cart/cart-overview';
import Header from './header';

export default function Index() {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="overflow-auto">
        <main className="mx-auto max-w-3xl">
          <Outlet />
        </main>
      </div>

      <CartOverview />
    </div>
  );
}
