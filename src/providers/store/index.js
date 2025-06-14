import { configureStore } from "@reduxjs/toolkit";
import { PRODUCTS } from "../../pages/home/module";

export const store = configureStore({
  reducer: {
    products: PRODUCTS,
  },
});
