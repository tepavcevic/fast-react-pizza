import { useSelector } from 'react-redux';

import { formatCurrency } from '~/utils/helpers';
import DeleteItem from './delete-item';
import UpdateItemQuantity from './update-item-quantity';
import { getCurrentQuantityById } from './cartSlice';
import { CartItem as CartItemType } from '~/types/order';

function CartItem({ item }: { item: CartItemType }) {
  const { pizzaId, name, quantity, totalPrice } = item;
  const currentQuantity = useSelector(getCurrentQuantityById(pizzaId));

  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <UpdateItemQuantity id={pizzaId} currentQuantity={currentQuantity} />
        <DeleteItem id={pizzaId} />
      </div>
    </li>
  );
}

export default CartItem;
