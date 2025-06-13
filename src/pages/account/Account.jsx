import { useState } from 'react';
import assets from '../../assets';
import { OrderModal } from '../../components/modals/OrderModal';
import './account.scss';
export const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className='account'>
        <div className='container'>
          <div>
            <div className='account-header'>
              <div className='left-box'>
                <div className='img-box'>
                  <img src={assets.userImg} alt='' />
                </div>
                <span>Мой аккаунт</span>
              </div>
              <a className='email' href='#!'>
                username@yandex.ru
              </a>
            </div>

            <div className='order-history'>
              <h3 className='order-history__title'>История заказов</h3>
              <div className='order-products'>
                <div className='order-product'>
                  <div className='left-box'>
                    <div className='img-block'>
                      <img src={assets.productImg} alt='' />
                      <img src={assets.productImg} alt='' />
                      <img src={assets.productImg} alt='' />
                      <img src={assets.productImg} alt='' />
                    </div>
                    <div className='info-box'>
                      <h3>Бар Карась</h3>
                      <div className='price-box'>
                        <span>4 блюда на</span>
                        <span>3 120 ₽</span>
                      </div>
                      <span className='date'>12.10.24</span>
                    </div>
                  </div>
                  <div className='status-btn progress'>В работе</div>
                </div>
                <div className='order-product'>
                  <div className='left-box'>
                    <div className='img-block'>
                      <img src={assets.productImg} alt='' />
                      <img src={assets.productImg} alt='' />
                      <img src={assets.productImg} alt='' />
                    </div>
                    <div className='info-box'>
                      <h3>Бар Карась</h3>
                      <div className='price-box'>
                        <span>4 блюда на</span>
                        <span>3 120 ₽</span>
                      </div>
                      <span className='date'>12.10.24</span>
                    </div>
                  </div>
                  <button className='status-btn' onClick={handleModalOpen}>
                    Завершен
                  </button>
                </div>
                <div className='order-product'>
                  <div className='left-box'>
                    <div className='img-block'>
                      <img src={assets.productImg} alt='' />
                      <img src={assets.productImg} alt='' />
                    </div>
                    <div className='info-box'>
                      <h3>Бар Карась</h3>
                      <div className='price-box'>
                        <span>4 блюда на</span>
                        <span>3 120 ₽</span>
                      </div>
                      <span className='date'>12.10.24</span>
                    </div>
                  </div>
                  <button className='status-btn' onClick={handleModalOpen}>
                    Завершен
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button className='log-out'>Выйти из аккаунта</button>
        </div>
      </div>
      <OrderModal isModalOpen={isModalOpen} handleModalOpen={handleModalOpen} />
    </>
  );
};
