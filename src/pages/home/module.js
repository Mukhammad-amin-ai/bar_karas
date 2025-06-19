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
    const response = await axiosInstance.get("/menu", option);
    let category;
    let categoryList;
    if (response.status === 200) {
      let data = response.data[0]?.itemCategories;
      category = data?.map((item, index) => {
        return {
          id: index + 1,
          restaurant: item.restaurant,
          productCategory: item.name,
          products: item.items,
        };
      });

      categoryList = data?.map((item, index) => {
        return {
          id: index + 1,
          restaurant: item.restaurant,
          label: item.name,
          active: index === 0,
        };
      });
      dispatch(setLoading(false));
      dispatch(CategoryListMutate(categoryList));
      dispatch(CategoryMutate(category));
    }
  } catch (e) {
    dispatch(setLoading(true));
    console.error(e);
  }
};

export default MENU.reducer;
