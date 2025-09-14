import { OrderStatus } from 'src/common/enum/order-status-enum';

export const orderData = {
  id: 'c4d7b2a3-91f1-4b8c-bd52-2f7f3d4a6b9e', // Order UUID
  car_id: 'a3f8e2c1-9b87-4b35-9f2c-1a2b3c4d5e6f', // Car UUID
  customer_id: 'b1e2f3a4-5c6d-7e8f-9a0b-1c2d3e4f5a6b', // Customer UUID
  start_time: '2025-09-11T09:00:00Z', // Start datetime
  finish_time: '2025-09-15T18:00:00Z', // Finish datetime
  total_amount: 350.75, // Order summasi
  created_at: '2025-09-08T06:20:29.122Z',
  updated_at: '2025-09-08T06:20:29.122Z',
  status: OrderStatus.ACTIVE, // Enumdan qiymat
  payment: null, // Hali payment bog‘lanmagan
  penalty: null, // Hali penalty yo‘q
};
