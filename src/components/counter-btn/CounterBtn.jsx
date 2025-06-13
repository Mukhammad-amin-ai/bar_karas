'use client';

import assets from '../../assets';
import './counter.scss';

export const CounterBtn = ({ count = 0, onIncrement, onDecrement }) => {
  return (
    <div className='counter-btn'>
      <button className='decrement' onClick={onDecrement}>
        <img src={assets.minus || '/placeholder.svg'} alt='Уменьшить' />
      </button>
      <span className='count'>{count}</span>
      <button className='increment' onClick={onIncrement}>
        <img src={assets.plus || '/placeholder.svg'} alt='Увеличить' />
      </button>
    </div>
  );
};
