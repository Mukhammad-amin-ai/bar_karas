import { configureStore } from "@reduxjs/toolkit";
import MENU from "../../pages/home/module";

export const store = configureStore({
  reducer: {
    menu: MENU,
  },
});
