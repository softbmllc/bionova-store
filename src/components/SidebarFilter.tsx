// src/components/SidebarFilter.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchCategories } from "../firebaseUtils";

interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface SidebarFilterProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedSubcategory: string;
  setSelectedSubcategory: React.Dispatch<React.SetStateAction<string>>;
}

export default function SidebarFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
}: SidebarFilterProps) {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const language = i18n.language || "es";

  if (!categories || categories.length === 0) {
    return (
      <aside className="mb-10 md:mb-0 md:mr-8">
        <div className="sticky top-24">
          <h3 className="text-lg font-bold mb-4">{t("shop.filterBy")}</h3>
          <p className="text-sm text-gray-500">No hay categorías disponibles.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="mb-10 md:mb-0 md:mr-8">
      <div className="sticky top-24">
        <h3 className="text-lg font-bold mb-4">{t("shop.filterBy")}</h3>
        <ul className="space-y-2 text-sm">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedSubcategory('');
                }}
                className={`block w-full text-left px-2 py-1 rounded transition ${
                  selectedCategory === category.id
                    ? 'bg-white text-gray-900 font-medium border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none transition-all relative before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue-500'
                    : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {typeof category.name === 'object' ? category.name[language] : category.name || ''}
              </button>
              {Array.isArray(category.subcategories) &&
                category.subcategories.length > 0 && (
                  <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-600">
                    {category.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => {
                            setSelectedSubcategory(sub.id);
                            setSelectedCategory('');
                          }}
                          className={`block w-full text-left px-2 py-0.5 rounded text-sm transition ${
                            selectedSubcategory === sub.id
                              ? 'bg-white text-gray-900 font-medium border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none transition-all relative before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue-500'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                          }`}
                        >
                          {sub.name && typeof sub.name === "object"
                            ? sub.name[language] || sub.name["es"] || ""
                            : sub.name || ""}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>

        {/* Botones de control */}
        <div className="mt-6 space-y-2">
          <button
            onClick={() => {
              setSelectedCategory('');
              setSelectedSubcategory('');
            }}
            className="w-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition"
          >
            {t("shop.clearFilters")}
          </button>
          <button
            onClick={() => {
              setSelectedCategory('');
              setSelectedSubcategory('');
            }}
            className="w-full text-sm bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded transition"
          >
            {t("shop.showAll")}
          </button>
        </div>
      </div>
    </aside>
  );
}