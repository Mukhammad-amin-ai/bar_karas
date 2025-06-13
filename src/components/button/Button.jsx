import { Link } from 'react-router-dom';
import './button.scss';

export const Button = ({
  label,
  to,
  icon,
  grayBtn,
  type = 'link',
  onClick,
  ...rest
}) => {

  const className = grayBtn ? 'gray-btn' : 'orange-btn';

  const content = icon ? (
    <img className='btn__icon' src={icon} alt='icon' />
  ) : (
    <span className='btn__label'>{label}</span>
  );

  const commonProps = {
    className,
    ...rest,
  };

  return type === 'button' ? (
    <button  {...commonProps} onClick={onClick}>
      {content}
    </button>
  ) : (
    <Link {...commonProps} to={to} onClick={onClick}>
      {content}
    </Link>
  );
};
