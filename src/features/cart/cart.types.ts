
import * as z from "zod";
export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(6, "Phone is required"),
  city: z.string().min(2, "City is required"),
  street: z.string().min(3, "Street is required"),
  details: z.string().optional(),
  note: z.string().optional(),
});


export type CheckoutValues = {
  fullName: string;
  phone: string;
  city: string;
  street: string;
  details?: string;
  note?: string;
};

export type CustomerData=Omit<CheckoutValues, "details" | "note">

export type OrderItem = {
  productId: string;
  name: string;
  image?: string;
  unitPrice: number;
  qty: number;
};

export type OrderAddress = {
  fullName: string;
  phone: string;
  city: string;
  street: string;
  details?: string;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;            
  userId: string;       

  items: OrderItem[];    

  subtotal: number;
  deliveryFee: number;
  total: number;

  address: OrderAddress;
  note?: string;

  status: OrderStatus;

  createdAt: any;        
  updatedAt: any;
};


