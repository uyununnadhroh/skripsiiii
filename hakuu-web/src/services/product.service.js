import { apiService } from './api.service';

export const productService = {
  // Get all products
  getAllProducts: async () => {
    return apiService.get('/products');
  },

  // Get product by ID
  getProductById: async (id) => {
    return apiService.get(`/products/${id}`);
  },

  // Create new product
  createProduct: async (productData) => {
    return apiService.post('/products', productData);
  },

  // Update product
  updateProduct: async (id, productData) => {
    return apiService.put(`/products/${id}`, productData);
  },

  // Delete product
  deleteProduct: async (id) => {
    return apiService.delete(`/products/${id}`);
  },
};
