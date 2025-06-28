import { useState, useEffect, useRef, useMemo, startTransition } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../button/Button";
import { CounterBtn } from "../counter-btn/CounterBtn";
import { addToCart } from "../products/module";
import assets from "../../assets";
import "./modal.scss";

export const ProductCardModal = ({ product, className, onClose }) => {
  const [activeSize, setActiveSize] = useState(null);
  const [choosedIndex, setChoosedIndex] = useState(null);
  const [productAcc, setProductAcc] = useState("");

  const dispatch = useDispatch();
  const [showFullDescription, setShowFullDescription] = useState(true);
  const [cartItems, setCartItems] = useState([]);
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!product) return;

    const exist = cartItems?.find(
      (item) => item.id === product._id && item.sizeId === activeSize
    );

    if (!exist) {
      const sizeIndex =
        typeof choosedIndex === "number"
          ? choosedIndex
          : product.itemSizes.findIndex((s) => s.isDefault);

      const size = product.itemSizes[sizeIndex];

      // category: product.category,
      // restaurant: product.restaurant,
      const structuredItem = {
        id: product._id,
        name: product.name,
        image: size.image,
        price: size.price,
        sizeName: size.name,
        sizeIndex: sizeIndex,
        sizeId: size._id,
        quantity: 1,
        weight: product.weight,
      };

      dispatch(addToCart({ product, itemSizeIndex: sizeIndex }));

      const updatedCart = [...cartItems, structuredItem];
      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));

      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { cartItems: updatedCart },
        })
      );
    }
  };

  const handleQuantityChange = (currentCartItem, newQuantity) => {
    if (!product) return;

    const updatedCart = [...cartItems];

    const itemIndex = updatedCart.findIndex(
      (item) =>
        item.id === currentCartItem.id && item.sizeId === currentCartItem.sizeId
    );

    if (itemIndex !== -1) {
      if (newQuantity <= 0) {
        updatedCart.splice(itemIndex, 1);
      } else {
        updatedCart[itemIndex].quantity = newQuantity;
      }
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cartItems: updatedCart },
      })
    );
  };

  useEffect(() => {
    if (product?.itemSizes?.length > 0) {
      const defaultSize = product.itemSizes.find((item) => item.isDefault);
      const defaultIndex = product.itemSizes.findIndex((s) => s.isDefault);
      if (defaultSize) {
        setActiveSize(defaultSize._id);
        setProductAcc(defaultSize);
        setChoosedIndex(defaultIndex);
      }
    }
  }, [product]);

  const activateSize = (itemId) => {
    console.time("activateSize");
    const sizeIndex = product.itemSizes.findIndex((s) => s._id === itemId);
    const defaultSize = product.itemSizes.find((item) => item._id === itemId);
    startTransition(() => {
      setChoosedIndex(sizeIndex);
      setActiveSize(itemId);
      setProductAcc(defaultSize);
    });
    console.timeEnd("activateSize");
  };

  const currentCartItem = cartItems?.find(
    (item) => item.id === product?._id && item.sizeId === activeSize
  );

  const renderedSizes = useMemo(() => {
    return product?.itemSizes.map((item, index) => (
      <div
        key={index}
        className={`product-size-item ${
          item._id === activeSize ? "active" : ""
        }`}
        onClick={() => activateSize(item._id)}
      >
        {item.name}
      </div>
    ));
  }, [product?.itemSizes, activeSize]);

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
              src={
                productAcc?.image
                  ? productAcc?.image || product.img
                  : "/placeholder.svg"
              }
              height="320"
              loading="lazy"
              alt={product.name}
            />
            <div className="content-box">
              <div className="scroll-content">
                {product?.itemSizes.length > 1 ? (
                  <>
                    <div className="product-size-container">
                      {renderedSizes}
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
                  Цена: {productAcc ? productAcc.price : 0} ₽
                </span>
                {currentCartItem ? (
                  <CounterBtn
                    count={currentCartItem.quantity}
                    onIncrement={() =>
                      handleQuantityChange(
                        currentCartItem,
                        currentCartItem.quantity + 1
                      )
                    }
                    onDecrement={() =>
                      handleQuantityChange(
                        currentCartItem,
                        currentCartItem.quantity - 1
                      )
                    }
                  />
                ) : (
                  <Button
                    label="Добавить"
                    onClick={(e) => handleAddToCart(e)}
                  />
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
