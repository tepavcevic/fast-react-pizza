import { useEffect } from 'react';
import {
  ClientActionFunctionArgs,
  redirect,
  useFetcher,
  useLoaderData,
  type ClientLoaderFunctionArgs,
} from '@remix-run/react';

import { calcMinutesLeft, formatCurrency, formatDate } from '~/utils/helpers';
import { getOrder, updateOrder } from '~/services/apiRestaurant';
import OrderItem from '~/features/order/order-item';
import { CartItem as CartItemType } from '~/types/order';
import { GeneralErrorBoundary } from '~/components/general-error-boundary';
import Button from '~/components/button';

export async function clientAction({ params }: ClientActionFunctionArgs) {
  if (!params?.orderId) return null;

  const updateData = { priority: true };
  await updateOrder(params.orderId, updateData);
  return null;
}

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  if (!params?.orderId) {
    redirect('/menu');
    return;
  }

  return await getOrder(params.orderId);
}

function Order() {
  const order = useLoaderData<typeof clientLoader>();
  const fetcher = useFetcher();

  const isMakingPriority = fetcher.state === 'submitting';

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
        {cart.map((item: CartItemType) => (
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

      {!priority && (
        <fetcher.Form method="PATCH" className="text-end">
          <Button type="primary" disabled={isMakingPriority}>
            {isMakingPriority ? 'Making Priority...' : 'Make Priority'}
          </Button>
        </fetcher.Form>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => <p>Order {params.orderId} not found</p>,
      }}
    />
  );
}

export default Order;
