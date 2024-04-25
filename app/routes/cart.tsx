import { useDispatch, useSelector } from 'react-redux';
import LinkButton from '~/components/link-button';
import Button from '~/components/button';
import CartItem from '~/features/cart/cart-item';
import { clearCart, getCart } from '~/features/cart/cartSlice';
import EmptyCart from '~/features/cart/empty-cart';
import { CartItem as CartItemType } from '~/types/order';
import { type MetaFunction } from '@remix-run/node';
export * as ErrorBoundary from '~/components/error-boundary';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Cart | Fast React Pizza Co.',
    },
  ];
};

function Cart() {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.username);
  const cart = useSelector(getCart);

  const handleClearCart = () => dispatch(clearCart());

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {username}</h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b">
        {cart.map((item: CartItemType) => (
          <CartItem item={item} key={item.pizzaId} />
        ))}
      </ul>

      <div className="mt-10 space-x-2">
        <Button type="primary" to="/order/new">
          Order pizzas
        </Button>

        <Button type="secondary" onClick={handleClearCart}>
          Clear cart
        </Button>
      </div>
    </div>
  );
}

export default Cart;
