import { Link } from "react-router-dom";
import assets from "../../assets";
import "./header.scss";
export const Header = () => {
  const profile = JSON.parse(localStorage.getItem("profile"));
  const isProfileNotEmpty = profile && Object.keys(profile).length > 0;

  return (
    <header className="header">
      {!isProfileNotEmpty ? (
        <div className="container">
          <h3 className="app-name">Бар Карась</h3>
          <Link to="/login" className="login-btn">
            <img src={assets.userIcon} alt="user icon" />
            <span>Войти</span>
          </Link>
        </div>
      ) : (
        <div className="container">
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
        </div>
      )}
    </header>
  );
};
