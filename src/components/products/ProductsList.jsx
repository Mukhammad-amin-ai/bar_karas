"use client";

import { useSelector } from "react-redux";
import { ProductItem } from "./ProductItem";
import "./products.scss";

export const ProductsList = ({ onProductClick, showBottomModal }) => {
  // const productsDB = [
  //   {
  //     productCategory: "Первые блюда",
  //     products: [
  //       {
  //         id: 1,
  //         img: assets.productImg,
  //         name: "Рамен стейк",
  //         price: "1 000 ₽",
  //         weight: "600 г",
  //       },
  //       {
  //         id: 2,
  //         img: assets.productImg,
  //         name: "Рамен стейк",
  //         price: "1 000 ₽",
  //         weight: "600 г",
  //       },
  //       {
  //         id: 3,
  //         img: assets.productImg,
  //         name: "Рамен стейк",
  //         price: "1 000 ₽",
  //         weight: "600 г",
  //       },
  //       {
  //         id: 4,
  //         img: assets.productImg,
  //         name: "Рамен стейк",
  //         price: "1 000 ₽",
  //         weight: "600 г",
  //       },
  //       {
  //         id: 5,
  //         img: assets.productImg,
  //         name: "Рамен стейк",
  //         price: "1 000 ₽",
  //         weight: "600 г",
  //       },
  //     ],
  //   },
  //   {
  //     productCategory: "Супы",
  //     products: [
  //       {
  //         id: 6,
  //         img: assets.productImg,
  //         name: "Борщ",
  //         price: "500 ₽",
  //         weight: "400 г",
  //       },
  //       {
  //         id: 7,
  //         img: assets.productImg,
  //         name: "Уха",
  //         price: "550 ₽",
  //         weight: "420 г",
  //       },
  //       {
  //         id: 8,
  //         img: assets.productImg,
  //         name: "Борщ",
  //         price: "500 ₽",
  //         weight: "400 г",
  //       },
  //       {
  //         id: 9,
  //         img: assets.productImg,
  //         name: "Уха",
  //         price: "550 ₽",
  //         weight: "420 г",
  //       },
  //     ],
  //   },
  //   {
  //     productCategory: "Вок",
  //     products: [
  //       {
  //         id: 10,
  //         img: assets.productImg,
  //         name: "Вок с курицей",
  //         price: "450 ₽",
  //         weight: "350 г",
  //       },
  //       {
  //         id: 11,
  //         img: assets.productImg,
  //         name: "Вок с говядиной",
  //         price: "550 ₽",
  //         weight: "350 г",
  //       },
  //       {
  //         id: 12,
  //         img: assets.productImg,
  //         name: "Рис с овощами",
  //         price: "350 ₽",
  //         weight: "300 г",
  //       },
  //       {
  //         id: 13,
  //         img: assets.productImg,
  //         name: "Рис с курицей",
  //         price: "450 ₽",
  //         weight: "350 г",
  //       },
  //     ],
  //   },
  //   {
  //     productCategory: "На рисе",
  //     products: [
  //       {
  //         id: 14,
  //         img: assets.productImg,
  //         name: "Рис с овощами",
  //         price: "350 ₽",
  //         weight: "300 г",
  //       },
  //       {
  //         id: 15,
  //         img: assets.productImg,
  //         name: "Рис с курицей",
  //         price: "450 ₽",
  //         weight: "350 г",
  //       },
  //       {
  //         id: 16,
  //         img: assets.productImg,
  //         name: "Рис с овощами",
  //         price: "350 ₽",
  //         weight: "300 г",
  //       },
  //       {
  //         id: 17,
  //         img: assets.productImg,
  //         name: "Рис с курицей",
  //         price: "450 ₽",
  //         weight: "350 г",
  //       },
  //     ],
  //   },
  //   {
  //     productCategory: "Суши",
  //     products: [],
  //   },
  // ];

  const productsDB = useSelector((state) => state.menu.category);

  return (
    <div className={`products ${showBottomModal ? "bottom-el" : ""}`}>
      <div className="products-container">
        {productsDB.map((category, index) => {
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
