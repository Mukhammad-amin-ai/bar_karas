import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "../button/Button";
import { CounterBtn } from "../counter-btn/CounterBtn";
import { ProductSkeleton } from "../skeleton/ProductSkeleton";
import "./products.scss";

export const ProductItem = ({ product, onProductClick }) => {
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
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

  const handleAddToCart = (item, e) => {
    e.stopPropagation();

    const updatedCart = {
      ...cartItems,
      [item.id]: {
        ...item,
        quantity: 1,
      },
    };

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cartItems: updatedCart },
      })
    );
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedCart = { ...cartItems };

    if (newQuantity <= 0) {
      delete updatedCart[itemId];
    } else {
      updatedCart[itemId] = {
        ...updatedCart[itemId],
        quantity: newQuantity,
      };
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cartItems: updatedCart },
      })
    );
  };

  const loading = useSelector((state) => state.menu.loading);

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
                  onClick={() => onProductClick(item)}
                >
                  <img
                    className="product-img"
                    src={item.img || "/placeholder.svg"}
                    alt={item.name}
                  />
                  <div className="product-card__content">
                    <h3 className="product-price">{item.price}</h3>
                    <h4 className="product-name line-clamp-1">{item.name}</h4>
                    <span className="product-weight">{item.weight}</span>
                  </div>

                  {cartItems[item.id] ? (
                    <CounterBtn
                      count={cartItems[item.id].quantity}
                      onIncrement={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(
                          item.id,
                          cartItems[item.id].quantity + 1
                        );
                      }}
                      onDecrement={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(
                          item.id,
                          cartItems[item.id].quantity - 1
                        );
                      }}
                    />
                  ) : (
                    <Button
                      label="Добавить"
                      onClick={(e) => handleAddToCart(item, e)}
                    />
                  )}
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
