import { type ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';

import Button from '~/components/button';
import { updateOrder } from '~/services/apiRestaurant';
import { CartItem } from '~/types/order';

export default function UpdateOrder({ order }: { order: CartItem }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" className="text-end">
      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  );
}

export async function clientAction({ params }: ActionFunctionArgs) {
  if (!params?.orderId) return null;

  const orderId = parseInt(params.orderId, 10);
  const updateData = { priority: true };
  await updateOrder(orderId, updateData);
  return null;
}
