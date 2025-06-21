import { configureStore } from "@reduxjs/toolkit";
import MENU from "../../pages/home/module";
import PRODUCT from "../../components/products/module";

export const store = configureStore({
  reducer: {
    menu: MENU,
    productController: PRODUCT,
  },
});
