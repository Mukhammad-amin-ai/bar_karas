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

export const FetchMenu = (option) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.get("/menu", option);

    if (response.status === 200) {
      let data = response.data[0]?.itemCategories;

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

      dispatch(CategoryListMutate(categoryList));
      dispatch(CategoryMutate(category));
      if (category) {
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      }
    } else {
      dispatch(setLoading(false));
    }
  } catch (e) {
    dispatch(setLoading(false));
    console.error(e);
  }
};

export default MENU.reducer;
