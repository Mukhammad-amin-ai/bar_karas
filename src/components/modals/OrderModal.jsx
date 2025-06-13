import { useState, useEffect, useRef } from 'react';
import assets from '../../assets';
import './modal.scss';

export const OrderModal = ({ isModalOpen, handleModalOpen }) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const touchStartY = useRef(0);
  const modalContentRef = useRef(null);

  
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
        handleModalOpen();
      }
      
      setTranslateY(0);
    };

    modalContent.addEventListener('touchstart', handleTouchStart);
    modalContent.addEventListener('touchmove', handleTouchMove);
    modalContent.addEventListener('touchend', handleTouchEnd);

    return () => {
      modalContent.removeEventListener('touchstart', handleTouchStart);
      modalContent.removeEventListener('touchmove', handleTouchMove);
      modalContent.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSwiping, translateY, handleModalOpen]);

  return (
    <div
      className={`cart-modal modal order-modal ${isModalOpen ? 'show' : ''}`}
    >
      <div
        className='modal-content'
        ref={modalContentRef}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        <div className='modal-header'>
          <h2 className='modal-title'>Заказ от 12.10.24</h2>
          <button className='close-btn' onClick={handleModalOpen}>
            <svg
              width='10'
              height='10'
              viewBox='0 0 10 10'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M9 1L1 9M1 1L9 9'
                stroke='#5C5A57'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        <div className='cart-products'>
          <div className='cart-product'>
            <div className='left-box'>
              <img className='product-img' src={assets.productImg} />
              <div>
                <h4 className='product-name'>Рамен стейк</h4>
                <div className='price-box'>
                  <span className='price'>1 000 ₽</span>
                  <span className='weight'>600 г</span>
                </div>
              </div>
            </div>
            <div className='counter'>
              <span className='count'>1</span>
            </div>
          </div>
          <div className='cart-product'>
            <div className='left-box'>
              <img className='product-img' src={assets.productImg} />
              <div>
                <h4 className='product-name'>Рамен стейк</h4>
                <div className='price-box'>
                  <span className='price'>1 000 ₽</span>
                  <span className='weight'>600 г</span>
                </div>
              </div>
            </div>
            <div className='counter'>
              <span className='count'>1</span>
            </div>
          </div>
        </div>

        <div className='bottom-box'>
          <div className='order-list'>
            <ul>
              <li>
                <span className='list'>Количество блюд</span>
                <span className='value'>3</span>
              </li>
              <li>
                <span className='list'>Сервисный сбор</span>
                <span className='value'>120 ₽</span>
              </li>
              <li>
                <span className='list'>Итог</span>
                <span className='value'>3 120 ₽</span>
              </li>
            </ul>
            <button className='order-end'>Заказ завершен</button>
          </div>
        </div>
      </div>
    </div>
  );
};
