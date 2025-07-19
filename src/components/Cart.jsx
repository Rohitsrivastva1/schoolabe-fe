import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PaymentService from '../services/paymentService';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaTrash, FaLock, FaCreditCard } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessing(true);

    try {
      const orderData = {
        courseIds: cart.map(item => item.id),
        amount: getCartTotal() * 100, // Convert to paise for Razorpay
        currency: 'INR',
        description: `Purchase of ${cart.length} course(s)`,
        userEmail: user.email,
        userName: user.name
      };

      const result = await PaymentService.processPayment(orderData, user);
      
      if (result.success) {
        toast.success('Payment successful! You now have access to the purchased courses.');
        clearCart();
        // Optionally redirect to purchased courses or dashboard
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveItem = (courseId) => {
    removeFromCart(courseId);
    toast.success('Course removed from cart');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <FaShoppingCart className="cart-icon" />
        <h2>Your cart is empty</h2>
        <p>Add some courses to get started!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span className="cart-count">{getCartCount()} item(s)</span>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="item-price">₹{item.price || 0}</span>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemoveItem(item.id)}
                title="Remove from cart"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-item">
            <span>Subtotal ({getCartCount()} items):</span>
            <span>₹{getCartTotal()}</span>
          </div>
          <div className="summary-item">
            <span>Tax (18% GST):</span>
            <span>₹{(getCartTotal() * 0.18).toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>Total:</span>
            <span>₹{(getCartTotal() * 1.18).toFixed(2)}</span>
          </div>

          {!user ? (
            <div className="login-prompt">
              <FaLock />
              <p>Please login to proceed with checkout</p>
            </div>
          ) : (
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={processing}
            >
              {processing ? (
                <span>Processing...</span>
              ) : (
                <>
                  <FaCreditCard />
                  Proceed to Checkout
                </>
              )}
            </button>
          )}

          <button
            className="clear-cart-btn"
            onClick={clearCart}
            disabled={processing}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 