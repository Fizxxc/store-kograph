export type Product = {
  id: string;
  category: string;
  name: string;
  slug: string;
  duration_label: string | null;
  description: string | null;
  product_type: string;
  base_price: number;
  display_price: number;
  badge: string | null;
  is_active: boolean;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "user";
};

export type Order = {
  id: string;
  order_code: string;
  product_name: string;
  category: string;
  display_amount: number;
  payment_status: string;
  order_status: string;
  payment_method: string;
  created_at: string;
  whatsapp_url: string | null;
  qr_string: string | null;
  cashify_total_amount: number | null;
  cashify_transaction_id: string | null;
  expires_at: string | null;
};

export type Broadcast = {
  id: string;
  title: string;
  message: string;
  created_at: string;
};
