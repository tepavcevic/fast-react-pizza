import { Link } from '@remix-run/react';

import SearchOrder from '~/features/order/search-order';
import Username from '~/features/user/username';

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-yellow-400 px-4 py-3 uppercase sm:px-6">
      <Link className="tracking-widest" to="/">
        Fast React Pizza Company
      </Link>
      <SearchOrder />
      <Username />
    </header>
  );
}
