"use client";

import { useSelector } from "react-redux";
import { ProductItem } from "./ProductItem";
import "./products.scss";

export const ProductsList = ({ onProductClick, showBottomModal }) => {

  const productsDB = useSelector((state) => state.menu.category);

  return (
    <div className={`products ${showBottomModal ? "bottom-el" : ""}`}>
      <div className="products-container">
        {productsDB?.map((category, index) => {
          const categorySlug = category.productCategory
            .toLowerCase()
            .replace(/\s+/g, "-");

          return (
            <div id={categorySlug} key={index}>
              <ProductItem product={category} onProductClick={onProductClick} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
