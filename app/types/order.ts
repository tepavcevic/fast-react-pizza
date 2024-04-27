export type CartItem = {
  pizzaId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export type OrderView = {
  customer: string;
  phone: string;
  position: string;
  address: string;
  status: string;
  priority: false;
  cart: CartItem[];
  id: string;
  createdAt: string;
  estimatedDelivery: string;
  orderPrice: number;
  priorityPrice: number;
};

export type Order = {
  customer: string;
  phone: string;
  position: string;
  address: string;
  priority: boolean;
  cart: CartItem[];
};
