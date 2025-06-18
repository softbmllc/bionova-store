// src/pages/Shop.tsx
import React, { useState, useEffect, Suspense } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import ProductCard from "../components/ProductCard";
import { Product, LeagueData, Subcategory, Category as BaseCategory } from "../data/types";

type Category = BaseCategory & {
  subcategories: Subcategory[];
};
import { FiFilter } from "react-icons/fi";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
import { motion } from "framer-motion";
import CartIcon from "../components/CartIcon";
import { ArrowUp, Bolt } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Rocket } from "lucide-react";
import { fetchProducts, fetchLeagues, fetchSubcategories, fetchCategories } from "../firebaseUtils";
import ProductSkeleton from "../components/ProductSkeleton";
import SidebarFilter from "../components/SidebarFilter";
import Footer from "../components/Footer";

// Define un tipo para productos locales
type LocalProduct = Product & {
  active?: boolean;
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
};

export default function Shop() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<LocalProduct[]>([]); // Estado para almacenar productos
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const initialCategory = location.state?.category || "";
  const [selectedLeague, setSelectedLeague] = useState(initialCategory);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Estado de ordenamiento
  const [sortOption, setSortOption] = useState("");
  // --- Filtro por parámetro en la URL ---
  const searchParams = new URLSearchParams(location.search);
  const filterParamRaw = searchParams.get("filter");
  const filterParam = filterParamRaw ? filterParamRaw.toUpperCase() : "";
  
// Estado para almacenar las ligas dinámicas
const [dynamicLeagues, setDynamicLeagues] = useState<LeagueData[]>([]);
  const [noLeaguesAvailable, setNoLeaguesAvailable] = useState(false);

  // Estado para almacenar subcategorías
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  // Estado para almacenar categorías (nuevo)
  const [categories, setCategories] = useState<Category[]>([]);
  // Estado para almacenar equipos por subcategoría
  const [teamsBySubcategory, setTeamsBySubcategory] = useState<Record<string, any[]>>({});
  // Estado para categoría y subcategoría seleccionadas (nuevo)
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  // 🔥 Cargar productos de Firebase al montar
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        
        // Filtrar solo productos activos
        const footballProducts = fetchedProducts.filter((product: Product) => {
          return product.active !== false;
        });

        setProducts(footballProducts);
        setLoading(false);

        console.log(`[Shop] Productos de fútbol cargados: ${footballProducts.length}`);
      } catch (error) {
        console.error("[Shop] Error al cargar productos:", error);
        setProducts([]);
        setLoading(false);
      }
    };
  
    loadProducts();
  }, []);

  // 🔥 Cargar ligas desde Firebase (actualizado para escuchar filterParam)
  useEffect(() => {
    async function loadLeagues() {
      try {
        const leaguesFetched = await fetchLeagues();
        console.log("[Shop] Ligas traídas desde Firebase:", leaguesFetched);

        const allTeamsPromises: Promise<{ id: string; name: string; teams: string[] }>[] = leaguesFetched.map(async (league) => {
          const allSubcategories = await fetchSubcategories(league.id);
          // fetchTeams removed; placeholder
          const allTeamsPromises: Promise<any[]>[] = allSubcategories.map(() =>
            Promise.resolve([]) // Placeholder
          );
          const teamsFromAllSubs = await Promise.all(allTeamsPromises);
          const flatTeamNames: string[] = teamsFromAllSubs.flat().map((team) => (typeof team === "string" ? team : team.name || ""));
          return {
            id: league.id,
            name: league.name,
            teams: flatTeamNames,
          };
        });

        const processedLeagues = await Promise.all(allTeamsPromises);

        // Nuevo filtrado según filterParam
        const normalizedParam = filterParam.toLowerCase();
        setDynamicLeagues(processedLeagues);
        const filteredLeagues = processedLeagues.filter((league) => {
          const leagueName = (typeof league.name === "string"
            ? league.name
            : league.name[i18n.language as "en" | "es"] || ""
          ).trim().toLowerCase();
          if (normalizedParam === "nba") {
            return leagueName === "nba";
          }
          if (normalizedParam === "futbol") {
            return !["nba", "zapatos", "otros"].includes(leagueName);
          }
          return true;
        });

        console.log("[Shop] Ligas filtradas:", filteredLeagues);

        setDynamicLeagues(
          filteredLeagues.map((league) => ({
            id: league.id,
            name: league.name,
            teams: league.teams || [],
          }))
        );

        if (!selectedLeague && filteredLeagues.length > 0) {
          setSelectedLeague("");
        }

        setNoLeaguesAvailable(filteredLeagues.length === 0);
        setLoading(false);
      } catch (error) {
        console.error("[Shop] Error al cargar ligas:", error);
        setNoLeaguesAvailable(true);
        setLoading(false);
      }
    }

    loadLeagues();
  }, [filterParam]);

  // 🔥 Cargar categorías y subcategorías (nuevo useEffect)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Ensure each category has 'subcategories' property (even if empty)
        const rawCategories: any[] = await fetchCategories();
        const categoriesWithSubs = rawCategories.map((cat) => ({
          ...cat,
          subcategories: cat.subcategories || [],
        }));
        setCategories(categoriesWithSubs);
        const allSubs = categoriesWithSubs.flatMap(cat => cat.subcategories);
        setSubcategories(allSubs);
      } catch (error) {
        console.error("[Shop] Error al cargar categorías y subcategorías:", error);
        setCategories([]);
      }
    };
    loadData();
  }, []);
  // Handlers para sidebar de categorías (nuevo)
  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === '') {
      setSelectedCategory('');
      setSelectedSubcategory('');
      return;
    }
    const category = categories.find((cat) => cat.name === categoryName);
    if (category) {
      setSelectedCategory(category.id);
      setSelectedSubcategory('');
    }
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    if (subcategoryName === '') {
      setSelectedSubcategory('');
      return;
    }
    for (const category of categories) {
      const sub = category.subcategories?.find((s: any) => s.name === subcategoryName);
      if (sub) {
        setSelectedCategory(category.id);
        setSelectedSubcategory(sub.id);
        break;
      }
    }
  };

  useEffect(() => {
    const isStock = searchParams.get("stock") === "true";
    const alreadyScrolled = sessionStorage.getItem("stockScrollDone");

    if (isStock) {
      setSelectedLeague("STOCK_EXPRESS");
      setSelectedTeam("");
      setSearchTerm("");

      if (!alreadyScrolled) {
        setTimeout(() => {
          const section = document.getElementById("stock-express");
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            sessionStorage.setItem("stockScrollDone", "true");
          }
        }, 300);
      }
    } else if (location.state?.category) {
      setSelectedLeague(location.state.category);
      setSelectedTeam("");
      setSearchTerm("");

      if (window.history.replaceState) {
        window.history.replaceState(
          { ...window.history.state, usr: undefined, state: undefined },
          document.title,
          window.location.pathname + window.location.search
        );
      }
    } else {
      sessionStorage.removeItem("stockScrollDone");
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setSelectedLeague("");
      setSelectedTeam("");
    }
  }, [searchTerm]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLeagueClick = (league: string) => {
    setSelectedLeague(league);
    setSelectedTeam("");
    setSearchTerm("");
    setIsFilterOpen(false);
  };

  const handleTeamClick = (team: string) => {
    // Buscar en las ligas dinámicas
    const teamLeague = dynamicLeagues.find((league) =>
      league.teams.includes(team)
    )?.name;

    if (teamLeague) {
      setSelectedLeague(teamLeague);
    }

    setSelectedTeam(team);
    setSearchTerm("");
    setIsFilterOpen(false);
  };

  // Nuevo filtrado de productos usando useMemo, con lógica de subcategoría (versión robusta) y ordenamiento
  const { i18n } = useTranslation();
  const filteredProducts = useMemo(() => {
    // Nuevo bloque de filtrado corregido:
    const filtered = products.filter((product) => {
      const categoryMatch = selectedCategory ? product.category?.id === selectedCategory : true;
      const subcategoryMatch = selectedSubcategory ? product.subcategory?.id === selectedSubcategory : true;
      const searchMatch = searchTerm
        ? product.title?.[i18n.language as "en" | "es"]?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return categoryMatch && subcategoryMatch && searchMatch;
    });

    // --- DEBUG: Mostrar por consola los valores del filtro y productos resultantes ---
    console.log("Selected category:", selectedCategory);
    console.log("Selected subcategory:", selectedSubcategory);
    filtered.forEach(p => {
      console.log(
        "🧪",
        p.title?.[i18n.language as "en" | "es"],
        "| category.id:", p.category?.id,
        "| subcategory.id:", p.subcategory?.id
      );
    });
    // ---------------------------------------------------------

    // Ordenamiento (si se desea conservar)
    switch (sortOption) {
      case "priceAsc":
        return filtered.sort((a, b) => (a.priceUSD || 0) - (b.priceUSD || 0));
      case "priceDesc":
        return filtered.sort((a, b) => (b.priceUSD || 0) - (a.priceUSD || 0));
      case "az":
        return filtered.sort((a, b) =>
          (a.title?.[i18n.language as "en" | "es"] || "").localeCompare(
            b.title?.[i18n.language as "en" | "es"] || ""
          )
        );
      case "za":
        return filtered.sort((a, b) =>
          (b.title?.[i18n.language as "en" | "es"] || "").localeCompare(
            a.title?.[i18n.language as "en" | "es"] || ""
          )
        );
      default:
        return filtered;
    }
  }, [products, selectedCategory, selectedSubcategory, searchTerm, sortOption, i18n.language]);

  const isStockExpress = selectedLeague === "STOCK_EXPRESS";
  const productsToDisplay = filteredProducts.filter((p) => {
    if (filterParam === "NBA") return p.category?.name === "NBA";
    if (filterParam === "FUTBOL") return p.category?.name !== "NBA";
    return true; // sin filtro, mostrar todo
  });
  
  // Adaptamos esto para usar dynamicLeagues en lugar de leagues
  const currentLeague = dynamicLeagues.find((l) => l.name === selectedLeague);

  // Obtener subcategorías para la liga seleccionada
  const currentLeagueSubcategories = subcategories.filter(
    sub => currentLeague && sub.categoryId === currentLeague.id
  );

  console.log("[Shop] Productos a mostrar:", productsToDisplay);

  function getLeagueId(name: string): string {
    return dynamicLeagues.find((l) => l.name === name)?.id || "";
  }
  
  // Banner dinámico según filtro (normalizando a mayúsculas)
  const normalizedFilter = filterParam.toUpperCase();
  const bannerImage = {
    NBA: "/images/banner-nba.jpg",
    FUTBOL: "/images/futbol-banner.jpg",
    TODO: "/images/banner-general.jpg",
  }[normalizedFilter] || "/images/banner-general.jpg";
  
  if (loading) {
    return (
      <section className="bg-[#f9f9f9] text-black min-h-screen flex flex-col">
        <div className="relative w-full h-64 sm:h-96 overflow-hidden">
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mt-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
        {/* Footer intentionally removed from loading state to prevent duplication */}
      </section>
    );
  }

  return (
    <section className="bg-[#f9f9f9] text-black flex flex-col min-h-screen">
      <Helmet>
  <title>Tienda Online | Looma</title>
  <meta
    name="description"
    content="Descubrí productos innovadores de tecnología, fitness y estilo de vida. Envíos rápidos desde USA. Compra con confianza en Looma."
  />
  <meta
    name="keywords"
    content="productos, tecnología, fitness, dropshipping, Looma, gadgets, tienda online"
  />
  <link rel="canonical" href="https://looma.store/shop" />
</Helmet>

  
  
      <div className="relative">
        <div className="absolute top-4 right-4 z-20">
          <CartIcon />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex justify-between sm:hidden mt-4 mb-2 gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <FiFilter className="text-lg" />
            {t("shop.filters", "Filtros")}
          </button>
        </div>
      </div>
  
      <div className="w-full flex justify-between items-start px-6 pt-6 z-50 relative max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-full px-4 py-2 hover:bg-black hover:text-white transition-shadow shadow-sm hover:shadow-md w-fit"
        >
          ← {t("shop.backToHome", "Volver al inicio")}
        </Link>
      </div>
      <div className="md:grid md:grid-cols-[250px_1fr] max-w-7xl mx-auto p-6 gap-8">
        {/* Sidebar */}
        <motion.aside
          className="hidden md:block space-y-6 pr-6 border-r border-gray-200"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <label className="block font-semibold text-sm mb-2" htmlFor="search">
              {t("shop.searchLabel", "Buscar por nombre")}
            </label>
            <input
              id="search"
              type="text"
              placeholder={t("shop.searchPlaceholder", "Ej: magnesio")}
              className="w-full border px-3 py-2 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>


          {/* SidebarFilter con props para filtro de categoría y subcategoría */}
          <SidebarFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
          />

          {/* Para móviles: sidebar en modal */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                onClick={() => setIsFilterOpen(false)}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="absolute top-0 left-0 bottom-0 w-[280px] bg-white p-6 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{t("shop.filters", "Filtros")}</h2>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-1 rounded-full hover:bg-gray-100 transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block font-semibold text-sm mb-2">
                        {t("shop.searchLabel", "Buscar por nombre")}
                      </label>
                    <input
                      type="text"
                      placeholder={t("shop.searchPlaceholder", "Ej: magnesio")}
                      className="w-full border px-3 py-2 rounded-lg text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>

                    <div>
                      <Link
                        to="/productos"
                        className={`w-full text-left px-3 py-2 rounded-lg transition ring-1 ring-transparent text-[15px] font-semibold ${
                          !filterParam
                            ? "bg-black text-white ring-black"
                            : "hover:bg-gray-100 text-gray-800"
                        }`}
                      >
                        {t("shop.viewAll", "Ver todo")}
                      </Link>
                    </div>
                    
                    
                    {/* Ligas móvil */}
                    <div>
                      <ul className="space-y-1 text-sm">
                        {dynamicLeagues
                          .filter((league) => league.name !== "STOCK_EXPRESS")
                          .map((league) => (
                            <li key={league.id}>
                              <button
                                onClick={() => {
                                  handleLeagueClick(league.name);
                                  setIsFilterOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg transition ring-1 ring-transparent ${
                                  selectedLeague === league.name
                                    ? "bg-black text-white ring-black"
                                    : "hover:bg-gray-100 text-gray-800"
                                }`}
                              >
                                {league.name}
                              </button>
                              <ul className="space-y-1 ml-2">
                                {subcategories
                                  .filter((sub): sub is Subcategory =>
                                    'categoryId' in sub &&
                                    typeof sub.categoryId === 'string' &&
                                    sub.categoryId === league.id
                                  )
                                  .map((sub) => (
                                    <li key={sub.id}>
                                      <button
                                        onClick={() => {
                                          setSelectedLeague(league.name);
                                          setSelectedTeam("");
                                          setSearchTerm(sub.name);
                                          setIsFilterOpen(false);
                                        }}
                                        className="text-sm text-gray-800 hover:bg-gray-100 px-2 py-1 rounded transition"
                                      >
                                        {sub.name}
                                      </button>
                                    </li>
                                  ))}
                              </ul>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>

        {/* Contenido principal - Productos */}
        <main className="mt-8 md:mt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {searchTerm
                ? t("shop.resultsFor", { search: searchTerm, defaultValue: 'Resultados para "{{search}}"', searchTerm })
                : isStockExpress
                ? t("shop.stockExpress", "Stock Express")
                : selectedLeague && selectedTeam
                ? `${selectedLeague} - ${selectedTeam}`
                : selectedLeague
                ? selectedLeague
                : filterParam === "NBA"
                ? t("shop.nba", "NBA")
                : filterParam === "FUTBOL"
                ? t("shop.soccer", "Fútbol")
                : t("shop.allProducts", "Productos disponibles")}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {t("shop.productsFound", { count: productsToDisplay.length, defaultValue: "{{count}} productos encontrados" })}
            </p>
            {(searchTerm || selectedLeague || selectedTeam) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLeague("");
                  setSelectedTeam("");
                  setSelectedCategory("");
                  setSelectedSubcategory("");
                  navigate(".", { replace: true });
                }}
                className="mt-2 text-sm font-semibold text-gray-700 hover:text-black underline"
              >
                {t('shop.clearFilters')}
              </button>
            )}
          </div>

          {/* Stock Express Banner */}
          {isStockExpress && (
            <section id="stock-express" className="mt-4 mb-8">
              <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl p-6 text-white flex items-center">
                <div className="mr-6">
                  <Rocket className="h-10 w-10 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1 flex items-center">
                    {t("shop.stockExpress", "Stock Express")}{" "}
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                      {t("shop.immediateShipping", "¡Envío inmediato!")}
                    </span>
                  </h2>
                  <p className="text-gray-300 max-w-lg">
                    {t(
                      "shop.stockExpressDescription",
                      "Estos productos están disponibles para envío inmediato. El envío se realiza dentro de las 24 horas hábiles siguientes a la confirmación de pago."
                    )}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Dropdown de ordenamiento */}
          <div className="flex justify-end items-center mt-4">
            <Listbox value={sortOption} onChange={setSortOption}>
              {({ open }) => (
                <div className="relative w-52">
                  <Listbox.Button className="w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm flex justify-between items-center">
                    <span>
                      {{
                        "": t("shop.sortBy", "Ordenar por"),
                        priceAsc: t("shop.sortPriceAsc", "Precio: menor a mayor"),
                        priceDesc: t("shop.sortPriceDesc", "Precio: mayor a menor"),
                        az: t("shop.sortNameAZ", "Nombre: A a Z"),
                        za: t("shop.sortNameZA", "Nombre: Z a A"),
                      }[sortOption] || t("shop.sortBy", "Ordenar por")}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 text-sm">
                    {[
                      { value: "", label: t("shop.sortBy", "Ordenar por") },
                      { value: "priceAsc", label: t("shop.sortPriceAsc", "Precio: menor a mayor") },
                      { value: "priceDesc", label: t("shop.sortPriceDesc", "Precio: mayor a menor") },
                      { value: "az", label: t("shop.sortNameAZ", "Nombre: A a Z") },
                      { value: "za", label: t("shop.sortNameZA", "Nombre: Z a A") },
                    ].map((option) => (
                      <Listbox.Option
                        key={option.value}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                            active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                          }`
                        }
                        value={option.value}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                              {option.label}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              )}
            </Listbox>
          </div>
          {/* Grid de productos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mt-6">
            <Suspense
              fallback={Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-16 min-h-[300px] text-center space-y-4">
                  <p className="text-gray-500 font-medium max-w-xl mx-auto text-center">
                    <Trans
                      i18nKey="shop.noResultsClickable"
                      components={{
                        showAll: (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setSelectedLeague('');
                              setSelectedTeam('');
                              setSelectedCategory('');
                              setSelectedSubcategory('');
                              navigate('.', { replace: true });
                            }}
                            className="text-blue-600 hover:underline font-semibold"
                          />
                        ),
                      }}
                    />
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        </main>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition"
          aria-label={t("shop.scrollToTop", "Volver arriba")}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Footer removed: now included via LayoutRoutes */}
    </section>
  );
}

// NOTE: If you see in this file:
// {showPersonalization && (
//   <>
//     {/* name and number fields */}
//   </>
// )}
// Replace with:
// {product.customizable !== false && (
//   <>
//     {/* name and number fields */}
//   </>
// )} 