import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  type ClientActionFunctionArgs,
} from '@remix-run/react';
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import { useAppDispatch, useAppSelector } from '~/hooks/redux';
import store from '~/store/store';
import { createOrder } from '~/services/apiRestaurant';
import Button from '~/components/button';
import { GeneralErrorBoundary } from '~/components/general-error-boundary';
import EmptyCart from '~/features/cart/empty-cart';
import {
  clearCart,
  getCart,
  getTotalCartPrice,
} from '~/features/cart/cartSlice';
import { fetchAddress } from '~/features/user/userSlice';
import { formatCurrency } from '~/utils/helpers';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const CartSchema = z.array(
  z.object({
    pizzaId: z.number(),
    name: z.string(),
    unitPrice: z.number(),
    quantity: z.number().min(1),
    totalPrice: z.number(),
  })
);

const OrderSchema = z.object({
  customer: z
    .string({ required_error: 'Please give us your name.' })
    .min(3, { message: 'Minimum length of 3' })
    .max(50, { message: 'Maximum length of 50' }),
  phone: z
    .string({
      required_error: 'Please give us your phone number.',
    })
    .refine(isValidPhone, {
      message:
        'Please give us your correct phone number. We might need it to contact you.',
    }),
  address: z
    .string({ required_error: 'Please give us your address.' })
    .min(3, { message: 'Minimum length of 3' })
    .max(50, { message: 'Maximum length of 70' }),
  position: z.string().optional(),
  cart: z.string(),
  priority: z.boolean().optional(),
});

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: OrderSchema,
    async: true,
  });
  console.log(submission);

  if (submission.status !== 'success') return submission.reply();
  if (!submission.value) return null;

  const parsedCart = await CartSchema.safeParseAsync(submission.value.cart);

  if (!parsedCart.success) return parsedCart.error;

  const order = {
    ...submission.value,
    cart: parsedCart.data,
    position: submission.value.position ?? '',
    priority: submission.payload?.priority ? true : false,
  };

  console.log(order);

  // If everything is okay, create new order and redirect
  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

function CreateOrder() {
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useAppSelector((state) => state.user);
  const isLoadingAddress = addressStatus === 'loading';

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const lastSubmit = useActionData<typeof clientAction>();

  const [form, fields] = useForm({
    id: 'order-form',
    lastResult: lastSubmit?.submission,
    constraint: getZodConstraint(OrderSchema),
    shouldValidate: 'onBlur',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: OrderSchema });
    },
  });

  const cart = useAppSelector(getCart);
  const totalCartPrice = useAppSelector(getTotalCartPrice);
  const priorityPrice = form.value?.priority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST" {...getFormProps(form)}>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={fields.customer.id} className="sm:basis-40">
            First Name
          </label>
          <div className="flex flex-col grow">
            <input
              {...getInputProps(fields.customer, { type: 'text' })}
              defaultValue={username}
              className="input grow"
              required
            />
            {fields.customer.errors && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700 transition-opacity transform opacity-100 scale-y-100">
                {fields.customer.errors}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={fields.phone.id} className="sm:basis-40">
            Phone number
          </label>
          <div className="grow">
            <input
              {...getInputProps(fields.phone, { type: 'tel' })}
              className="input w-full"
              required
            />
            {fields.phone.errors && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700 transition-opacity transform opacity-100 scale-y-100">
                {fields.phone.errors}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={fields.address.id} className="sm:basis-40">
            Address
          </label>
          <div className="grow">
            <input
              {...getInputProps(fields.address, { type: 'text' })}
              className="input w-full"
              defaultValue={address}
              disabled={isLoadingAddress}
              required
            />
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700 transition-opacity transform opacity-100 scale-y-100">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[35px] z-50 sm:top-[3px] md:top-[5px]">
              <Button
                type="small"
                onClick={() => {
                  dispatch(fetchAddress());
                }}
                disabled={isLoadingAddress}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            {...getInputProps(fields.priority, { type: 'checkbox' })}
          />
          <label htmlFor={fields.priority.id} className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input
            {...getInputProps(fields.cart, {
              type: 'hidden',
            })}
            value={JSON.stringify(cart)}
          />
          <input
            {...getInputProps(fields.position, {
              type: 'hidden',
            })}
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ''
            }
          />

          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting
              ? 'Placing order....'
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}
export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}

export default CreateOrder;
