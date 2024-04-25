import { useEffect } from 'react';
import { useFetcher, useLoaderData } from '@remix-run/react';

import { calcMinutesLeft, formatCurrency, formatDate } from '~/utils/helpers';
import { getOrder } from '~/services/apiRestaurant';
import OrderItem from '~/features/order/order-item';
import UpdateOrder from '~/features/order/update-order';
import { CartItem as OrderType } from '~/types/order';
import { type ClientLoaderFunctionArgs } from '@remix-run/node';
export * as ErrorBoundary from '~/components/error-boundary';

function Order() {
  const order = useLoaderData();

  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === 'idle') fetcher.load('/menu');
  }, [fetcher]);

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 p-1 text-sm font-semibold uppercase tracking-wide text-red-50">
              Priority
            </span>
          )}
          <span className="rounded-full bg-green-500 p-1 text-sm font-semibold uppercase tracking-wide text-green-50">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : 'Order should have arrived'}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-y divide-stone-200 border-b border-t">
        {cart.map((item: OrderType) => (
          <OrderItem
            item={item}
            isLoadingIngredients={fetcher.state === 'loading'}
            ingredients={
              fetcher.data?.find(
                (element: { id: number }) => element.id === item.pizzaId
              )?.ingredients
            }
            key={item.pizzaId}
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>

      {!priority && <UpdateOrder order={order} />}
    </div>
  );
}

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  if (!params?.orderId) return {};

  return await getOrder(params.orderId);
}

export default Order;
