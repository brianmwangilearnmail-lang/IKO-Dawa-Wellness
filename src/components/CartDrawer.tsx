import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, User, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { createOrder } = useSite();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form'>('cart');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleClose = () => {
    setIsSuccess(false);
    setCheckoutStep('cart');
    setOrderError(null);
    onClose();
  };

  const handleConfirmOrder = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setOrderError('Please enter your name and email address.');
      return;
    }

    setOrderError(null);
    setIsCheckingOut(true);

    const orderItems = cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price_at_sale: item.price,
    }));

    try {
      const result = await createOrder(
        {
          customer_name: formData.name.trim(),
          customer_email: formData.email.trim(),
          total_amount: totalPrice,
          status: 'pending',
        },
        orderItems
      );

      if (result.success) {
        setIsSuccess(true);
        clearCart();
        setFormData({ name: '', email: '' });
      } else {
        setOrderError(result.error || 'An unexpected error occurred. Please try again.');
      }
    } catch (err: any) {
      setOrderError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg)] z-[101] shadow-2xl flex flex-col"
          >
            {isSuccess ? (
              /* ========== SUCCESS STATE ========== */
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[var(--bg)] space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100"
                >
                  <ShieldCheck className="w-12 h-12" />
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Order Placed!</h2>
                  <p className="text-slate-500 text-sm">Thank you for starting your wellness journey with IKO DAWA Wellness.</p>
                </div>
                <div className="w-full h-px bg-slate-200" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider leading-relaxed">
                  Your order has been received. Our team will prepare and dispatch it shortly.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full bg-[var(--accent)] hover:opacity-90 text-white py-3.5 rounded-lg font-semibold text-sm transition-opacity mt-8 shadow-sm flex items-center justify-center gap-2"
                >
                  Continue Shopping <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* ========== HEADER ========== */}
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--card-bg)] shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-3">
                    {checkoutStep === 'form' && (
                      <button
                        onClick={() => { setCheckoutStep('cart'); setOrderError(null); }}
                        className="mr-1 p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}
                    <ShoppingBag className="w-6 h-6 text-[var(--accent)]" />
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      {checkoutStep === 'cart' ? 'Your Bag' : 'Checkout'}
                    </h2>
                    {checkoutStep === 'cart' && (
                      <span className="bg-[var(--accent)] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">{totalItems} items</span>
                    )}
                  </div>
                  <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* ========== CONTENT ========== */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[var(--bg)]">
                  {checkoutStep === 'cart' ? (
                    cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4 pt-20">
                        <ShoppingBag className="w-16 h-16 opacity-20" />
                        <div>
                          <p className="font-bold text-xl text-slate-900">Your bag is empty</p>
                          <p className="text-sm">Start adding some high-quality supplements!</p>
                        </div>
                        <button
                          onClick={onClose}
                          className="mt-4 px-6 py-2.5 bg-[var(--accent)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-4 bg-[var(--card-bg)] p-4 rounded-xl border border-[var(--border)] shadow-sm group">
                            <div className="w-20 h-20 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                              {item.image ? (
                                <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2" />
                              ) : (
                                <ShoppingBag className="w-8 h-8 text-slate-200" />
                              )}
                            </div>
                            <div className="flex-grow flex flex-col">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-tight pr-4">{item.title}</h3>
                                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-[var(--accent)] font-semibold mt-1 text-sm">Ksh {item.price.toLocaleString()}</p>
                              <div className="flex items-center justify-between mt-auto pt-3">
                                <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-200 shadow-sm">
                                  <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-semibold text-slate-900 w-4 text-center">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <p className="text-slate-900 font-bold text-sm">Ksh {(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    /* ========== FORM STEP ========== */
                    <div className="space-y-4">
                      <div className="p-5 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-sm space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Personal Information</h3>
                        <div className="space-y-3">
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent)] transition-colors">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] transition-all"
                            />
                          </div>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent)] transition-colors">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              type="email"
                              placeholder="Email Address"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-semibold text-blue-800">Order Summary</span>
                          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{totalItems} items</span>
                        </div>
                        <div className="space-y-2">
                          {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-slate-600 truncate mr-4">{item.quantity}x {item.title}</span>
                              <span className="font-semibold text-slate-900">Ksh {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Section */}
                      <div className="p-5 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-sm space-y-4">
                        <div>
                          <h3 className="font-semibold text-slate-900">Payment</h3>
                          <p className="text-xs text-slate-500 mt-0.5">All transactions are secure and encrypted.</p>
                        </div>

                        {/* COD Option */}
                        <div className="flex items-center gap-3 p-3 border-2 border-[var(--accent)] rounded-lg bg-blue-50/30">
                          <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                          <span className="text-sm font-semibold text-slate-900">Cash on Delivery (COD)</span>
                        </div>

                        {/* Policy Details */}
                        <div className="space-y-2 text-[12px] text-slate-500 leading-relaxed pt-1">
                          <p>
                            We <span className="font-black">ONLY</span> accept <span className="font-black">Cash or M-pesa on delivery IF</span> you are within the <span className="font-bold">Nairobi Metropolis</span>.
                          </p>

                          <p>
                            If you are outside Nairobi CBD, you will as well kindly cater between (<span className="font-bold">Sh.100 – sh.400</span>) for delivery
                          </p>

                          <div className="pt-1 border-t border-[var(--border)] space-y-1">
                            <p className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">NB:</p>
                            <p>
                              1. We do <span className="font-black">FREE delivery</span> for orders worth <span className="font-black">ksh.3000 <em>and above</em></span>.
                            </p>
                          </div>
                        </div>
                      </div>

                      {orderError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                          {orderError}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ========== FOOTER ========== */}
                {cart.length > 0 && (
                  <div className="p-6 bg-[var(--card-bg)] border-t border-[var(--border)] shadow-sm flex-shrink-0">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-slate-500 text-sm">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-800">Ksh {totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-sm">
                        <span>Shipping</span>
                        <span className="text-[var(--accent)] font-semibold">FREE</span>
                      </div>
                      <div className="flex justify-between text-slate-900 text-lg font-bold pt-3 border-t border-slate-100">
                        <span>Total</span>
                        <span className="text-[var(--accent)]">Ksh {totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 justify-center mb-4">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Secure Checkout Guaranteed
                    </div>

                    {checkoutStep === 'cart' ? (
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('form')}
                        className="w-full bg-[var(--accent)] hover:opacity-90 text-white py-3.5 rounded-lg font-semibold transition-opacity flex items-center justify-center gap-2"
                      >
                        <span>Checkout Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConfirmOrder}
                        disabled={isCheckingOut}
                        className="w-full bg-[var(--accent)] hover:opacity-90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3.5 rounded-lg font-semibold transition-opacity flex items-center justify-center gap-2"
                      >
                        {isCheckingOut ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Placing Order...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm Order</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
