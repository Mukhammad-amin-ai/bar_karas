import { useState } from "react";
import { OrderModal } from "../../components/modals/OrderModal";
import { Link } from "react-router";
import "./account.scss";

export const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profile = JSON.parse(localStorage.getItem("profile"));
  const historyItems = JSON.parse(localStorage.getItem("PaidCart"));
  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const logOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      <div className="account">
        <div className="container">
          <div>
            <div className="account-header">
              <Link to="/account">
                <div className="left-box">
                  <div className="img-box">
                    <img
                      src={`https://avatars.yandex.net/get-yapic/${profile?.default_avatar_id}/islands-small`}
                      alt=""
                    />
                  </div>
                  <span>Мой аккаунт</span>
                </div>
              </Link>
              <a className="email" href="#!">
                {profile.display_name}
              </a>
            </div>
            <div className="order-history">
              <h3 className="order-history__title">История заказов</h3>
              {historyItems ? (
                <div className="order-products">
                  <div className="order-product">
                    <div className="left-box">
                      <div className="img-block">
                        {historyItems?.cartItems.map((item, index) => (
                          <img key={index} src={item.image} alt="item.name" />
                        ))}
                      </div>
                      <div className="info-box">
                        <h3>Бар Карась</h3>
                        <div className="price-box">
                          <span>{historyItems?.totalItems} блюда на</span>
                          <span>{historyItems?.totalPrice} ₽</span>
                        </div>
                        <span className="date">{historyItems?.date}</span>
                      </div>
                    </div>
                    {historyItems?.status === "Pending" ? (
                      <div className="status-btn progress">В работе</div>
                    ) : (
                      <button className="status-btn" onClick={handleModalOpen}>
                        Завершен
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <button onClick={logOut} className="log-out">
            Выйти из аккаунта
          </button>
        </div>
      </div>
      <OrderModal isModalOpen={isModalOpen} handleModalOpen={handleModalOpen} />
    </>
  );
};
