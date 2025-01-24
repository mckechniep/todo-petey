import api from './api';

const categoryService = {
  // Create a new category
  createCategory: async (title) => {
    const token = localStorage.getItem("token");
    const response = await api.post('/category', { title },
        { 
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get all categories for the logged-in user
  getCategories: async () => {
    const token = localStorage.getItem("token");
    const response = await api.get('/category', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Edit an existing category
  editCategory: async (id, title) => {
    const token = localStorage.getItem("token");
    const response = await api.put(`/category/${id}`, { title },
        { 
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Delete a category
  deleteCategory: async (id) => {
    const response = await api.delete(`/category/${id}`);
    return response.data;
  }
};

export default categoryService;
