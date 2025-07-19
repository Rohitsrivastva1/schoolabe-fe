# Payment Feature Setup Guide

## Overview
This guide will help you set up the Razorpay payment integration for your Schoolabe platform.

## Features Implemented

### 🛒 Shopping Cart
- Add courses to cart
- Remove courses from cart
- Cart persistence in localStorage
- Cart count indicator in navbar

### 💳 Payment Processing
- Razorpay integration
- Secure payment processing
- Payment verification
- Order management

### 🔒 Course Access Control
- Premium course protection
- Access verification
- Purchase flow integration

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in your project root with the following variables:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000

# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_test_key_here
REACT_APP_RAZORPAY_KEY_SECRET=your_test_secret_here
```

### 2. Razorpay Account Setup
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your test API keys from the dashboard
3. Replace the placeholder keys in your `.env` file

### 3. Backend API Endpoints Required
Your backend needs to implement these endpoints:

#### Create Order
```
POST /payments/create-order
Body: {
  courseIds: [1, 2, 3],
  amount: 50000, // in paise
  currency: "INR",
  description: "Course Purchase",
  userEmail: "user@example.com",
  userName: "John Doe"
}
```

#### Verify Payment
```
POST /payments/verify
Body: {
  razorpay_payment_id: "pay_xxx",
  razorpay_order_id: "order_xxx",
  razorpay_signature: "signature_xxx",
  orderId: "order_xxx",
  courseIds: [1, 2, 3]
}
```

#### Check Course Access
```
GET /payments/course-access/:courseId
Headers: Authorization: Bearer <token>
```

#### Get Purchased Courses
```
GET /payments/purchased-courses
Headers: Authorization: Bearer <token>
```

### 4. Database Schema
You'll need these tables in your backend:

```sql
-- Orders table
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'pending',
  razorpay_order_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  course_id VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- User courses table (for access control)
CREATE TABLE user_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  course_id VARCHAR(255) NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_course (user_id, course_id)
);
```

## Usage

### Adding Courses to Cart
```jsx
import { useCart } from '../context/CartContext';

const { addToCart } = useCart();

// Add a course to cart
addToCart({
  id: 'course-1',
  title: 'Python Basics',
  price: 1500,
  description: 'Learn Python fundamentals'
});
```

### Protecting Premium Content
```jsx
import CourseAccessControl from '../components/CourseAccessControl';

<CourseAccessControl course={courseData}>
  {/* Your premium course content */}
  <div>Premium content here...</div>
</CourseAccessControl>
```

### Processing Payments
```jsx
import PaymentService from '../services/paymentService';

const handlePayment = async () => {
  const orderData = {
    courseIds: ['course-1', 'course-2'],
    amount: 3000 * 100, // Convert to paise
    currency: 'INR',
    description: 'Course Purchase'
  };

  try {
    const result = await PaymentService.processPayment(orderData, user);
    if (result.success) {
      console.log('Payment successful!');
    }
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

## Testing

### Test Cards (Razorpay Test Mode)
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **Expiry**: Any future date
- **CVV**: Any 3 digits

### Test UPI
- Use any valid UPI ID in test mode

## Security Considerations

1. **Never expose your secret key** in frontend code
2. **Always verify payments** on the backend
3. **Use HTTPS** in production
4. **Validate all inputs** before processing
5. **Implement proper error handling**

## Production Deployment

1. Switch to live Razorpay keys
2. Update `REACT_APP_API_BASE_URL` to production URL
3. Ensure HTTPS is enabled
4. Set up webhook endpoints for payment notifications
5. Implement proper logging and monitoring

## Troubleshooting

### Common Issues

1. **Payment fails**: Check if Razorpay keys are correct
2. **Access denied**: Verify user authentication
3. **Cart not persisting**: Check localStorage permissions
4. **API errors**: Verify backend endpoints are working

### Debug Mode
Enable debug logging by adding this to your browser console:
```javascript
localStorage.setItem('debug', 'payment:*');
```

## Support

For issues related to:
- **Razorpay**: Contact Razorpay support
- **Frontend**: Check browser console for errors
- **Backend**: Verify API endpoints and database connections 