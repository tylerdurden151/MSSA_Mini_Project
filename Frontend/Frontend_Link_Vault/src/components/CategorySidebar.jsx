import { useState } from "react";
import "./CategorySidebar.css";

function CategorySidebar({ categories, selected, onSelect, onCreate }) {
  // Local UI state: nothing outside the sidebar cares about these
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Hand the typed name up to App, then close the input either way
  function submit() {
    onCreate(newCategory);
    setNewCategoryOpen(false);
    setNewCategory("");
  }

  function cancel() {
    setNewCategoryOpen(false);
    setNewCategory("");
  }

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Categories</h2>

      {categories.map(([name, count]) => (
        <button
          key={name}
          className={name === selected ? "cat cat-active" : "cat"}
          onClick={() => onSelect(name)}
        >
          <span className="cat-name">{name}</span>
          <span className="cat-count">{count}</span>
        </button>
      ))}

      {newCategoryOpen ? (
        <input
          className="cat-input"
          autoFocus
          placeholder="Category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") cancel();
          }}
        />
      ) : (
        <button className="cat-new" onClick={() => setNewCategoryOpen(true)}>
          + New category
        </button>
      )}
    </aside>
  );
}

export default CategorySidebar;
