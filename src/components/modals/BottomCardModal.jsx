"use client";

import { Button } from "../button/Button";
import assets from "../../assets";
import "./modal.scss";

export const BottomCardModal = ({ cartItems, onClick, className = "" }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className={`bottom-card__modal ${className}`} onClick={onClick}>
      <div className="left-box">
        <div className="img-box">
          <img src={assets.cardIcon || "/placeholder.svg"} alt="" />
        </div>
        <div>
          <h3>
            В корзине {totalItems} {getTotalItemsText(totalItems)}
          </h3>
          <span>На сумму {totalPrice} ₽</span>
        </div>
      </div>
      <Button icon={assets.nextArrow} type="button" />
    </div>
  );
};

function getTotalItemsText(count) {
  if (count === 1) return "блюдо";
  if (count >= 2 && count <= 4) return "блюда";
  return "блюд";
}
