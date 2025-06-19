import { CategorySkeleton } from "../skeleton/CategorySkeleton";
import { useState, useEffect, useRef } from "react";
import "./menu.scss";
import { useSelector } from "react-redux";

export const Menu = () => {
  const initialCategories = useSelector((state) => state.menu.categoryList);
  const loading = useSelector((state) => state.menu.loading);

  // Initialize with empty array if Redux data not available
  const [categories, setCategories] = useState([]);
  const menuRef = useRef(null);
  const menuHeight = useRef(0);
  const [isManualScrolling, setIsManualScrolling] = useState(false);

  // Update local state when Redux data changes
  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
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

  useEffect(() => {
    // Don't set up observer if categories are not loaded
    if (!categories || categories.length === 0) return;

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
        setCategories((prevCategories) =>
          prevCategories.map((cat) => ({
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
      const categorySlug = category.label.toLowerCase().replace(/\s+/g, "-");
      const element = document.getElementById(categorySlug);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories]); // Removed initialCategories dependency

  const lastManualScrollPosition = useRef(0);
  const isUserScrolling = useRef(false);

  useEffect(() => {
    if (!menuRef.current) return;

    const handleScroll = () => {
      if (!isUserScrolling.current) {
        lastManualScrollPosition.current = menuRef.current.scrollLeft;
        setIsManualScrolling(true);
      }
    };

    const menuElement = menuRef.current;
    menuElement.addEventListener("scroll", handleScroll);

    return () => {
      menuElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Don't run if categories are not loaded
    if (!categories || categories.length === 0) return;

    const activeIndex = categories.findIndex((cat) => cat.active);
    if (activeIndex !== -1 && menuRef.current) {
      const menuList = menuRef.current;
      const activeItem = menuList.children[activeIndex];

      if (activeItem && !isManualScrolling) {
        const menuRect = menuList.getBoundingClientRect();
        const activeItemRect = activeItem.getBoundingClientRect();

        const isVisible =
          activeItemRect.left >= menuRect.left &&
          activeItemRect.right <= menuRect.right;

        if (!isVisible) {
          isUserScrolling.current = true;

          const scrollPosition =
            activeItem.offsetLeft -
            menuList.offsetWidth / 2 +
            activeItem.offsetWidth / 2;

          menuList.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });

          setTimeout(() => {
            isUserScrolling.current = false;
          }, 500);
        }
      }
    }
  }, [categories, isManualScrolling]); // Removed initialCategories dependency

  const handleClick = (index) => {
    // Don't handle click if categories are not loaded
    if (!categories || categories.length === 0) return;

    setIsManualScrolling(false);

    const updatedCategories = categories.map((cat, i) => ({
      ...cat,
      active: i === index,
    }));
    setCategories(updatedCategories);

    const categorySlug = categories[index].label
      .toLowerCase()
      .replace(/\s+/g, "-");

    const element = document.getElementById(categorySlug);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - menuHeight.current - 80;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="menu-container">
      {loading || !categories || categories.length === 0 ? (
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
                  handleClick(index); // Fixed: removed +1 which was causing wrong index
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
