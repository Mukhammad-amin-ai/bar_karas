import { createSlice } from "@reduxjs/toolkit"
import  axiosInstance  from '../../providers/axios'

const initialState = {
  products: [],
};

export const PRODUCTS = createSlice({
  name: "products",
  initialState,
  reducers: {
    callToProduct: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { callToProduct } = PRODUCTS.actions;

export const FetchProducts = (option) => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/menu",option);
    dispatch(callToProduct(response.data.recipes));
  } catch (e) {
    console.error(e);
  }
};

export default PRODUCTS.reducer;