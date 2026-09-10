import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import {
  ChevronRight,
  ShieldCheck,
  Cpu,
  RefreshCw,
  ShoppingBag,
  ArrowLeft,
  Layers,
  AlertCircle,
  Package,
  Hash,
  List,
  CheckCircle,
} from 'lucide-react';

// Safe normalizer helper inside the component to handle any data shape
const normalizeRawImages = (rawImages: any): string[] => {
  if (!rawImages) return ['https://via.placeholder.com/600'];
  let collection: any[] = [];

  if (Array.isArray(rawImages)) {
    collection = rawImages;
  } else if (typeof rawImages === 'string') {
    try {
      const parsed = JSON.parse(rawImages);
      if (Array.isArray(parsed)) collection = parsed;
      else collection = [rawImages];
    } catch {
      collection = rawImages.includes(',') ? rawImages.split(',') : [rawImages];
    }
  } else if (typeof rawImages === 'object') {
    collection = Object.values(rawImages);
  }

  const cleaned = collection
    .flat(Infinity)
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') {
        return String(item.url || item.path || item.image || '').trim();
      }
      return '';
    })
    .filter(Boolean);

  return cleaned.length > 0 ? cleaned : ['https://via.placeholder.com/600'];
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, error: contextError, fetchProductById } = useProducts() as any;
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const isAddingRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    const loadProductData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);

      try {
        let foundData = null;

        // 1. Check local context cache first
        if (products && Array.isArray(products)) {
          foundData = products.find((p: any) => String(p.id) === String(id) || String(p._id) === String(id));
        }

        // 2. If not found in cache, fetch directly
        if (!foundData) {
          if (typeof fetchProductById === 'function') {
            foundData = await fetchProductById(id);
          } else {
            const res = await fetch(`https://cc-backend-yc-team.onrender.com/api/v1/products/${id}`);
            if (!res.ok) throw new Error('Product not found');
            foundData = await res.json();
            foundData = foundData.product || foundData;
          }
        }

        if (mounted && foundData) {
          setProduct(foundData);
        } else if (mounted) {
          throw new Error('Product not found');
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load product');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadProductData();
    return () => {
      mounted = false;
    };
  }, [id, products, fetchProductById]);

  // --- GUARANTEED IMAGE RESOLUTION ---
  const imageGallery = useMemo(() => {
    if (!product) return ['https://via.placeholder.com/600'];
    return normalizeRawImages(product.images || product.imageUrl || product.image);
  }, [product]);

  const sizes = useMemo(() => {
    if (!product?.sizes) return [];
    if (Array.isArray(product.sizes)) return product.sizes;
    if (typeof product.sizes === 'string') {
      return product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  }, [product]);

  const colors = useMemo(() => {
    if (!product?.colors) return [];
    if (Array.isArray(product.colors)) return product.colors;
    if (typeof product.colors === 'string') {
      return product.colors.split(',').map((c: string) => c.trim()).filter(Boolean);
    }
    return [];
  }, [product]);

  useEffect(() => {
    if (sizes.length === 1) setSelectedSize(sizes[0]);
    if (colors.length === 1) setSelectedColor(colors[0]);
  }, [sizes, colors]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || contextError || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-800 p-4 space-y-4">
        <AlertCircle size={40} className="text-red-500 mb-2" />
        <div className="text-sm font-bold text-slate-900">Product not found.</div>
        <p className="text-xs text-slate-500">
          The item you are looking for may have been removed or is unavailable.
        </p>
        <Link
          to="/shop"
          className="mt-4 flex items-center gap-2 text-sm text-white transition-colors bg-slate-900 hover:bg-slate-800 px-6 py-2.5 rounded-xl font-bold shadow-md"
        >
          <ArrowLeft size={16} />
          <span>Return to Shop</span>
        </Link>
      </div>
    );
  }

  const availableStock = product.inventory !== undefined ? product.inventory : product.stock || 0;
  const isOutOfStock = availableStock <= 0;
  const formatPrice = (value: any): string => (Number(value) || 0).toFixed(2);
  const comparePrice = product.compare_at_price || product.compareAtPrice;

  const missingOptions =
    (sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor);

  const variantName = [selectedSize, selectedColor].filter(Boolean).join(' - ') || 'Standard';
  const productId = product._id || product.id;

  const existingCartItem = cartItems?.find(
    (item: any) => String(item.id) === String(productId) && item.variant === variantName
  );
  const quantityInCart = existingCartItem ? existingCartItem.quantity : 0;
  const isMaxStockReached = quantityInCart >= availableStock;

  const handleCartIngestion = () => {
    if (isOutOfStock || missingOptions || isAddingRef.current || isMaxStockReached) return;

    isAddingRef.current = true;
    setIsDispatching(true);

    addToCart({
      id: productId,
      name: product.name,
      price: product.price,
      image: imageGallery[0],
      category: product.category || 'General',
      variant: variantName,
      quantity: 1,
    });

    setTimeout(() => {
      isAddingRef.current = false;
      setIsDispatching(false);
    }, 400);
  };

  const getDiscountPercentage = () => {
    if (!comparePrice || comparePrice <= product.price) return null;
    return Math.round(((comparePrice - product.price) / comparePrice) * 100);
  };
  const discount = getDiscountPercentage();

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 pt-24 pb-20 font-serif selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider mb-8 border-b border-slate-100 pb-4 font-sans">
          <Link to="/shop" className="hover:text-indigo-600 transition-colors">
            Shop
          </Link>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-900 font-bold truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start font-sans">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="w-full aspect-square bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden relative group flex items-center justify-center shadow-sm">
              <img
                src={imageGallery[activeImageIndex] || imageGallery[0]}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <span className="text-xs font-bold uppercase tracking-wider text-white bg-red-600 px-4 py-2 rounded-xl shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {imageGallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {imageGallery.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl bg-slate-50 overflow-hidden shrink-0 transition-all ${
                      idx === activeImageIndex
                        ? 'border-2 border-indigo-600 shadow-md scale-95'
                        : 'border border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Meta & Controls */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">
                  {product.category || 'General'}
                </span>
                {product.badge && (
                  <span className="text-[10px] text-slate-800 font-extrabold uppercase tracking-widest bg-slate-100 px-2 py-1 rounded border border-slate-200">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-slate-900">₱{formatPrice(product.price)}</span>
                {comparePrice && comparePrice > product.price && (
                  <div className="flex flex-col pb-1">
                    <span className="text-sm font-bold text-red-500">Save {discount}%</span>
                    <span className="text-sm text-slate-400 line-through font-medium">
                      ₱{formatPrice(comparePrice)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full h-[1px] bg-slate-200" />

            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description || 'Experience premium quality and seamless performance.'}
            </p>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Select Color</span>
                  {selectedColor && <span className="text-slate-900">{selectedColor}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      disabled={isOutOfStock}
                      className={`h-10 px-5 rounded-lg text-sm font-bold transition-all ${
                        selectedColor === c
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-900 hover:text-slate-900'
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Select Size</span>
                  {selectedSize && <span className="text-slate-900">{selectedSize}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      disabled={isOutOfStock}
                      className={`h-10 px-5 rounded-lg text-sm font-bold transition-all ${
                        selectedSize === s
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-900 hover:text-slate-900'
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="pt-4">
              <button
                onClick={handleCartIngestion}
                disabled={isOutOfStock || missingOptions || isDispatching || isMaxStockReached}
                className="w-full h-14 bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-bold rounded-xl flex items-center justify-center gap-3 transition-colors tracking-wide disabled:bg-slate-100 disabled:text-slate-400 disabled:border disabled:border-slate-200 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer"
              >
                {isDispatching ? (
                  <>
                    <RefreshCw size={18} className="animate-spin text-white" />
                    <span>Adding to your Bag...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>
                      {isOutOfStock
                        ? 'Out of Stock'
                        : isMaxStockReached
                        ? 'Max Stock Reached in Cart'
                        : missingOptions
                        ? 'Select Options to Continue'
                        : 'Add to My Bag'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Product Details Section */}
            <div className="mt-8 border-t border-slate-200 pt-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <List size={18} className="text-indigo-600" /> Product Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 font-medium flex items-center gap-2 text-sm">
                    <Package size={16} className="text-slate-400" /> Stock
                  </span>
                  <span className={`font-bold text-sm ${isOutOfStock ? 'text-red-500' : 'text-slate-900'}`}>
                    {availableStock} units
                  </span>
                </div>

                {product.sku && (
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-slate-500 font-medium flex items-center gap-2 text-sm">
                      <Hash size={16} className="text-slate-400" /> SKU
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{product.sku}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                <Cpu size={20} className="text-indigo-600" />
                <div>
                  <div className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider">
                    Quality Assured
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Premium Materials</div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                <Layers size={20} className="text-indigo-600" />
                <div>
                  <div className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider">
                    Secure Packaging
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Damage-free transit</div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                <ShieldCheck size={20} className="text-indigo-600" />
                <div>
                  <div className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider">
                    Buyer Protection
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Guaranteed secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
