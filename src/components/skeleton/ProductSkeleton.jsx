import "./skeleton.scss";

export const ProductSkeleton = () => {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-price"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-weight"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
};
