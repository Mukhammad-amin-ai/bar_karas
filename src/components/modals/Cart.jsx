import {useState, useEffect, useRef} from "react";
import assets from "../../assets";
import {Button} from "../button/Button";
import "./modal.scss";

export const Cart = ({className, cartItems, setCartItems, onClose}) => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    const isProfileNotEmpty = profile && Object.keys(profile).length > 0;

    const [isSwiping, setIsSwiping] = useState(false);
    const [translateY, setTranslateY] = useState(0);
    const [isPurchased, setIsPurchased] = useState(false);
    const touchStartY = useRef(0);
    const modalContentRef = useRef(null);

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
            const isCartProducts = e.target.closest(".cart-products");
            if (isCartProducts) {
                setIsSwiping(false);
                return;
            }
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

    const handleQuantityChange = (currentCartItem, newQuantity) => {
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
                detail: {cartItems: updatedCart},
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const purchaseItems = (item) => {
        const date = new Date();

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);

        const formattedDate = `${day}.${month}.${year}`
        const paid = {
            status: "Pending",
            profile: profile,
            cartItems: item,
            totalPrice: total,
            totalItems: totalItems,
            date: formattedDate,
        }

        localStorage.setItem("PaidCart", JSON.stringify(paid));

        try {
            localStorage.setItem("cartItems", JSON.stringify([]));
            setCartItems([]);
            window.dispatchEvent(
                new CustomEvent("cartUpdated", {
                    detail: {cartItems: []}
                })
            );
            setIsPurchased(true)
            console.log("cartItems cleared in localStorage");
        } catch (e) {
            console.error("Error saving cartItems:", e);
        }
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const serviceFee = 120;
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.price;
        return sum + price * item.quantity;
    }, 0);
    const total = subtotal + serviceFee;

    return (
        <div className={`cart-modal modal ${className}`}>
            <div
                className="modal-content"
                ref={modalContentRef}
                style={{
                    transform: `translateY(${translateY}px)`,
                    transition: isSwiping ? "none" : "transform 0.3s ease-out",
                }}
            >
                <div className="modal-header">
                    <h2 className="modal-title">Ваша корзина</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9 1L1 9M1 1L9 9"
                                stroke="#5C5A57"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                {
                    !isPurchased ? (
                        cartItems?.length > 0 ? (
                            <>
                                <div className="cart-products">
                                    {cartItems.map((item, index) => (
                                        <div className="cart-product" key={index}>
                                            <div className="left-box">
                                                <img
                                                    className="product-img"
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.name}
                                                />
                                                <div>
                                                    <h4 className="product-name">{item.name}</h4>
                                                    <div className="price-box">
                                                        <span className="price">{item.price} ₽</span>
                                                        <span className="weight">{item.weight} г</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="counter">
                                                <button
                                                    className="decrement"
                                                    onClick={() =>
                                                        handleQuantityChange(item, item.quantity - 1)
                                                    }
                                                >
                                                    <img src={assets.minus || "/placeholder.svg"} alt=""/>
                                                </button>
                                                <span className="count">{item.quantity}</span>
                                                <button
                                                    className="increment"
                                                    onClick={() =>
                                                        handleQuantityChange(item, item.quantity + 1)
                                                    }
                                                >
                                                    <img src={assets.plus || "/placeholder.svg"} alt=""/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bottom-box">
                                    <div className="order-list">
                                        <ul>
                                            <li>
                                                <span className="list">Количество блюд</span>
                                                <span className="value">{totalItems}</span>
                                            </li>
                                            <li>
                                                <span className="list">Сервисный сбор</span>
                                                <span className="value">{serviceFee} ₽</span>
                                            </li>
                                            <li>
                                                <span className="list">Итог</span>
                                                <span className="value">{total} ₽</span>
                                            </li>
                                        </ul>
                                        {isProfileNotEmpty ? (
                                            <Button onClick={() => purchaseItems(cartItems)} label="Заказать"/>
                                        ) : (
                                            <Button type="button" label="Заказать"
                                                    grayBtn={true}/>
                                        )}
                                    </div>
                                    <button className="clear-cart" onClick={clearCart}>
                                        Очистить корзину
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="empty-cart">
                                <p>В корзине нет ни одного блюда</p>
                                <Button label="Добавить блюда из меню" onClick={onClose}/>
                            </div>
                        )
                    ) : (
                        <>
                            <div className="cart-products-paid">
                                <p>Ваш заказ будет готов</p>
                            </div>
                            <div className="order-list">
                                <Button to={'/account'} label="К Заказам"/>
                            </div>
                        </>
                    )
                }

            </div>
        </div>
    )
};
