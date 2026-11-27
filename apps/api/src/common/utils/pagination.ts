export interface PageWindow {
  limit: number;
  offset: number;
}

export interface PageSlice<T> {
  items: T[];
  hasNextPage: boolean;
}

export const pagination = {
  window(page: number, pageSize: number): PageWindow {
    const offset = (page - 1) * pageSize;
    return { limit: pageSize + 1, offset };
  },

  slice<T>(rows: T[], pageSize: number): PageSlice<T> {
    const hasNextPage = rows.length > pageSize;
    const items = rows.slice(0, pageSize);
    return { items, hasNextPage };
  },
};
