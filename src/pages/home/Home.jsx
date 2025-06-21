"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../../components/header/Header";
import {
  BottomCardModal,
  Cart,
  Menu,
  ProductCardModal,
  ProductsList,
} from "../../components";
import { FetchMenu } from "./module";

import "./home.scss";

export const Home = () => {
  const dispatch = useDispatch();
  const { restaurant } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modals, setModals] = useState({
    productCard: false,
    cart: false,
  });
  const [cartItems, setCartItems] = useState([]);
  const [showBottomModal, setShowBottomModal] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      setCartItems(Object.values(parsedCart));
      setShowBottomModal(Object.values(parsedCart).length > 0);
    }
  }, []);

  useEffect(() => {
    const handleCartUpdate = (event) => {
      const { cartItems: updatedCartItems } = event.detail;

      const cartArray = Object.values(updatedCartItems);
      setCartItems(cartArray);
      setShowBottomModal(cartArray.length > 0);
    };

    const handleOpenCartModal = (event) => {
      const { open } = event.detail;
      if (open) {
        setModals({
          productCard: false,
          cart: true,
        });
      }
    };

    window.addEventListener("openCartModal", handleOpenCartModal);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("openCartModal", handleOpenCartModal);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("modal")) {
        setModals({
          productCard: false,
          cart: false,
        });
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModals({
      productCard: true,
      cart: false,
    });
  };

  const handleCloseModal = () => {
    setModals({
      productCard: false,
      cart: false,
    });
  };

  const handleAddToCart = (product, activeSize) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item._id === product._id
    );

    let updatedCartItems;
    if (existingItemIndex >= 0) {
      updatedCartItems = cartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCartItems = [
        ...cartItems,
        { ...product, activeSizeId: activeSize, quantity: 1 },
      ];
    }

    setCartItems(updatedCartItems);
    setShowBottomModal(true);

    const cartObject = updatedCartItems.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});
    localStorage.setItem("cartItems", JSON.stringify(cartObject));

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cartItems: cartObject },
      })
    );
  };

  // API INTEGRATION ===================================

  // const handleAddToCart = (product, activeSizeId) => {
  //   // Найдём, есть ли такой же продукт с тем же размером
  //   const existingItemIndex = cartItems.findIndex(
  //     (item) => item._id === product._id && item.activeSizeId === activeSizeId
  //   );

  //   let updatedCartItems;

  //   if (existingItemIndex >= 0) {
  //     updatedCartItems = cartItems.map((item, index) =>
  //       index === existingItemIndex
  //         ? { ...item, quantity: item.quantity + 1 }
  //         : item
  //     );
  //   } else {
  //     updatedCartItems = [
  //       ...cartItems,
  //       {
  //         ...product,
  //         activeSizeId,
  //         quantity: 1,
  //       },
  //     ];
  //   }

  //   setCartItems(updatedCartItems);
  //   setShowBottomModal(true);

  //   localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

  //   window.dispatchEvent(
  //     new CustomEvent("cartUpdated", {
  //       detail: { cartItems: updatedCartItems },
  //     })
  //   );
  // };

  const category = useSelector((state) => state.menu.category);

  useEffect(() => {
    dispatch(
      FetchMenu({
        headers: {
          "x-restaurant-id": restaurant,
        },
      })
    );
  }, [dispatch]);
  
  // ===================================================

  return (
    <div>
      <Header category={category} />
      <Menu />
      <ProductsList
        onProductClick={handleProductClick}
        showBottomModal={showBottomModal}
      />

      <ProductCardModal
        className={modals.productCard ? "show" : ""}
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      <Cart
        className={modals.cart ? "show" : ""}
        cartItems={cartItems}
        setCartItems={(updatedCartItems) => {
          setCartItems(updatedCartItems);
          setShowBottomModal(updatedCartItems.length > 0);

          if (updatedCartItems.length > 0) {
            const cartObject = updatedCartItems.reduce((acc, item) => {
              acc[item.id] = item;
              return acc;
            }, {});
            localStorage.setItem("cartItems", JSON.stringify(cartObject));

            window.dispatchEvent(
              new CustomEvent("cartUpdated", {
                detail: { cartItems: cartObject },
              })
            );
          } else {
            localStorage.removeItem("cartItems");

            window.dispatchEvent(
              new CustomEvent("cartUpdated", {
                detail: { cartItems: {} },
              })
            );
          }
        }}
        onClose={handleCloseModal}
      />

      {showBottomModal && (
        <BottomCardModal
          cartItems={cartItems}
          onClick={() => setModals({ productCard: false, cart: true })}
          className="show"
        />
      )}
    </div>
  );
};
