import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const formatPHP = (value: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
};

// 🔥 DYNAMIC PERMANENT FIX for Checkout (same style as AuthContext)
const getApiBaseUrl = () => {
  return 'https://cc-backend-production-00fe.up.railway.app/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

const extractErrorMessage = (data: any, fallback: string): string => {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((err: any) => err.msg || JSON.stringify(err)).join(', ');
  }
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  return fallback;
};

const parseResponse = async (response: Response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { detail: text || 'Server error (Status ' + response.status + ')' };
  }
};

const CheckoutPage: React.FC = () => {
  const {
    cartItems,
    cartSubtotal,
    clearCart,
    appliedCoupon,
    eventDiscountTotal,
    tax,
    taxRate,
    total,
  } = useCart() as any;

  const { shippingInfo, updateShippingInfo, checkoutStep, setCheckoutStep, resetCheckout } =
    useCheckout();

  const orderContext = useOrders();
  const fetchUserOrders = orderContext?.fetchUserOrders;

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showReceipt, setShowReceipt] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeUserId =
    isAuthenticated && user ? user.id || (user as any)._id || '' : '';

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      couponDiscountAmount = (cartSubtotal * appliedCoupon.discount) / 100;
    } else {
      couponDiscountAmount = appliedCoupon.discount || 0;
    }
  }

  const totalDiscountAmount = (eventDiscountTotal || 0) + couponDiscountAmount;
  const finalCheckoutTotal = Math.max(0, total);

  useEffect(() => {
    if (cartItems.length === 0 && checkoutStep === 1 && !showReceipt) {
      navigate('/shop');
    }
  }, [cartItems, navigate, checkoutStep, showReceipt]);

  useEffect(() => {
    if (isAuthenticated && user) {
      updateShippingInfo({
        fullName: shippingInfo.fullName || user.fullName || (user as any).username || '',
        email: shippingInfo.email || user.email || '',
        mobileNumber: shippingInfo.mobileNumber || (user as any).mobile || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateShippingInfo({ [e.target.name]: e.target.value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep(2);
  };

  const handlePlaceOrder = useCallback(async () => {
    if (isSubmitting) return;

    if (!isAuthenticated || !activeUserId) {
      setSubmitError('Please log in before placing an order so it can be saved to your account.');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setSubmitError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const refNum = 'CC-' + Math.floor(100000 + Math.random() * 900000);
    setOrderReference(refNum);

    const orderPayload = {
      user_id: String(activeUserId),
      subtotal: Number(cartSubtotal),
      discount_amount: Number(totalDiscountAmount),
      tax_amount: Number(tax),
      shipping_fee: 0,
      total_amount: Number(finalCheckoutTotal),
      total: Number(finalCheckoutTotal),
      applied_coupon: appliedCoupon ? appliedCoupon.code : null,
      items: cartItems.map((item: any) => ({
        id: String(item.id),
        product_id: String(item.id),
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || '',
        category: item.category || '',
      })),
      shipping_full_name: shippingInfo.fullName,
      shipping_email: shippingInfo.email,
      shipping_mobile_number: shippingInfo.mobileNumber,
      shipping_street: shippingInfo.street,
      shipping_barangay: shippingInfo.barangay,
      shipping_city: shippingInfo.city,
      shipping_region: shippingInfo.region,
      shipping_zip_code: shippingInfo.zipCode,
      shipping_landmark: shippingInfo.landmark || '',
      shipping_country: 'Philippines',
      payment_method: 'cash_on_delivery',
      date: new Date().toISOString(),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = 'Bearer ' + token;
      }

      // ✅ Safe URL (same permanent base as AuthContext)
      const ordersUrl = API_BASE_URL + '/orders/';

      const response = await fetch(ordersUrl, {
        method: 'POST',
        signal: controller.signal,
        headers,
        body: JSON.stringify(orderPayload),
      });
      clearTimeout(timeoutId);

      const data = await parseResponse(response);

      if (!response.ok) {
        const msg = extractErrorMessage(
          data,
          'Failed to place order (' + response.status + ')'
        );
        setSubmitError(msg);
        console.error('[Checkout] Order failed:', response.status, data);
        return;
      }

      // Success — use backend order number when available
      const backendRef =
        data.order?.order_number ||
        data.order_number ||
        data.order_id ||
        data._id ||
        data.order?._id ||
        refNum;

      setOrderReference(String(backendRef));

      if (fetchUserOrders) {
        await fetchUserOrders();
      }

      setShowReceipt(true);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setSubmitError('Connection timed out. Please try again.');
      } else {
        console.error('[Checkout] Network error:', err);
        setSubmitError('Network error. Order was not saved. Please try again.');
      }
      // ❌ Do NOT show receipt or clear cart on failure
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    isAuthenticated,
    activeUserId,
    cartItems,
    cartSubtotal,
    totalDiscountAmount,
    tax,
    finalCheckoutTotal,
    appliedCoupon,
    shippingInfo,
    fetchUserOrders,
  ]);

  const handleFinishAndNavigate = () => {
    clearCart();
    resetCheckout();
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pt-24 pb-24 px-4 sm:px-8 lg:px-12 font-sans selection:bg-zinc-200 selection:text-black relative">
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white text-zinc-900 w-full max-w-md rounded-2xl p-8 shadow-2xl relative my-8 border border-zinc-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Order Confirmed</h2>
              <p className="text-zinc-500 text-xs mt-2 font-mono">REF: {orderReference}</p>
            </div>

            <div className="border-y border-dashed border-zinc-300 py-6 my-6 space-y-4">
              <div className="flex justify-between items-start text-sm">
                <span className="text-zinc-500 w-24">Customer</span>
                <div className="font-medium text-right flex-1">
                  <p>{shippingInfo.fullName}</p>
                  <p className="text-xs text-zinc-500">{shippingInfo.mobileNumber}</p>
                </div>
              </div>
              <div className="flex justify-between items-start text-sm">
                <span className="text-zinc-500 w-24">Deliver To</span>
                <div className="font-medium text-right flex-1">
                  <p>
                    {shippingInfo.street}, Brgy. {shippingInfo.barangay}
                  </p>
                  <p>
                    {shippingInfo.city}, {shippingInfo.region} {shippingInfo.zipCode}
                  </p>
                  {shippingInfo.landmark && (
                    <p className="text-xs text-zinc-500 mt-1">Landmark: {shippingInfo.landmark}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="uppercase tracking-[0.15em] text-xs font-semibold text-zinc-500">
                Total Paid
              </span>
              <span className="text-3xl font-black text-black">
                {formatPHP(finalCheckoutTotal)}
              </span>
            </div>

            <button
              onClick={handleFinishAndNavigate}
              className="w-full py-4 bg-black hover:bg-zinc-800 text-white text-xs font-extrabold uppercase tracking-[0.15em] rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Continue to Orders
            </button>
          </div>
        </div>
      )}

      <div
        className={
          'max-w-4xl mx-auto transition-all ' +
          (showReceipt ? 'blur-sm opacity-50 pointer-events-none' : 'animate-fade-in')
        }
      >
        <div className="border-b border-zinc-200 pb-8 mb-10 text-center">
          <p className="text-zinc-500 text-[10px] tracking-[0.4em] font-semibold uppercase mb-3">
            Step {checkoutStep} of 2
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black">
            Secure Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            {checkoutStep === 1 ? (
              <form
                onSubmit={handleNextStep}
                className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm"
              >
                <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
                  <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-zinc-900">
                    Contact & Delivery
                  </h2>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                        Full Name *
                      </label>
                      <input
                        required
                        minLength={2}
                        type="text"
                        name="fullName"
                        placeholder="Juan Dela Cruz"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        required
                        type="tel"
                        pattern="[0-9]{11}"
                        title="Please enter a valid 11-digit mobile number"
                        name="mobileNumber"
                        placeholder="09171234567"
                        value={shippingInfo.mobileNumber}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="juan@example.com"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                    />
                  </div>

                  <hr className="border-zinc-100 my-6" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                        Region / Province *
                      </label>
                      <input
                        required
                        minLength={3}
                        type="text"
                        name="region"
                        placeholder="e.g. Central Visayas"
                        value={shippingInfo.region}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                        City / Municipality *
                      </label>
                      <input
                        required
                        minLength={3}
                        type="text"
                        name="city"
                        placeholder="e.g. Dumanjug"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                        Barangay *
                      </label>
                      <input
                        required
                        minLength={3}
                        type="text"
                        name="barangay"
                        placeholder="e.g. Poblacion"
                        value={shippingInfo.barangay}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        required
                        pattern="[0-9]{4}"
                        title="Please enter a valid 4-digit ZIP code"
                        type="text"
                        name="zipCode"
                        placeholder="e.g. 6035"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                      House No., Building, Street Name *
                    </label>
                    <input
                      required
                      minLength={5}
                      type="text"
                      name="street"
                      placeholder="e.g. 123 Mango Avenue"
                      value={shippingInfo.street}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                      Nearest Landmark *
                    </label>
                    <input
                      required
                      minLength={3}
                      type="text"
                      name="landmark"
                      placeholder="e.g. Near 7-Eleven, Blue Gate"
                      value={shippingInfo.landmark}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-8 py-4 bg-black hover:bg-zinc-800 text-white text-xs font-extrabold uppercase tracking-[0.15em] rounded-xl transition-all shadow-md active:scale-[0.99]"
                >
                  Continue to Review
                </button>
              </form>
            ) : (
              <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm">
                <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-zinc-900 mb-6">
                  Review & Payment
                </h2>

                <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl mb-6">
                  <div className="flex justify-between items-center mb-4 border-b border-zinc-200 pb-3">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                      Delivery Information
                    </span>
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-black underline font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                        Contact
                      </p>
                      <p className="text-sm text-zinc-900 font-bold">{shippingInfo.fullName}</p>
                      <p className="text-xs text-zinc-600 mt-1">{shippingInfo.mobileNumber}</p>
                      <p className="text-xs text-zinc-600">{shippingInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                        Address
                      </p>
                      <p className="text-sm text-zinc-900 font-bold">
                        {shippingInfo.street}, Brgy. {shippingInfo.barangay}
                      </p>
                      <p className="text-xs text-zinc-600 mt-1">
                        {shippingInfo.city}, {shippingInfo.region} {shippingInfo.zipCode}
                      </p>
                      {shippingInfo.landmark && (
                        <p className="text-xs text-zinc-500 mt-1 border-t border-zinc-200 pt-1">
                          Landmark: {shippingInfo.landmark}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
                      Payment Method
                    </span>
                    <p className="text-sm text-zinc-900 font-bold flex items-center gap-2">
                      <span className="w-8 h-5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded flex items-center justify-center text-[8px] font-bold">
                        COD
                      </span>
                      Cash on Delivery
                    </p>
                  </div>
                </div>

                {submitError && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {submitError}
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                    You must be logged in to place an order so it appears under My Orders.
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !isAuthenticated}
                  className={
                    'w-full py-4 bg-black text-white text-xs font-extrabold uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 ' +
                    (isSubmitting || !isAuthenticated
                      ? 'opacity-75 cursor-not-allowed'
                      : 'hover:bg-zinc-800 active:scale-[0.99]')
                  }
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Place Order ' + formatPHP(finalCheckoutTotal)
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl sticky top-28 shadow-sm">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-900 mb-6">
                Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-zinc-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">QTY: {item.quantity}</p>
                      <p className="text-xs text-zinc-600 font-medium mt-1">
                        {formatPHP(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-200 pt-4 space-y-3 text-xs tracking-wide text-zinc-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 font-medium">{formatPHP(cartSubtotal)}</span>
                </div>

                {eventDiscountTotal > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Event Discount</span>
                    <span className="font-medium">-{formatPHP(eventDiscountTotal)}</span>
                  </div>
                )}

                {couponDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span className="font-medium">-{formatPHP(couponDiscountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Duties & Taxes ({(taxRate || 0) * 100}%)</span>
                  <span className="text-zinc-900 font-medium">{formatPHP(tax)}</span>
                </div>
              </div>

              <div className="border-t border-zinc-200 mt-4 pt-4 flex justify-between items-baseline">
                <span className="uppercase tracking-[0.15em] text-xs font-semibold text-zinc-500">
                  Total
                </span>
                <span className="text-xl font-black text-black">
                  {formatPHP(finalCheckoutTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
