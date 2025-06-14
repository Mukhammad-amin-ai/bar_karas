import { Link } from "react-router-dom";
import assets from "../../assets";
import "./login.scss";
import { Button } from "../../components";
import { openYandexOAuth } from "../../providers/yandex";

export const Login = () => {
  return (
    <div className="login-page">
      <div className="container">
        <div className="login-page__content">
          <img
            className="company-logo"
            src={assets.companyLogo}
            alt="company logo"
          />
          <h1 className="login-page__title">Добро пожаловать</h1>
          <p className="login-page__desc">
            Чтобы сделать заказ подключитесь к системе через Яндекс
          </p>
        </div>
        <div className="login-page__btns">
          <Link onClick={openYandexOAuth} className="yandex-btn" to="#!">
            <img
              className="yandex-btn__icon"
              src={assets.yandexLogo}
              alt="yandex logo"
            />
            <span>Войти с Яндекс ID</span>
            <img
              className="yandex-btn__icon"
              src={assets.user}
              alt="user img"
            />
          </Link>
          <Button to="/" label="Посмотреть меню" grayBtn={true} />
        </div>
      </div>
    </div>
  );
};
