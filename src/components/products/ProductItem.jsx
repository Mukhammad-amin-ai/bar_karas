import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../button/Button";
import { CounterBtn } from "../counter-btn/CounterBtn";
import { ProductSkeleton } from "../skeleton/ProductSkeleton";
import { addToCart, AddToCart, CatchProduct } from "./module";
import "./products.scss";

export const ProductItem = ({ product, onProductClick }) => {
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.menu.loading);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart && savedCart.length > 0) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    const handleCartUpdate = (event) => {
      const { cartItems: updatedCartItems } = event.detail;
      setCartItems(updatedCartItems);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const handleAddToCart = (product, findDefault, e) => {
    e.stopPropagation();
    e.preventDefault();
    const defaultIndex = product.itemSizes.findIndex((s) => s.isDefault);
    const size = product.itemSizes[defaultIndex];
    const structuredItem = {
      id: product._id,
      name: product.name,
      category: product.category,
      restaurant: product.restaurant,
      image: product.img || size.image,
      price: size.price,
      sizeName: size.name,
      sizeIndex: defaultIndex,
      sizeId: size._id,
      quantity: 1,
      weight: product.weight,
    };

    dispatch(addToCart({ product, itemSizeIndex: defaultIndex }));

    const updatedCart = [...cartItems, structuredItem];
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cartItems: updatedCart },
      })
    );
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cartItems: updatedCart },
      })
    );
  };

  let productShow = (item) => {
    dispatch(CatchProduct(item));
    onProductClick(item);
  };

  return (
    <div className="product-category">
      <h2 className="category-title">{product.productCategory}</h2>
      {product.products && product.products.length > 0 ? (
        <div className="product-list">
          {loading ? (
            <>
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </>
          ) : (
            <>
              {product.products.map((item, index) => (
                <div
                  key={index}
                  className="product-card"
                  onClick={() => productShow(item)}
                >
                  <img
                    className="product-img"
                    src={item.img || "/placeholder.svg"}
                    alt={item.name}
                  />
                  <div className="product-card__content">
                    <h3 className="product-price">{item.price} ₽</h3>
                    <h4 className="product-name line-clamp-1">{item.name}</h4>
                    <span className="product-weight">{item.weight} г</span>
                  </div>
                  {/* 
                  {(() => {
                    const cartItem = cartItems.find((ci) => ci.id === item._id);
                    return cartItem ? (
                      <CounterBtn
                        count={cartItem.quantity}
                        onIncrement={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item._id, cartItem.quantity + 1);
                        }}
                        onDecrement={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item._id, cartItem.quantity - 1);
                        }}
                      />
                    ) : (
                      <Button
                        label="Добавить"
                        onClick={(e) => handleAddToCart(item, e)}
                      />
                    );
                  })()} */}
                  {(() => {
                    const cartItem = cartItems.find((ci) => ci.id === item._id);
                    if (cartItem) {
                      return (
                        <CounterBtn
                          count={cartItem.quantity}
                          onIncrement={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(
                              item._id,
                              cartItem.quantity + 1
                            );
                          }}
                          onDecrement={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(
                              item._id,
                              cartItem.quantity - 1
                            );
                          }}
                        />
                      );
                    }

                    const findDefault = item.itemSizes.find(
                      (itemC) => itemC.isDefault
                    );

                    return findDefault ? (
                      <Button
                        label="Добавить"
                        onClick={(e) => handleAddToCart(item, findDefault, e)}
                      />
                    ) : null;
                  })()}
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="empty-category">
          <p>В категории на данный момент нет блюд в наличии.</p>
        </div>
      )}
    </div>
  );
};
