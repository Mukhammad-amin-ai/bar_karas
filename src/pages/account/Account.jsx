import { useState } from "react";
import { OrderModal } from "../../components/modals/OrderModal";
import { Link } from "react-router";
import assets from "../../assets";
import "./account.scss";
export const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profile = JSON.parse(localStorage.getItem("profile"));
  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const logOut = ()=>{
    localStorage.clear()
    window.location.href = '/login'
  }

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
              <div className="order-products">
                <div className="order-product">
                  <div className="left-box">
                    <div className="img-block">
                      <img src={assets.productImg} alt="" />
                      <img src={assets.productImg} alt="" />
                      <img src={assets.productImg} alt="" />
                      <img src={assets.productImg} alt="" />
                    </div>
                    <div className="info-box">
                      <h3>Бар Карась</h3>
                      <div className="price-box">
                        <span>4 блюда на</span>
                        <span>3 120 ₽</span>
                      </div>
                      <span className="date">12.10.24</span>
                    </div>
                  </div>
                  <div className="status-btn progress">В работе</div>
                </div>
                <div className="order-product">
                  <div className="left-box">
                    <div className="img-block">
                      <img src={assets.productImg} alt="" />
                      <img src={assets.productImg} alt="" />
                      <img src={assets.productImg} alt="" />
                    </div>
                    <div className="info-box">
                      <h3>Бар Карась</h3>
                      <div className="price-box">
                        <span>4 блюда на</span>
                        <span>3 120 ₽</span>
                      </div>
                      <span className="date">12.10.24</span>
                    </div>
                  </div>
                  <button className="status-btn" onClick={handleModalOpen}>
                    Завершен
                  </button>
                </div>
                <div className="order-product">
                  <div className="left-box">
                    <div className="img-block">
                      <img src={assets.productImg} alt="" />
                      <img src={assets.productImg} alt="" />
                    </div>
                    <div className="info-box">
                      <h3>Бар Карась</h3>
                      <div className="price-box">
                        <span>4 блюда на</span>
                        <span>3 120 ₽</span>
                      </div>
                      <span className="date">12.10.24</span>
                    </div>
                  </div>
                  <button className="status-btn" onClick={handleModalOpen}>
                    Завершен
                  </button>
                </div>
              </div>
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
