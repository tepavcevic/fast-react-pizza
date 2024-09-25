import { useLoaderData } from '@remix-run/react';
import { type MetaFunction } from '@remix-run/node';

import { getMenu } from '~/services/apiRestaurant';
import MenuItem from '~/features/menu/menu-item';
import { Product } from '~/types/products';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Menu | Fast React Pizza Co.',
    },
  ];
};

function Menu() {
  const menu = useLoaderData() as Awaited<ReturnType<typeof clientLoader>>;

  return (
    <ul className="divide-y divide-stone-200 px-2">
      {menu.map((pizza: Product) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

export async function clientLoader() {
  return await getMenu();
}

export default Menu;
