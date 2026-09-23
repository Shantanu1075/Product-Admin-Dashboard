const STORAGE_KEY = "product-admin-mutations";

const EMPTY_STORE = {
  added: [],
  updated: {},
  deleted: [],
};

const readStore = () => {
  if (typeof window === "undefined") {
    return EMPTY_STORE;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return EMPTY_STORE;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return EMPTY_STORE;
  }
};

const writeStore = (store) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const saveAddedProduct = (product) => {
  const store = readStore();

  store.added = [
    product,
    ...store.added.filter((item) => item.id !== product.id),
  ];

  writeStore(store);
};

export const saveUpdatedProduct = (product) => {
  const store = readStore();

  store.updated[String(product.id)] = product;

  writeStore(store);
};

export const saveDeletedProduct = (product) => {
  const store = readStore();

  store.deleted = [
    product,
    ...store.deleted.filter((item) => item.id !== product.id),
  ];

  store.added = store.added.filter((item) => item.id !== product.id);

  delete store.updated[String(product.id)];

  writeStore(store);
};

export const isProductDeleted = (id) => {
  const store = readStore();

  return store.deleted.some((product) => String(product.id) === String(id));
};

export const getAddedProduct = (id) => {
  const store = readStore();

  return (
    store.added.find((product) => String(product.id) === String(id)) || null
  );
};

export const applyProductUpdate = (product) => {
  const store = readStore();

  const updated = store.updated[String(product.id)];

  if (!updated) {
    return product;
  }

  return {
    ...product,
    ...updated,
  };
};

const matchesSearch = (product, search) => {
  if (!search) {
    return true;
  }

  const query = search.toLowerCase();

  return (
    product.title?.toLowerCase().includes(query) ||
    product.description?.toLowerCase().includes(query) ||
    product.category?.toLowerCase().includes(query)
  );
};

const matchesCategory = (product, category) => {
  if (!category) {
    return true;
  }

  return product.category === category;
};

export const applyLocalMutations = (
  products,
  total,
  { search = "", category = "", page = 1, limit = 20 } = {}
) => {
  const store = readStore();

  const deletedIds = new Set(
    store.deleted.map((product) => String(product.id))
  );

  let result = products
    .filter((product) => !deletedIds.has(String(product.id)))
    .map((product) => applyProductUpdate(product));

  const visibleAdded = store.added.filter(
    (product) =>
      matchesSearch(product, search) && matchesCategory(product, category)
  );

  if (page === 1) {
    result = [...visibleAdded, ...result];
    result = result.slice(0, limit);
  }

  const visibleDeletedCount = store.deleted.filter(
    (product) =>
      matchesSearch(product, search) && matchesCategory(product, category)
  ).length;

  const newTotal = Math.max(
    0,
    total + visibleAdded.length - visibleDeletedCount
  );

  return {
    products: result,
    total: newTotal,
  };
};

export const clearProductMutations = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
};