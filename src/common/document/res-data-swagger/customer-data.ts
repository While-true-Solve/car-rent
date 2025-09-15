export const customerData = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  full_name: 'John Doe',
  phone_number: '+998901234567',
  email: 'johndoe@example.com',
  password: 'hashed_password_example',
  adress: 'Tashkent, Uzbekistan',
  is_active: true,
  role: 'USER',
  orders: [
    {
      id: 'order-uuid-123',
      start_time: '2025-09-10T10:00:00.000Z',
      finish_time: '2025-09-12T10:00:00.000Z',
      price: 200000,
      car: {
        id: 'car-uuid-123',
        model: 'Chevrolet Malibu',
        year: 2022,
      },
    },
  ],
  wallets: [
    {
      id: 'wallet-uuid-123',
      card: '8600123412341234',
      balance: 1000000,
    },
  ],
  comments: [
    {
      id: 'comment-uuid-123',
      impression: 'Very comfortable car, thanks!',
      car: {
        id: 'car-uuid-123',
        model: 'Chevrolet Malibu',
      },
    },
  ],
  adoptedCars: [
    {
      id: 'adoptedcar-uuid-123',
      car: {
        id: 'car-uuid-456',
        model: 'Gentra',
      },
      adopted_at: '2025-08-01T12:00:00.000Z',
    },
  ],
  otp: '123456',
  otp_expires: '2025-09-14T12:00:00.000Z',
  is_verified: true,
  created_at: '2025-09-01T12:00:00.000Z',
  updated_at: '2025-09-10T12:00:00.000Z',
};
