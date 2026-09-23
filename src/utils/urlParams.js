import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
} from "../constants";

export const parsePage = (value) => {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
};

export const parseLimit = (value) => {
  const limit = Number(value);

  if (!PAGE_SIZE_OPTIONS.includes(limit)) {
    return DEFAULT_PAGE_SIZE;
  }

  return limit;
};

export const parseSort = (value) => {
  const validSort = SORT_OPTIONS.some((option) => option.value === value);

  if (!validSort) {
    return "";
  }

  return value;
};

export const updateQueryParams = (router, pathname, currentParams, updates) => {
  const params = new URLSearchParams(currentParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === false
    ) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  router.replace(`${pathname}?${params.toString()}`);
};