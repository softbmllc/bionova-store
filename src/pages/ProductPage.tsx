//src/pages/ProductPage.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import CartIcon from "../components/CartIcon";
import { fetchProductById, fetchProducts } from "../firebaseUtils";
import { useCart } from "../context/CartContext";
import { Check, ChevronLeft, ArrowUp, Shirt, Sparkles, Calendar, ScissorsLineDashed, Package } from "lucide-react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { defaultDescriptions } from "../data/defaultDescriptions";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import RelatedProducts from "../components/RelatedProducts";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [customName, setCustomName] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  // Custom alert/confirm states
  const [showAlert, setShowAlert] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const { addToCart, items } = useCart();

  // keen-slider logic
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(s) {
      setSelectedImage(s.track.details.rel);
    },
  });

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setProduct(null);
        setLoading(false);
        return;
      }
      try {
        const fetched = await fetchProductById(id);
        if (fetched && fetched.title) {
          setProduct({
            ...fetched,
            sizes: fetched.sizes || ["S", "M", "L", "XL"],
            stock: fetched.stock || {},
            defaultDescriptionType: fetched.defaultDescriptionType || "none",
            customizable: fetched.allowCustomization ?? false,
          });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("[ProductPage] Error cargando producto:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  useEffect(() => {
    async function loadRelated() {
      if (!product || !product.category?.name) return;
      try {
        const all = await fetchProducts();
        const filtered = all.filter((p: any) =>
          p.category?.name === product.category.name && p.slug !== product.slug
        ).slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Error cargando relacionados", err);
      }
    }
    loadRelated();
  }, [product]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (loading) return <div className="p-10">Cargando producto...</div>;
  if (!product) return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
      <Link to="/futbol" className="text-blue-500 underline">Volver a la tienda</Link>
    </div>
  );

  const availableStock = selectedSize ? product.stock?.[selectedSize] ?? 0 : 0;
  const hasCustomization = selectedNumber || customName;
  const finalPriceUSD = hasCustomization ? product.priceUSD + 10 : product.priceUSD;
  const finalPriceUYU = hasCustomization ? product.priceUYU + 400 : product.priceUYU;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);


  return (
    <div className="bg-[#f7f7f7] min-h-screen w-full overflow-x-hidden">
      <div className="w-full min-h-screen overflow-x-hidden text-black relative z-10">
        <Helmet><title>{`${product.title} | Looma`}</title></Helmet>
        <div className="container mx-auto p-4">

        {/* Imagen principal */}
        <Link
          to="/futbol"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-full px-4 py-2 hover:bg-black hover:text-white transition-shadow shadow-sm hover:shadow-md w-fit mb-4"
        >
          <ChevronLeft size={16} /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-4">
            {product.images?.length ? (
              <>
                <div className="relative">
                  {product.images?.length > 1 && (
                    <>
                      <button
                        onClick={() => slider.current?.prev()}
                        className="absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-md md:block hidden"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => slider.current?.next()}
                        className="absolute top-1/2 right-2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-md md:block hidden"
                      >
                        <ChevronLeft size={20} className="rotate-180" />
                      </button>
                    </>
                  )}
                  <div
                    ref={sliderRef}
                    className="keen-slider rounded-lg overflow-hidden"
                  >
                    {product.images.map((img: string, i: number) => (
                      <div key={i} className="keen-slider__slide">
                        <img
                          src={img}
                          alt={`Imagen ${i}`}
                          className="object-contain max-h-[400px] w-full select-none"
                          draggable="false"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pt-4">
                    {product.images.map((img: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => slider.current?.moveToIdx(i)}
                        className={`w-20 h-20 rounded-md border ${selectedImage === i ? "border-black border-2" : "border-gray-300"} hover:shadow-md`}
                      >
                        <img src={img} alt={`Miniatura ${i}`} className="object-cover w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-100 h-[450px] w-full rounded-lg flex flex-col items-center justify-center text-gray-400">
                <div className="text-4xl">📦</div>
                <p>No hay imagen</p>
              </div>
            )}
          </div>

          {/* Detalles producto */}
          <div className="flex flex-col">
            <span className="uppercase text-xs tracking-widest text-gray-500 mb-2">Producto destacado</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
              {product.title}
            </h1>
            {product.subtitle && <p className="text-gray-600 mb-4">{product.subtitle}</p>}

            <div className="mb-6">
              <div className="text-4xl font-extrabold text-black">${finalPriceUYU} <span className="text-xl font-semibold text-gray-700">UYU</span></div>
              <div className="text-sm text-gray-400 italic mt-1">$ {finalPriceUSD} USD</div>
            </div>

            {/* Talles */}
            <div className="mb-4">
              <label className="uppercase text-sm font-semibold text-gray-800 mb-2">Talle</label>
              <div className="grid grid-cols-4 gap-2">
                {["S", "M", "L", "XL"].map((size) => {
                  const stockForSize = product.stock?.[size] ?? 0;
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        if (active) {
                          setSelectedSize("");
                        } else {
                          setSelectedSize(size);
                        }
                      }}
                      className={`p-2 text-sm rounded-md border text-center hover:border-gray-400 ${active ? "bg-black text-white" : ""}`}
                    >
                      <div className="font-semibold">{size}</div>
                      <div className="text-xs">{stockForSize > 0 ? `${stockForSize} disponibles` : <span className="text-xs text-gray-500">Encargue</span>}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personalización */}
            {product?.customizable === true && (
              <div className="mb-8">
                <h3 className="uppercase text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2"><ScissorsLineDashed size={18} /> Personalización (opcional)</h3>
                <input
                  value={selectedNumber.replace(/\D/g, "").slice(0, 2)}
                  onChange={(e) => setSelectedNumber(e.target.value)}
                  placeholder="Ej: 10"
                  className="w-full mb-2 p-2 border rounded-md"
                />
                <input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value.slice(0, 10))}
                  placeholder="Ej: RODRIGO"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            )}

            {/* Cantidad */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <label className="uppercase text-sm font-semibold text-gray-800 mb-2">Cantidad</label>
              <div className="flex w-fit border rounded-md overflow-hidden">
                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="px-3 bg-gray-100 hover:bg-gray-200"><FiMinus /></button>
                <div className="px-4 py-2">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 bg-gray-100 hover:bg-gray-200"><FiPlus /></button>
              </div>
            </div>

            {/* Descripción visual a la derecha */}
            {product?.defaultDescriptionType === "camiseta" && (
              <div className="space-y-4 pt-8 mt-2 mb-10 text-gray-800 text-[15px] border-t border-gray-200">
                <div className="flex items-start gap-2">
                  <Shirt size={18} className="mt-1 text-gray-600" />
                  <p>Camiseta de alta calidad, confeccionada en tela liviana, suave y transpirable.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles size={18} className="mt-1 text-gray-600" />
                  <p>Terminaciones premium que aseguran gran confort y durabilidad.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar size={18} className="mt-1 text-gray-600" />
                  <p>Ideal para el día a día, entrenar o sumar a tu colección futbolera.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="mt-1 text-gray-600" />
                  <p>Disponible en talles <strong>S, M, L y XL</strong>.</p>
                </div>
                <div className="flex items-start gap-2">
                  <ScissorsLineDashed size={18} className="mt-1 text-gray-600" />
                  <p>Opción de personalización con nombre y número.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Package size={18} className="mt-1 text-gray-600" />
                  <p>Consultar disponibilidad inmediata.</p>
                </div>
                <p className="italic font-semibold text-black text-sm">¡Viví el fútbol con estilo!</p>
              </div>
            )}

            {/* Botones */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <button
                onClick={() => {
                  if (!selectedSize) {
                    setShowAlert("Selecciona un talle");
                    return;
                  }
                  const selectedStock = product.stock?.[selectedSize] ?? 0;
                  if (selectedStock === 0) {
                    setShowConfirm(true);
                    return;
                  }
                  addToCart({
                    id: String(product.id),
                    slug: product.slug,
                    name: product.title,
                    image: product.images?.[0] || product.image || "",
                    priceUSD: finalPriceUSD,
                    priceUYU: finalPriceUYU,
                    quantity,
                    size: selectedSize,
                    customName,
                    customNumber: selectedNumber
                  });
                  scrollToTop();
                }}
                className="bg-black text-white py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-white hover:text-black transition flex items-center justify-center gap-2 border border-black"
              >
                <Check size={18} /> Agregar al carrito
              </button>

              {totalItems > 0 && (
                <Link to="/carrito" className="bg-white text-black py-3 rounded-xl shadow-md border border-black hover:shadow-lg transition flex items-center justify-center gap-2">
                  <CartIcon itemCount={totalItems} showCount={false} /> Ver carrito ({totalItems})
                </Link>
              )}
            </div>
          </div>
        </div>

        {product && (
          <RelatedProducts
            excludeSlugs={[product.slug]}
            categoryName={product.category?.name}
            title="También podría interesarte"
          />
        )}

        {/* Scroll top */}
        {showScrollTop && (
          <button onClick={scrollToTop} className="fixed bottom-20 right-6 p-3 bg-black text-white rounded-full shadow-lg z-50">
            <ArrowUp size={24} />
          </button>
        )}

        {/* Carrito flotante */}
        {totalItems > 0 && (
          <Link to="/carrito" className="fixed top-6 right-6 bg-black text-white p-3 rounded-full shadow-lg hover:bg-black/80 transition z-50">
            <CartIcon itemCount={totalItems} showCount={true} />
          </Link>
        )}

        {/* Custom Alert/Confirm Modals */}
        {showAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
              <p className="text-lg font-medium text-gray-800 mb-4">{showAlert}</p>
              <button
                onClick={() => setShowAlert("")}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
              <p className="text-lg font-medium text-gray-800 mb-4">
                No hay stock disponible para este talle. ¿Deseas realizar el pedido por encargue?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-md border border-gray-400 text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    addToCart({
                      id: String(product.id),
                      slug: product.slug,
                      name: product.title,
                      image: product.images?.[0] || product.image || "",
                      priceUSD: finalPriceUSD,
                      priceUYU: finalPriceUYU,
                      quantity,
                      size: selectedSize,
                      customName,
                      customNumber: selectedNumber
                    });
                    scrollToTop();
                  }}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}