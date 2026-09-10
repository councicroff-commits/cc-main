import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

const formatPHP = (value: number): string => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
};

const formatOrderDate = (dateValue?: string | Date) => {
  if (!dateValue) return 'Recently placed';
  const parsed = new Date(dateValue);
  if (isNaN(parsed.getTime())) return 'Recently placed';

  return parsed.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const getStatusProgress = (status: string): string => {
  const s = status.toLowerCase();
  if (['pending', 'unpaid', 'on hold'].includes(s)) return '25%';
  if (['processing', 'accepted', 'preparing', 'packing'].includes(s)) return '50%';
  if (['shipped', 'out for delivery', 'on the way', 'in transit'].includes(s)) return '75%';
  if (['delivered', 'completed', 'received'].includes(s)) return '100%';
  return '25%';
};

const OrdersPage: React.FC = () => {
  const { orders = [], cancelOrder, fetchUserOrders } = useOrders();

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; orderId: string; backendId?: string; displayOrderNum?: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLatestStatuses = async () => {
      setIsSyncing(true);
      if (fetchUserOrders) await fetchUserOrders();
      if (isMounted) setIsSyncing(false);
    };

    fetchLatestStatuses();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const handleManualRefresh = async () => {
    setIsSyncing(true);
    if (fetchUserOrders) await fetchUserOrders();
    setIsSyncing(false);
    showToast("Orders refreshed from database.", "success");
  };

  const confirmCancellation = async () => {
    if (!confirmModal) return;
    const { orderId, backendId } = confirmModal;
    setCancellingId(orderId);
    setConfirmModal(null);

    try {
      if (cancelOrder) {
        await cancelOrder(orderId, backendId);
        showToast("Order cancelled successfully.", "success");
      }
    } catch (err) {
      showToast("An error occurred while trying to cancel this order.", "error");
    } finally {
      setCancellingId(null);
    }
  };

  const getShippingDetails = (order: any) => {
    const s = order.shippingAddress || order.shipping_address || {};
    return {
      fullName: order.shipping_full_name || s.fullName || s.full_name || 'N/A',
      mobileNumber: order.shipping_mobile_number || s.mobileNumber || s.mobile_number || 'N/A',
      street: order.shipping_street || s.street || 'N/A',
      barangay: order.shipping_barangay || s.barangay || '',
      city: order.shipping_city || s.city || '',
      region: order.shipping_region || s.region || '',
      zipCode: order.shipping_zip_code || s.zipCode || s.zip_code || '',
      country: order.shipping_country || s.country || 'Philippines',
      landmark: order.shipping_landmark || s.landmark || '',
    };
  };

  const activeOrders = orders.filter(
    (o: any) => !['delivered', 'completed'].includes((o.status || 'Pending').toLowerCase())
  );
  const deliveredOrders = orders.filter(
    (o: any) => ['delivered', 'completed'].includes((o.status || '').toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pt-24 pb-24 px-4 sm:px-8 font-sans relative">
      
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg font-bold text-sm text-white animate-fade-in flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-gray-900' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}

      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100">
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Cancel Order?</h3>
            <p className="text-sm text-gray-500 mb-8">
              Are you sure you want to cancel Order <span className="font-mono font-bold text-gray-800">#{confirmModal.displayOrderNum}</span>?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal(null)} 
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Keep
              </button>
              <button 
                onClick={confirmCancellation} 
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Live tracking and order status updates</p>
          </div>
          <button 
            onClick={handleManualRefresh} 
            disabled={isSyncing}
            className={`px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 shadow-sm transition-all flex items-center justify-center gap-2 ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:shadow-md'}`}
          >
            {isSyncing ? '🔄 Syncing...' : '🔄 Refresh Status'}
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center">
            <h2 className="text-xl font-bold mb-2">No orders found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">When you place an order, it will appear here so you can track its status.</p>
            <Link to="/shop" className="inline-block px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* ACTIVE ORDERS */}
            {activeOrders.map((order: any, idx: number) => {
              const backendId = order._id || order.id;
              const displayOrderNumber = order.order_number || (backendId ? `ORD-${backendId.slice(-6).toUpperCase()}` : `ORDER-${idx}`);
              const orderDate = order.date || order.created_at || order.createdAt;
              const totalAmount = order.total_amount ?? order.total ?? 0;
              const shipping = getShippingDetails(order);
              
              const displayStatus = order.status || 'Pending';
              const normalizedStatus = displayStatus.toLowerCase();
              
              const estimatedDelivery = order.estimated_delivery || order.estimatedDelivery;
              const adminNote = order.notes;
              
              const isCancellable = ['pending', 'processing', 'accepted', 'unpaid'].includes(normalizedStatus);
              const progressWidth = getStatusProgress(normalizedStatus);

              return (
                <div key={backendId || idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm animate-fade-in relative overflow-hidden transition-all hover:shadow-md">
                  
                  {cancellingId === backendId && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <div className="px-5 py-3 bg-gray-900 text-white rounded-xl shadow-xl font-bold text-sm animate-pulse">
                        Processing Cancellation...
                      </div>
                    </div>
                  )}

                  <div className="border-b border-gray-100 pb-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Order Number</p>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-lg font-black font-mono text-gray-900">
                            #{displayOrderNumber}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                          Placed on {formatOrderDate(orderDate)}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-indigo-600">{formatPHP(totalAmount)}</p>
                      </div>
                    </div>

                    {/* Timeline & Status */}
                    {normalizedStatus !== 'cancelled' ? (
                      <div className="relative mt-4">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Status:</span>
                          <span className="bg-indigo-100 text-indigo-900 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-indigo-200">
                            {displayStatus}
                          </span>
                        </div>

                        <div className="overflow-hidden h-2.5 mb-3 text-xs flex rounded-full bg-gray-100 border border-gray-200">
                          <div style={{ width: progressWidth }} 
                               className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-900 transition-all duration-700 ease-out"></div>
                        </div>
                        <div className="flex justify-between text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <span className={progressWidth === '25%' ? 'text-black font-extrabold' : 'text-gray-900'}>Pending</span>
                          <span className={progressWidth === '50%' ? 'text-black font-extrabold' : (['75%', '100%'].includes(progressWidth) ? 'text-gray-900' : '')}>Processing</span>
                          <span className={progressWidth === '75%' ? 'text-black font-extrabold' : (progressWidth === '100%' ? 'text-gray-900' : '')}>Shipped</span>
                          <span className={progressWidth === '100%' ? 'text-emerald-600 font-extrabold' : ''}>Delivered</span>
                        </div>
                        
                        {(estimatedDelivery || adminNote) && progressWidth !== '100%' && (
                          <div className="mt-6 p-5 bg-gradient-to-r from-indigo-50/70 to-blue-50/70 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow border border-indigo-100 text-xl flex-shrink-0">📦</div>
                            <div className="space-y-1">
                              {estimatedDelivery && (
                                <div>
                                  <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest">Estimated Arrival</p>
                                  <p className="text-base font-black text-indigo-950">{estimatedDelivery}</p>
                                </div>
                              )}
                              {adminNote && (
                                <div className="pt-1">
                                  <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Status Note / Message</p>
                                  <p className="text-xs font-bold text-gray-800 italic">"{adminNote.trim()}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl text-center font-bold text-sm border border-rose-200 shadow-sm mt-4">
                        This order has been cancelled.
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs bg-gray-50/60 p-4 rounded-2xl">
                      <div>
                        <span className="text-gray-400 font-bold uppercase tracking-wider">Payment Method: </span>
                        <span className="font-extrabold text-gray-800 uppercase">{order.payment_method ? String(order.payment_method).replace(/_/g, ' ') : 'Cash on Delivery'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold uppercase tracking-wider">Payment Status: </span>
                        <span className={`font-bold uppercase px-2.5 py-1 rounded-md tracking-wider text-[10px] border ${
                          (order.payment_status || '').toLowerCase() === 'paid' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {order.payment_status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span> Items Ordered ({order.items?.length || 0})
                      </h3>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {(order.items || []).map((item: any, index: number) => (
                          <div key={`${item.id || item.product_id || item._id || index}`} className="flex gap-4 items-center p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                            <div className="w-16 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">No img</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                              <p className="text-xs font-medium text-gray-500 mt-1">Quantity: {item.quantity}</p>
                              <p className="text-sm font-black text-gray-900 mt-1">{formatPHP(Number(item.price) * Number(item.quantity))}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-200 shadow-sm h-fit">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-200 pb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Shipping Info
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Recipient</p>
                          <p className="font-bold text-gray-900">{shipping.fullName}</p>
                          <p className="text-gray-600 font-medium">{shipping.mobileNumber}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Address</p>
                          <p className="font-bold text-gray-900">{shipping.street}</p>
                          {shipping.barangay && <p className="text-gray-700 font-medium">Brgy. {shipping.barangay}</p>}
                          <p className="text-gray-700 font-medium">{shipping.city}, {shipping.region} {shipping.zipCode}</p>
                          <p className="text-gray-700 font-medium">{shipping.country}</p>
                        </div>
                        {shipping.landmark && (
                          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mt-2">
                            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-0.5">📍 Landmark Note</p>
                            <p className="text-gray-700 font-medium italic text-xs">"{shipping.landmark}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {isCancellable && (
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                      <button 
                        onClick={() => setConfirmModal({ isOpen: true, orderId: backendId!, backendId: backendId, displayOrderNum: displayOrderNumber })} 
                        disabled={cancellingId === backendId} 
                        className="px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all shadow-sm"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* DELIVERED / COMPLETED ORDERS */}
            {deliveredOrders.length > 0 && (
              <div className="mt-16">
                <h2 className="text-lg font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  Completed Orders
                  <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
                    {deliveredOrders.length}
                  </span>
                </h2>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                  {deliveredOrders.map((order: any, idx: number) => {
                    const backendId = order._id || order.id;
                    const displayOrderNumber = order.order_number || (backendId ? `ORD-${backendId.slice(-6).toUpperCase()}` : `ORDER-D-${idx}`);
                    const orderDate = order.date || order.created_at || order.createdAt;
                    const totalAmount = order.total_amount ?? order.total ?? 0;
                    const itemCount = order.items?.length || 0;
                    const displayStatus = order.status || 'Delivered';

                    return (
                      <div
                        key={backendId || idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 font-black text-xl shadow-sm">
                            ✓
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black font-mono text-gray-900">
                              #{displayOrderNumber}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Placed on {formatOrderDate(orderDate)}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200 bg-emerald-100 text-emerald-800">
                                {displayStatus}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                • {itemCount} item{itemCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center sm:justify-end">
                          <p className="text-xl font-black text-gray-900 whitespace-nowrap">
                            {formatPHP(totalAmount)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
