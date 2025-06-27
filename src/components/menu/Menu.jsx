// import { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { CategorySkeleton } from "../skeleton/CategorySkeleton";
// import "./menu.scss";

// export const Menu = () => {
//   const initialCategories = useSelector((state) => state.menu.categoryList);
//   const loading = useSelector((state) => state.menu.loading);

//   const [categories, setCategories] = useState([]);
//   const [activeSlug, setActiveSlug] = useState(null);

//   const menuRef = useRef(null);
//   const menuHeight = useRef(0);
//   const itemRefs = useRef([]);

//   useEffect(() => {
//     if (initialCategories?.length) {
//       setCategories(initialCategories);
//     }
//   }, [initialCategories]);

//   useEffect(() => {
//     const updateMenuHeight = () => {
//       if (menuRef.current) {
//         menuHeight.current = menuRef.current.offsetHeight;
//       }
//     };

//     updateMenuHeight();
//     window.addEventListener("resize", updateMenuHeight);
//     return () => window.removeEventListener("resize", updateMenuHeight);
//   }, []);

//   useEffect(() => {
//     if (!categories?.length) return;

//     const observerOptions = {
//       root: null,
//       rootMargin: `-${menuHeight.current + 20}px 0px 0px 0px`,
//       threshold: 0.1,
//     };

//     const observerCallback = (entries) => {
//       let maxVisibility = 0;
//       let mostVisibleSection = null;

//       entries.forEach((entry) => {
//         if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
//           maxVisibility = entry.intersectionRatio;
//           mostVisibleSection = entry.target.id;
//         }
//       });

//       if (mostVisibleSection && mostVisibleSection !== activeSlug) {
//         setActiveSlug(mostVisibleSection);

//         const activeIndex = categories.findIndex(
//           (cat) =>
//             cat.label.toLowerCase().replace(/\s+/g, "-") === mostVisibleSection
//         );

//         const activeEl = itemRefs.current[activeIndex];
//         const menuEl = menuRef.current;

//         if (activeEl && menuEl) {
//           const menuRect = menuEl.getBoundingClientRect();
//           const activeRect = activeEl.getBoundingClientRect();

//           if (activeRect.right > menuRect.right) {
//             menuEl.scrollBy({
//               left: activeRect.right - menuRect.right + 10,
//               behavior: "smooth",
//             });
//           } else if (activeRect.left < menuRect.left) {
//             menuEl.scrollBy({
//               left: activeRect.left - menuRect.left - 10,
//               behavior: "smooth",
//             });
//           }
//         }
//       }
//     };

//     const observer = new IntersectionObserver(
//       observerCallback,
//       observerOptions
//     );

//     categories.forEach((category) => {
//       const slug = category.label.toLowerCase().replace(/\s+/g, "-");
//       const element = document.getElementById(slug);
//       if (element) observer.observe(element);
//     });

//     return () => observer.disconnect();
//   }, [categories, activeSlug]);

//   const handleClick = (index) => {
//     if (!categories.length) return;

//     const slug = categories[index].label.toLowerCase().replace(/\s+/g, "-");
//     setActiveSlug(slug);

//     const element = document.getElementById(slug);
//     if (element) {
//       const top = element.getBoundingClientRect().top + window.scrollY;
//       const offset = top - menuHeight.current - 80;
//       window.scrollTo({ top: offset, behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="menu-container">
//       {loading || !categories.length ? (
//         <div className="menu-list">
//           <CategorySkeleton />
//           <CategorySkeleton />
//           <CategorySkeleton />
//         </div>
//       ) : (
//         <ul className="menu-list" ref={menuRef}>
//           {categories.map((category, index) => {
//             const slug = category.label.toLowerCase().replace(/\s+/g, "-");
//             const isActive = slug === activeSlug;

//             return (
//               <li
//                 key={index}
//                 className="menu-item"
//                 ref={(el) => (itemRefs.current[index] = el)}
//               >
//                 <a
//                   href={`#${slug}`}
//                   className={`menu-link ${isActive ? "active" : ""}`}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleClick(index);
//                   }}
//                 >
//                   {category.label}
//                 </a>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// };

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { CategorySkeleton } from "../skeleton/CategorySkeleton";
import "./menu.scss";

export const Menu = () => {
  const initialCategories = useSelector((state) => state.menu.categoryList);
  const loading = useSelector((state) => state.menu.loading);

  const [categories, setCategories] = useState([]);
  const [activeSlug, setActiveSlug] = useState(null);

  const menuRef = useRef(null);
  const menuHeight = useRef(0);
  const itemRefs = useRef([]);

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

      if (window.scrollY <= 0) {
        const firstSlug = categories[0]?.label
          .toLowerCase()
          .replace(/\s+/g, "-");
        if (firstSlug && firstSlug !== activeSlug) {
          setActiveSlug(firstSlug);
        }
      } else if (mostVisibleSection && mostVisibleSection !== activeSlug) {
        setActiveSlug(mostVisibleSection);

        const activeIndex = categories.findIndex(
          (cat) =>
            cat.label.toLowerCase().replace(/\s+/g, "-") === mostVisibleSection
        );

        const activeEl = itemRefs.current[activeIndex];
        const menuEl = menuRef.current;

        if (activeEl && menuEl) {
          const menuRect = menuEl.getBoundingClientRect();
          const activeRect = activeEl.getBoundingClientRect();

          if (activeRect.right > menuRect.right) {
            menuEl.scrollBy({
              left: activeRect.right - menuRect.right + 10,
              behavior: "smooth",
            });
          } else if (activeRect.left < menuRect.left) {
            menuEl.scrollBy({
              left: activeRect.left - menuRect.left - 10,
              behavior: "smooth",
            });
          }
        }
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
  }, [categories, activeSlug]);

  const handleClick = (index) => {
    if (!categories.length) return;

    const slug = categories[index].label.toLowerCase().replace(/\s+/g, "-");
    setActiveSlug(slug);

    const element = document.getElementById(slug);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY;
      const offset = top - menuHeight.current - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0 && categories.length) {
        const firstSlug = categories[0]?.label
          .toLowerCase()
          .replace(/\s+/g, "-");
        if (firstSlug !== activeSlug) {
          setActiveSlug(firstSlug);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, activeSlug]);

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
          {categories.map((category, index) => {
            const slug = category.label.toLowerCase().replace(/\s+/g, "-");
            const isActive = slug === activeSlug;

            return (
              <li
                key={index}
                className="menu-item"
                ref={(el) => (itemRefs.current[index] = el)}
              >
                <a
                  href={`#${slug}`}
                  className={`menu-link ${isActive ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(index);
                  }}
                >
                  {category.label}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
