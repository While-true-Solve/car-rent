import { OrderStatus } from 'src/common/enum/order-status-enum';

export const penaltyData = {
  id: 'b3a1c7e2-91f4-4e2a-85f9-92c8d7a6e5b3', // Penalty UUID
  penalty_day_price: 100000, // Har kuni uchun jarima summasi
  penalty_amount: 300000, // Umumiy jarima (masalan: 3 kun * 100000)
  is_paid_penalty: false, // To‘langan yoki yo‘qligi
  created_at: '2025-09-12T15:30:00.000Z',
  updated_at: '2025-09-13T12:00:00.000Z',
  order: {
    id: 'c4d7b2a3-91f1-4b8c-bd52-2f7f3d4a6b9e', // Order UUID
    car_id: 'a3f8e2c1-9b87-4b35-9f2c-1a2b3c4d5e6f', // Car UUID
    customer_id: 'b1e2f3a4-5c6d-7e8f-9a0b-1c2d3e4f5a6b', // Customer UUID
    start_time: '2025-09-11T09:00:00Z',
    finish_time: '2025-09-15T18:00:00Z',
    total_amount: 350.75,
    created_at: '2025-09-08T06:20:29.122Z',
    updated_at: '2025-09-08T06:20:29.122Z',
    status: OrderStatus.ACTIVE, // Order holati
  },
};
