import api from "../lib/axios";

export const getProducts = async ({
  page = 1,
  limit = 20,
  search = "",
  category = "",
  sort = "",
  signal,
}) => {
  const skip = (page - 1) * limit;

  const params = {
    limit,
    skip,
  };

  if (sort) {
    const [sortBy, order] = sort.split("-");

    params.sortBy = sortBy;
    params.order = order;
  }

  let endpoint = "/products";

  // Search takes priority over category.
  if (search) {
    endpoint = "/products/search";
    params.q = search;
  } else if (category) {
    endpoint = `/products/category/${encodeURIComponent(category)}`;
  }

  const response = await api.get(endpoint, {
    params,
    signal,
  });

  return response.data;
};

export const getCategories = async (signal) => {
  const response = await api.get("/products/categories", {
    signal,
  });

  return response.data;
};

export const getProductById = async (id, signal) => {
  const response = await api.get(`/products/${id}`, {
    signal,
  });

  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post("/products/add", product);

  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}`, product);

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};