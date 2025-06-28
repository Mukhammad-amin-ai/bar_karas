import { CategorySkeleton } from "../skeleton/CategorySkeleton";
import "./menu.scss";

export const MenuSceleton = () => {
  return (
    <div className="menu-container2">
      <div className="menu-list2">
        <CategorySkeleton />
        <CategorySkeleton />
        <CategorySkeleton />
      </div>
    </div>
  );
};
