import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { CategorySkeleton } from "../skeleton/CategorySkeleton";
import "./menu.scss";

export const Menu = () => {
  const initialCategories = useSelector((state) => state.menu.categoryList);
  const loading = useSelector((state) => state.menu.loading);

  const [categories, setCategories] = useState([]);

  const menuRef = useRef(null);
  const menuHeight = useRef(0);
  // const manualScrollTimeout = useRef(null);

  useEffect(() => {
    if (initialCategories?.length) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  useEffect(() => {
    const updateMenuHeight = () => {
      if (menuRef.current) {
        menuHeight.current = menuRef.current.offsetHeight;
      }
    };

    updateMenuHeight();
    window.addEventListener("resize", updateMenuHeight);
    return () => window.removeEventListener("resize", updateMenuHeight);
  }, []);

  // useEffect(() => {
  //   if (!menuRef.current) return;

  //   // const handleScroll = () => {
  //   //   setIsManualScrolling(true);
  //   //   clearTimeout(manualScrollTimeout.current);
  //   //   manualScrollTimeout.current = setTimeout(() => {
  //   //     setIsManualScrolling(false);
  //   //   }, 200);
  //   // };

  //   const menuElement = menuRef.current;
  //   menuElement.addEventListener("scroll", handleScroll);

  //   return () => {
  //     menuElement.removeEventListener("scroll", handleScroll);
  //     clearTimeout(manualScrollTimeout.current);
  //   };
  // }, []);

  useEffect(() => {
    if (!categories?.length) return;

    const observerOptions = {
      root: null,
      rootMargin: `-${menuHeight.current + 20}px 0px 0px 0px`,
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      let maxVisibility = 0;
      let mostVisibleSection = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
          maxVisibility = entry.intersectionRatio;
          mostVisibleSection = entry.target.id;
        }
      });

      if (mostVisibleSection) {
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            active:
              cat.label.toLowerCase().replace(/\s+/g, "-") ===
              mostVisibleSection,
          }))
        );
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    categories.forEach((category) => {
      const slug = category.label.toLowerCase().replace(/\s+/g, "-");
      const element = document.getElementById(slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [categories]);

  const handleClick = (index) => {
    if (!categories.length) return;

    // setIsManualScrolling(false);

    const updated = categories.map((cat, i) => ({
      ...cat,
      active: i === index,
    }));
    setCategories(updated);

    const slug = categories[index].label.toLowerCase().replace(/\s+/g, "-");
    const element = document.getElementById(slug);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY;
      const offset = top - menuHeight.current - 80;

      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="menu-container">
      {loading || !categories.length ? (
        <div className="menu-list">
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
        </div>
      ) : (
        <ul className="menu-list" ref={menuRef}>
          {categories.map((category, index) => (
            <li key={index} className="menu-item">
              <a
                href={`#${category.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`menu-link ${category.active ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(index);
                }}
              >
                {category.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
