import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Product,
  ProductStatus,
  FetchProductsParams,
  ApiError,
} from "@/types";
import { ProductStatus as ProductStatusEnum } from "@/types";
import {
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from "@/lib/api";

const LOCAL_PRODUCT_ID_START = -1_000_000;

function generateLocalProductId(): number {
  return LOCAL_PRODUCT_ID_START - Date.now();
}

function isLocalProduct(id: number): boolean {
  return id < 0;
}

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
    const localId = generateLocalProductId();
    const localProduct: Product = {
      id: localId,
      title: payload.title || "",
      description: payload.description,
      price: payload.price || 0,
      rating: payload.rating,
      category: payload.category,
      thumbnail: payload.thumbnail,
      images: payload.images,
      brand: payload.brand,
      stock: payload.stock,
    };

    return localProduct;
  }
);

export const updateExistingProduct = createAsyncThunk(
  "products/update",
  async (
    { id, payload }: { id: number; payload: Partial<Product> },
    { rejectWithValue, getState }
  ) => {
    const state = getState() as { products: ProductsState };
    const isLocal = isLocalProduct(id);

    if (isLocal) {
      const existingProduct = state.products.byId[id];
      if (!existingProduct) {
        return rejectWithValue({ message: "Product not found" } as ApiError);
      }
      const updatedProduct: Product = {
        ...existingProduct,
        ...payload,
        id,
      };
      return updatedProduct;
    }

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
  async (id: number, { rejectWithValue, getState }) => {
    const state = getState() as { products: ProductsState };
    const isLocal = isLocalProduct(id);

    if (isLocal) {
      if (!state.products.byId[id]) {
        return rejectWithValue({ message: "Product not found" } as ApiError);
      }
      return { id, data: null };
    }

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
  localIds: number[];
  total: number;
  status: ProductStatus;
  error?: ApiError;
}

const initialState: ProductsState = {
  byId: {},
  ids: [],
  localIds: [],
  total: 0,
  status: ProductStatusEnum.IDLE,
  error: undefined,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts(state) {
      state.byId = {};
      state.ids = [];
      state.localIds = [];
      state.total = 0;
      state.status = ProductStatusEnum.IDLE;
      state.error = undefined;
    },
    addLocalProduct(state, action: PayloadAction<Product>) {
      const product = action.payload;
      state.byId[product.id] = product;
      if (!state.localIds.includes(product.id)) {
        state.localIds.push(product.id);
      }
      if (!state.ids.includes(product.id)) {
        state.ids.unshift(product.id);
      }
      state.total += 1;
    },
    updateLocalProduct(state, action: PayloadAction<Product>) {
      const product = action.payload;
      state.byId[product.id] = product;
    },
    removeLocalProduct(state, action: PayloadAction<number>) {
      const id = action.payload;
      delete state.byId[id];
      state.ids = state.ids.filter((i) => i !== id);
      state.localIds = state.localIds.filter((i) => i !== id);
      state.total = Math.max(0, state.total - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsList.pending, (state) => {
        state.status = ProductStatusEnum.LOADING;
        state.error = undefined;
      })
      .addCase(fetchProductsList.fulfilled, (state, action) => {
        const { products = [], total = 0 } = action.payload;
        state.status = ProductStatusEnum.SUCCEEDED;
        const args = action.meta?.arg || {};
        const isFirstPage = Number(args.skip ?? 0) === 0;

        if (isFirstPage) {
          const localProducts = state.localIds.map((id) => state.byId[id]);
          state.byId = {};
          state.ids = [];

          localProducts.forEach((p) => {
            if (p) {
              state.byId[p.id] = p;
              state.ids.push(p.id);
            }
          });
        }

        products.forEach((p: Product) => {
          if (p && p.id && !isLocalProduct(p.id)) {
            state.byId[p.id] = p;
            if (!state.ids.includes(p.id)) {
              state.ids.push(p.id);
            }
          }
        });

        const apiProductCount = state.ids.filter(
          (id) => !isLocalProduct(id)
        ).length;
        state.total = total || apiProductCount;
      })
      .addCase(fetchProductsList.rejected, (state, action) => {
        state.status = ProductStatusEnum.FAILED;
        state.error = (action.payload as ApiError) || {
          message: action.error.message || "Failed to fetch products",
        };
      })

      .addCase(fetchProduct.pending, (state) => {
        state.status = ProductStatusEnum.LOADING;
        state.error = undefined;
      })
      .addCase(
        fetchProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const p = action.payload;
          if (!isLocalProduct(p.id)) {
            state.byId[p.id] = p;
            if (!state.ids.includes(p.id)) state.ids.push(p.id);
          }
          state.status = ProductStatusEnum.SUCCEEDED;
        }
      )
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = ProductStatusEnum.FAILED;
        state.error = (action.payload as ApiError) || {
          message: action.error.message || "Failed to fetch product",
        };
      })

      .addCase(
        createNewProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const p = action.payload;
          state.byId[p.id] = p;
          if (!state.localIds.includes(p.id)) {
            state.localIds.push(p.id);
          }
          if (!state.ids.includes(p.id)) {
            state.ids.unshift(p.id);
          }
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
        const isLocal = isLocalProduct(id);
        delete state.byId[id];
        state.ids = state.ids.filter((i) => i !== id);
        if (isLocal) {
          state.localIds = state.localIds.filter((i) => i !== id);
        }
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const {
  clearProducts,
  addLocalProduct,
  updateLocalProduct,
  removeLocalProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
