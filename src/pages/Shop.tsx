// src/pages/Shop.tsx
import React, { useState, useEffect, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import ProductCard from "../components/ProductCard";
import { Product, LeagueData, Subcategory, Team } from "../data/types";
import { FiFilter } from "react-icons/fi";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
import { motion } from "framer-motion";
import CartIcon from "../components/CartIcon";
import { ArrowUp, Bolt } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import { Rocket } from "lucide-react";
import StockExpressButton from "../components/StockExpressButton";
import { fetchProducts, fetchLeagues, fetchSubcategories, fetchTeams } from "../firebaseUtils";
import ProductSkeleton from "../components/ProductSkeleton";

// Define un tipo para productos locales
type LocalProduct = Product & {
  active?: boolean;
};

export default function Shop() {
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
  // --- Filtro por parámetro en la URL ---
  const searchParams = new URLSearchParams(location.search);
  const filterParamRaw = searchParams.get("filter");
  const filterParam = filterParamRaw ? filterParamRaw.toUpperCase() : "";
  
  // Estado para almacenar las ligas dinámicas
  const [dynamicLeagues, setDynamicLeagues] = useState<LeagueData[]>([]);
  const [noLeaguesAvailable, setNoLeaguesAvailable] = useState(false);

  // Estado para almacenar subcategorías
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  
  // Estado para almacenar equipos por subcategoría
  const [teamsBySubcategory, setTeamsBySubcategory] = useState<Record<string, Team[]>>({});

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

        const allTeamsPromises = leaguesFetched.map(async (league) => {
          const allSubcategories = await fetchSubcategories(league.id);
          const allTeamsPromises = allSubcategories.map((sub) =>
            fetchTeams(league.id, sub.id)
          );
          const teamsFromAllSubs = await Promise.all(allTeamsPromises);
          const flatTeamNames = teamsFromAllSubs.flat().map((team) => team.name);

          return {
            id: league.id,
            name: league.name,
            teams: flatTeamNames,
          };
        });

        const processedLeagues = await Promise.all(allTeamsPromises);

        // Nuevo filtrado según filterParam
        const normalizedParam = filterParam.toLowerCase();
        const filteredLeagues = processedLeagues.filter((league) => {
          const leagueName = league.name.trim().toLowerCase();
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

  // 🔥 Cargar subcategorías cuando se tienen las ligas
  useEffect(() => {
    const loadSubcategories = async () => {
      if (dynamicLeagues.length === 0) return;
      
      try {
        const subcategoriesPromises = dynamicLeagues.map(league => 
          fetchSubcategories(league.id)
        );
        
        const allSubcategoriesResult = await Promise.all(subcategoriesPromises);
        const allSubcategories = allSubcategoriesResult
          .flat()
          .filter((sub) => {
            const league = dynamicLeagues.find((l) => l.id === sub.categoryId);
            if (!league) return false;
            const leagueName = league.name.toLowerCase();
            if (filterParam.toUpperCase() === "NBA") return leagueName === "nba";
            if (filterParam.toUpperCase() === "FUTBOL") return leagueName !== "nba";
            return true;
          });
        
        setSubcategories(allSubcategories);
        console.log("[Shop] Subcategorías cargadas:", allSubcategories);
        
        // Ahora que tenemos las subcategorías, cargamos los equipos para cada una
        const teamsPromises: Promise<void>[] = [];
        
        for (const league of dynamicLeagues) {
          for (const subcategory of allSubcategories.filter(sub => sub.categoryId === league.id)) {
            teamsPromises.push(
              (async () => {
                try {
                  const teams = await fetchTeams(league.id, subcategory.id);
                  setTeamsBySubcategory(prev => ({
                    ...prev,
                    [subcategory.id]: teams
                  }));
                } catch (error) {
                  console.error(`[Shop] Error al cargar equipos para la subcategoría ${subcategory.id}:`, error);
                }
              })()
            );
          }
        }
        
        await Promise.all(teamsPromises);
        console.log("[Shop] Equipos cargados por subcategoría:", teamsBySubcategory);
      } catch (error) {
        console.error("[Shop] Error al cargar subcategorías:", error);
      }
    };

    loadSubcategories();
  }, [dynamicLeagues]);

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

  const getFilteredProducts = (): Product[] => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch !== "") {
      return products.filter((product) => {
        // Buscar por título (no name)
        const titleMatch = (product.title || "").toLowerCase().includes(normalizedSearch);
        // Buscar por subcategoría, si existe
        const subCategoryMatch =
          product.subCategory && product.subCategory.name
            ? product.subCategory.name.toLowerCase().includes(normalizedSearch)
            : false;
        // Buscar por categoría
        const categoryMatch =
          product.category && product.category.name
            ? product.category.name.toLowerCase().includes(normalizedSearch)
            : false;
        return titleMatch || subCategoryMatch || categoryMatch;
      });
    }

    if (selectedLeague === "STOCK_EXPRESS") {
      // Filtrar productos que tienen stock
      const productsWithStock = products.filter((product) => {
        if (product.stock) {
          return Object.values(product.stock).some(quantity => (quantity as number) > 0);
        }
        return false;
      });
      return productsWithStock.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return products.filter((product) => {
      // Filtrar por categoría
      const leagueMatches = selectedLeague
        ? (
            product.category?.name === selectedLeague ||
            product.category?.name?.toLowerCase() === selectedLeague.toLowerCase()
          )
        : true;
      // Filtrar por subcategoría si hay searchTerm igual a alguna subcategoría
      const subCategoryMatches =
        searchTerm && product.subCategory && product.subCategory.name
          ? product.subCategory.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
          : true;
      return leagueMatches && subCategoryMatches;
    });
  };

  const isStockExpress = selectedLeague === "STOCK_EXPRESS";
  const productsToDisplay = getFilteredProducts().filter((p) => {
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
      <section className="bg-[#f9f9f9] text-black min-h-screen">
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
      </section>
    );
  }

  return (
    <section className="bg-[#f9f9f9] text-black min-h-screen">
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

      <div className="relative w-full h-64 sm:h-96 overflow-hidden">
        <img
          src={bannerImage}
          alt="Banner principal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
  

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="mt-4">
          <Link
            to="/"
            className="text-black font-semibold hover:underline text-sm inline-flex items-center gap-1 transition"
          >
            ← Volver al inicio
          </Link>
        </div>
        <div className="absolute right-2 top-0 translate-y-20 sm:translate-y-9 sm:right-0 z-50">
          <CartIcon variant="hero" />
        </div>

        <div className="flex justify-between sm:hidden mt-4 mb-2 gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <FiFilter className="text-lg" />
            Filtros
          </button>
        </div>
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
              Buscar por nombre
            </label>
            <input
              id="search"
              type="text"
              placeholder="Ej: Real Madrid"
              className="w-full border px-3 py-2 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
  
          {/* Ver todo eliminado */}
  
          {/* Botón Stock Express */}
          <div className="mb-4">
            <StockExpressButton
              isSelected={selectedLeague === "STOCK_EXPRESS"}
              onClick={() => handleLeagueClick("STOCK_EXPRESS")}
            />
          </div>

          {/* Filtrar por deporte */}
          <div className="mb-6">
            <h2 className="text-[15px] font-semibold uppercase tracking-wide text-gray-600 mb-1">Filtrar por deporte</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate("?filter=FUTBOL")}
                className={`w-full text-left px-3 py-2 rounded-lg transition ring-1 ring-transparent text-[15px] uppercase tracking-wide font-semibold flex items-center ${
                  filterParam === "FUTBOL"
                    ? "bg-black text-white ring-black"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <FaFutbol className="mr-2" />
                Fútbol
              </button>
              <button
                onClick={() => navigate("?filter=NBA")}
                className={`w-full text-left px-3 py-2 rounded-lg transition ring-1 ring-transparent text-[15px] uppercase tracking-wide font-semibold flex items-center ${
                  filterParam === "NBA"
                    ? "bg-black text-white ring-black"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <FaBasketballBall className="mr-2" />
                NBA
              </button>
            </div>
          </div>

          {/* Sidebar: Ligas y subcategorías */}
          <h2 className="text-[15px] font-semibold uppercase tracking-wide text-gray-600 mb-1">Categorías</h2>
          <div className="space-y-6">
            {dynamicLeagues
              .filter((league) => league.name !== "STOCK_EXPRESS")
              .map((league) => (
                <div key={league.id}>
                  <button
                    onClick={() => handleLeagueClick(league.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ring-1 ring-transparent text-[15px] font-semibold ${
                      selectedLeague === league.name
                        ? "bg-black text-white ring-black"
                        : "hover:bg-gray-100 text-gray-800"
                    } mb-1`}
                  >
                    {league.name}
                  </button>
                  <ul className="space-y-1 ml-2">
                    {subcategories
                      .filter((sub) => sub.categoryId === league.id)
                      .map((sub) => (
                        <li key={sub.id}>
                          <button
                            onClick={() => {
                              setSelectedLeague(league.name);
                              setSelectedTeam("");
                              setSearchTerm(sub.name);
                            }}
                            className="text-sm text-gray-800 hover:bg-gray-100 px-2 py-1 rounded transition"
                          >
                            {sub.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>

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
                    <h2 className="text-xl font-bold">Filtros</h2>
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
                        Buscar por nombre
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Real Madrid"
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
                        Ver todo
                      </Link>
                    </div>
                    
                    {/* StockExpress móvil */}
                    <div>
                      <StockExpressButton 
                        isSelected={selectedLeague === "STOCK_EXPRESS"}
                        onClick={() => {
                          handleLeagueClick("STOCK_EXPRESS");
                          setIsFilterOpen(false);
                        }}
                      />
                    </div>

                    {/* Filtrar por deporte móvil */}
                    <div className="mb-6">
                      <h2 className="text-[15px] font-semibold uppercase tracking-wide text-gray-600 mb-1">Filtrar por deporte</h2>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            navigate("?filter=FUTBOL");
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition ring-1 ring-transparent text-[15px] uppercase tracking-wide font-semibold flex items-center ${
                            filterParam === "FUTBOL"
                              ? "bg-black text-white ring-black"
                              : "hover:bg-gray-100 text-gray-800"
                          }`}
                        >
                          <FaFutbol className="mr-2" />
                          Fútbol
                        </button>
                        <button
                          onClick={() => {
                            navigate("?filter=NBA");
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition ring-1 ring-transparent text-[15px] uppercase tracking-wide font-semibold flex items-center ${
                            filterParam === "NBA"
                              ? "bg-black text-white ring-black"
                              : "hover:bg-gray-100 text-gray-800"
                          }`}
                        >
                          <FaBasketballBall className="mr-2" />
                          NBA
                        </button>
                      </div>
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
                ? `Resultados para "${searchTerm}"`
                : isStockExpress
                ? "Stock Express"
                : selectedLeague && selectedTeam
                ? `${selectedLeague} - ${selectedTeam}`
                : selectedLeague
                ? selectedLeague
                : filterParam === "NBA"
                ? "NBA"
                : filterParam === "FUTBOL"
                ? "Fútbol"
                : "Todos los productos Looma"}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {productsToDisplay.length} productos encontrados
            </p>
            {(searchTerm || selectedLeague || selectedTeam) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLeague("");
                  setSelectedTeam("");
                  navigate(".", { replace: true });
                }}
                className="mt-2 text-sm font-semibold text-gray-700 hover:text-black underline"
              >
                Limpiar filtros
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
                    Stock Express{" "}
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                      ¡Envío inmediato!
                    </span>
                  </h2>
                  <p className="text-gray-300 max-w-lg">
                    Estos productos están disponibles para envío inmediato. El
                    envío se realiza dentro de las 24 horas hábiles siguientes a
                    la confirmación de pago.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Grid de productos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mt-6">
            <Suspense
              fallback={Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            >
              {productsToDisplay.length > 0 ? (
                productsToDisplay.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-500 font-medium">
                    No se encontraron productos para esta selección. Prueba otros filtros o vuelve a{" "}
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedLeague("");
                        setSelectedTeam("");
                      }}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Ver todos
                    </button>.
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
          aria-label="Volver arriba"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      <Footer />
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