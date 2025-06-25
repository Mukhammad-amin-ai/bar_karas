import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product_show: {},
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const PRODUCT = createSlice({
  initialState,
  name: "product-controller",
  reducers: {
    MutateProduct: (state, action) => {
      state.product_show = action.payload;
    },
    addToCart: (state, action) => {
      const { product, itemSizeIndex } = action.payload;

      const size = product.itemSizes[itemSizeIndex];

      const existing = state.cartItems.find(
        (item) => item.id === product._id && item.sizeIndex === itemSizeIndex
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push({
          id: product._id,
          name: product.name,
          image: product.img || size.image,
          price: size.price,
          sizeName: size.name,
          sizeIndex: itemSizeIndex,
          sizeId: size._id,
          quantity: 1,
          weight: product.weight,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    // Пример удаления
    removeFromCart: (state, action) => {
      const { id, sizeIndex } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== id || item.sizeIndex !== sizeIndex
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});

export const { MutateProduct, addToCart, removeFromCart } = PRODUCT.actions;

export const CatchProduct = (product) => async (dispatch) => {
  dispatch(MutateProduct(product));
};

export const AddToCart = (product, ProductSize) => async () => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  const itemExists = cartItems?.some((cart) => cart.id === product._id);
  if (!itemExists) {
    const findDefault = product.itemSizes.find((item) => item.isDefault);
    const structure = {
      id: product._id,
      name: product.name,
      img: findDefault.image,
      category: product.category,
      restaurant: product.restaurant,
      sizeId: findDefault._id,
      price: findDefault.price,
      quantity: 1,
    };
    const updatedCart = [...cartItems, structure];
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  } else {
    const itemExists = cartItems?.some(
      (cart) => cart.id === product._id && cart.sizeId === ProductSize
    );

    if (!itemExists) {
      const findDefault = product.itemSizes.find((item) => item.isDefault);
      const structure = {
        id: product._id,
        name: product.name,
        img: findDefault.image,
        category: product.category,
        restaurant: product.restaurant,
        sizeId: findDefault._id,
        price: findDefault.price,
        quantity: 1,
      };
      const updatedCart = [...cartItems, structure];
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }
  }
};


export default PRODUCT.reducer;
