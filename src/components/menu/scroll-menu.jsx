'use client';

import { useState, useEffect, useRef } from 'react';
import './menu.scss';

export const ScrollMenu = () => {
  const initialCategories = [
    { label: 'Первые блюда', active: true },
    { label: 'Супы', active: false },
    { label: 'Вок', active: false },
    { label: 'На рисе', active: false },
    { label: 'Суши', active: false },
  ];

  const [categories, setCategories] = useState(initialCategories);
  const menuRef = useRef(null);
  const menuHeight = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const updateMenuHeight = () => {
      if (menuRef.current) {
        menuHeight.current = menuRef.current.offsetHeight;
      }
    };

    updateMenuHeight();

    window.addEventListener('resize', updateMenuHeight);
    return () => window.removeEventListener('resize', updateMenuHeight);
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
              cat.label.toLowerCase().replace(/\s+/g, '-') ===
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
      const categorySlug = category.label.toLowerCase().replace(/\s+/g, '-');
      const element = document.getElementById(categorySlug);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories, menuHeight.current]);

  useEffect(() => {
    if (isDragging) return;

    const activeIndex = categories.findIndex((cat) => cat.active);
    if (activeIndex !== -1 && menuRef.current) {
      const menuList = menuRef.current;
      const activeItem = menuList.children[activeIndex];

      if (activeItem) {
        const menuRect = menuList.getBoundingClientRect();
        const activeItemRect = activeItem.getBoundingClientRect();

        const isVisible =
          activeItemRect.left >= menuRect.left &&
          activeItemRect.right <= menuRect.right;

        if (!isVisible) {
          const scrollPosition =
            activeItem.offsetLeft -
            menuList.offsetWidth / 2 +
            activeItem.offsetWidth / 2;

          menuList.scrollTo({
            left: scrollPosition,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [categories, isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - menuRef.current.offsetLeft);
    setScrollLeft(menuRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - menuRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    menuRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - menuRef.current.offsetLeft);
    setScrollLeft(menuRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - menuRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    menuRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleClick = (index, e) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }

    const updatedCategories = categories.map((cat, i) => ({
      ...cat,
      active: i === index,
    }));
    setCategories(updatedCategories);

    const categorySlug = categories[index].label
      .toLowerCase()
      .replace(/\s+/g, '-');

    const element = document.getElementById(categorySlug);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - menuHeight.current - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='menu-container'>
      <ul
        className={`menu-list ${isDragging ? 'dragging' : ''}`}
        ref={menuRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {categories.map((category, index) => (
          <li key={index} className='menu-item'>
            <a
              href={`#${category.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`menu-link ${category.active ? 'active' : ''}`}
              onClick={(e) => handleClick(index, e)}
            >
              {category.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
