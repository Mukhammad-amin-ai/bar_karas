import { CategorySkeleton } from "../skeleton/CategorySkeleton";
import { useState, useEffect, useRef } from "react";
import "./menu.scss";

export const Menu = () => {
  const initialCategories = [
    { label: "Первые блюда", active: true },
    { label: "Супы", active: false },
    { label: "Вок", active: false },
    { label: "На рисе", active: false },
    { label: "Суши", active: false },
  ];

  const [categories, setCategories] = useState(initialCategories);
  const menuRef = useRef(null);
  const menuHeight = useRef(0);
  const [isManualScrolling, setIsManualScrolling] = useState(false);

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
  }, [categories, menuHeight.current]);

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
  }, [categories]);

  const handleClick = (index) => {
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
      const offsetPosition = elementPosition - menuHeight.current - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
  const [skeleton] = useState(true);

  return (
    <div className="menu-container">
      {skeleton ? (
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
