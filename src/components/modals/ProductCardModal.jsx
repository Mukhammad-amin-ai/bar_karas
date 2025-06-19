import { useState, useEffect, useRef } from "react";
import assets from "../../assets";
import { Button } from "../button/Button";
import { CounterBtn } from "../counter-btn/CounterBtn";
import "./modal.scss";

export const ProductCardModal = ({
  product,
  className,
  onClose,
  onAddToCart,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [isSwiping, setIsSwiping] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const touchStartY = useRef(0);
  const modalContentRef = useRef(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const handleCartUpdate = (event) => {
      const { cartItems: updatedCartItems } = event.detail;
      setCartItems(updatedCartItems);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  useEffect(() => {
    if (className.includes("show")) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [className]);

  useEffect(() => {
    const modalContent = modalContentRef.current;
    if (!modalContent) return;

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      setIsSwiping(true);
    };

    const handleTouchMove = (e) => {
      if (!isSwiping) return;
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchCurrentY - touchStartY.current;

      if (deltaY >= 0) {
        setTranslateY(deltaY);
      }
    };

    const handleTouchEnd = () => {
      setIsSwiping(false);

      if (translateY > 150) {
        onClose();
      }

      setTranslateY(0);
    };

    modalContent.addEventListener("touchstart", handleTouchStart);
    modalContent.addEventListener("touchmove", handleTouchMove);
    modalContent.addEventListener("touchend", handleTouchEnd);

    return () => {
      modalContent.removeEventListener("touchstart", handleTouchStart);
      modalContent.removeEventListener("touchmove", handleTouchMove);
      modalContent.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isSwiping, translateY, onClose]);

  const handleAddToCart = () => {
    if (!product) return;

    onAddToCart(product);
  };

  const handleQuantityChange = (newQuantity) => {
    if (!product) return;

    const updatedCart = { ...cartItems };

    if (newQuantity <= 0) {
      delete updatedCart[product.id];
    } else {
      updatedCart[product.id] = {
        ...updatedCart[product.id],
        quantity: newQuantity,
      };
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    setCartItems(updatedCart);

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cartItems: updatedCart },
      })
    );
  };

  // product-desc
  const isInCart = product && cartItems[product.id];

  const [activeSize, setActiveSize] = useState(1);
  const [productAcc, setProductAcc] = useState("");

  useEffect(() => {
    if (product?.itemSizes?.length > 0) {
      const defaultSize = product.itemSizes.find((item) => item.isDefault);
      if (defaultSize) {
        setActiveSize(defaultSize.id);
        setProductAcc(defaultSize);
        console.log(defaultSize);
      }
    }
  }, [product]);

  const activateSize = (itemId) => {
    setActiveSize(itemId);
    const defaultSize = product.itemSizes.find((item) => item._id === itemId);
    setProductAcc(defaultSize);
  };

  return (
    <div className={`product-card__modal modal ${className}`}>
      <div
        className="modal-content"
        ref={modalContentRef}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isSwiping ? "none" : "transform 0.3s ease-out",
        }}
      >
        <button className="close-btn" onClick={onClose}>
          <img src={assets.closeIcon || "/placeholder.svg"} alt="close" />
        </button>

        {product ? (
          <div className="parent-content">
            <img
              className="product-img"
              src={product.img || "/placeholder.svg"}
              alt={product.name}
            />
            <div className="content-box">
              <div className="scroll-content">
                {product?.itemSizes.length > 1 ? (
                  <>
                    <div className="product-size-container">
                      {product?.itemSizes.map((item, index) => (
                        <div
                          key={index}
                          className={`product-size-item ${
                            item._id === activeSize ? "active" : ""
                          }`}
                          onClick={() => activateSize(item._id)}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  ""
                )}
                <h3 className="product-name">{product.name}</h3>
                <p
                  className={`product-desc product-desc_${
                    showFullDescription ? "hidden" : "show"
                  }`}
                >
                  {product?.description}
                </p>
                <button
                  className="show-more"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Скрыть" : "Все описание"}
                </button>
                <span className="nutrition-label">В 100 г. продукта</span>
                <div className="nutrition">
                  <div>
                    <h3>
                      {productAcc
                        ? productAcc?.nutritionPerHundredGrams?.kilocalories
                        : 0}
                    </h3>
                    <span>ккал</span>
                  </div>
                  <div>
                    <h3>
                      {productAcc
                        ? productAcc?.nutritionPerHundredGrams?.proteins
                        : 0}
                    </h3>
                    <span>белки</span>
                  </div>
                  <div>
                    <h3>
                      {productAcc
                        ? productAcc?.nutritionPerHundredGrams?.fats
                        : 0}
                    </h3>
                    <span>жиры</span>
                  </div>
                  <div>
                    <h3>
                      {productAcc
                        ? productAcc?.nutritionPerHundredGrams?.carbs
                        : 0}
                    </h3>
                    <span>углеводы</span>
                  </div>
                </div>
              </div>
              <div className="product-footer">
                <span className="price">
                  Цена: {productAcc ? productAcc.price : 0}
                </span>

                {isInCart ? (
                  <CounterBtn
                    count={cartItems[product.id].quantity}
                    onIncrement={() =>
                      handleQuantityChange(cartItems[product.id].quantity + 1)
                    }
                    onDecrement={() =>
                      handleQuantityChange(cartItems[product.id].quantity - 1)
                    }
                  />
                ) : (
                  <Button label="Добавить" onClick={handleAddToCart} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-modal-state"></div>
        )}
      </div>
    </div>
  );
};
