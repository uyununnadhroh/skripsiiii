import { apiService } from './api.service';

export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    return apiService.get('/orders');
  },

  // Get order by ID
  getOrderById: async (id) => {
    return apiService.get(`/orders/${id}`);
  },

  // Create new order
  createOrder: async (orderData) => {
    return apiService.post('/orders', orderData);
  },

  // Update order
  updateOrder: async (id, orderData) => {
    return apiService.put(`/orders/${id}`, orderData);
  },

  // Delete order
  deleteOrder: async (id) => {
    return apiService.delete(`/orders/${id}`);
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    return apiService.patch(`/orders/${id}/status`, { status });
  },
};
