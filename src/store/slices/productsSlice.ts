import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";
import type { FetchProductsParams, ApiError } from "@/lib/types/api";
import {
  createProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from "@/lib/api";

export const fetchProductsList = createAsyncThunk(
  "products/fetchList",
  async (args: FetchProductsParams = {}, { rejectWithValue }) => {
    try {
      const data = await fetchProducts(args);
      return data;
    } catch (err) {
      const error = err as { response?: { data?: unknown }; message?: string };
      return rejectWithValue(
        (error.response?.data || error.message) as ApiError
      );
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await fetchProductById(id);
      return data;
    } catch (err) {
      const error = err as { response?: { data?: unknown }; message?: string };
      return rejectWithValue(
        (error.response?.data || error.message) as ApiError
      );
    }
  }
);

export const createNewProduct = createAsyncThunk(
  "products/create",
  async (payload: Partial<Product>, { rejectWithValue }) => {
    try {
      const data = await createProduct(payload);
      return data;
    } catch (err) {
      const error = err as { response?: { data?: unknown }; message?: string };
      return rejectWithValue(
        (error.response?.data || error.message) as ApiError
      );
    }
  }
);

export const updateExistingProduct = createAsyncThunk(
  "products/update",
  async (
    { id, payload }: { id: number; payload: Partial<Product> },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateProduct(id, payload);
      return data;
    } catch (err) {
      const error = err as { response?: { data?: unknown }; message?: string };
      return rejectWithValue(
        (error.response?.data || error.message) as ApiError
      );
    }
  }
);

export const deleteExistingProduct = createAsyncThunk(
  "products/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await deleteProduct(id);
      return { id, data };
    } catch (err) {
      const error = err as { response?: { data?: unknown }; message?: string };
      return rejectWithValue(
        (error.response?.data || error.message) as ApiError
      );
    }
  }
);

interface ProductsState {
  byId: Record<number, Product>;
  ids: number[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: ApiError;
}

const initialState: ProductsState = {
  byId: {},
  ids: [],
  total: 0,
  status: "idle",
  error: undefined,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts(state) {
      state.byId = {};
      state.ids = [];
      state.total = 0;
      state.status = "idle";
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsList.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchProductsList.fulfilled, (state, action) => {
        const { products = [], total = 0 } = action.payload;
        state.status = "succeeded";
        state.total = total || products.length;
        const args = action.meta?.arg || {};
        const isFirstPage = Number(args.skip ?? 0) === 0;
        if (isFirstPage) {
          state.byId = {};
          state.ids = [];
        }
        products.forEach((p: Product) => {
          if (p && p.id) {
            state.byId[p.id] = p;
            if (!state.ids.includes(p.id)) state.ids.push(p.id);
          }
        });
      })
      .addCase(fetchProductsList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchProduct.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(
        fetchProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const p = action.payload;
          state.byId[p.id] = p;
          if (!state.ids.includes(p.id)) state.ids.push(p.id);
          state.status = "succeeded";
        }
      )
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      .addCase(
        createNewProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const p = action.payload;
          state.byId[p.id] = p;
          if (!state.ids.includes(p.id)) state.ids.unshift(p.id);
          state.total += 1;
        }
      )

      .addCase(
        updateExistingProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const p = action.payload;
          state.byId[p.id] = p;
        }
      )

      .addCase(deleteExistingProduct.fulfilled, (state, action) => {
        const { id } = action.payload;
        delete state.byId[id];
        state.ids = state.ids.filter((i) => i !== id);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { clearProducts } = productsSlice.actions;

export default productsSlice.reducer;
