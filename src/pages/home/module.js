import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../providers/axios";

const initialState = {
  category: [],
  loading: true,
  categoryList: [],
};

export const MENU = createSlice({
  name: "menu",
  initialState,
  reducers: {
    CategoryMutate: (state, action) => {
      state.category = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    CategoryListMutate: (state, action) => {
      state.categoryList = action.payload;
    },
  },
});

export const { CategoryMutate, setLoading, CategoryListMutate } = MENU.actions;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const FetchMenu = (option) => async (dispatch) => {
  dispatch(setLoading(true)); // включаем сразу

  try {
    const response = await axiosInstance.get("/menu", option);

    if (response.status === 200) {
      const data = response.data[0]?.itemCategories;

      const category = data?.map((item, index) => ({
        id: index + 1,
        restaurant: item.restaurant,
        productCategory: item.name,
        products: item.items,
      }));

      const categoryList = data?.map((item, index) => ({
        id: index + 1,
        restaurant: item.restaurant,
        label: item.name,
        active: index === 0,
      }));

      await Promise.all([
        dispatch(CategoryListMutate(categoryList)),
        dispatch(CategoryMutate(category)),
      ]);
    }
  } catch (e) {
    console.error("Error fetching menu:", e);
  } finally {
    await delay(100);
    dispatch(setLoading(false));
  }
};

export default MENU.reducer;
