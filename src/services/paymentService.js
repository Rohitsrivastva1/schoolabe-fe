import axiosInstance from '../api/axiosInstance';

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;
const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

class PaymentService {
  // Initialize Razorpay
  static loadRazorpay() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay'));
      document.body.appendChild(script);
    });
  }

  // Create order on backend
  static async createOrder(orderData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/payments/create-order`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Verify payment on backend
  static async verifyPayment(paymentData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/payments/verify`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Verify membership payment on backend
  static async verifyMembershipPayment(paymentData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/membership/verify-payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error verifying membership payment:', error);
      throw error;
    }
  }

  // Process payment using Razorpay
  static async processPayment(orderData, user) {
    try {
      // Load Razorpay if not already loaded
      if (!window.Razorpay) {
        await this.loadRazorpay();
      }

      // Create order on backend
      const orderResponse = await this.createOrder(orderData);
      
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: 'Schoolabe',
        description: orderData.description || 'Course Purchase',
        order_id: orderResponse.order.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#58a6ff'
        },
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderResponse.order.id,
              courseIds: orderData.courseIds
            };

            const verificationResponse = await this.verifyPayment(verificationData);
            
            if (verificationResponse.success) {
              return {
                success: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                message: 'Payment successful!'
              };
            } else {
              throw new Error(verificationResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            throw error;
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
          }
        }
      };

      // Open Razorpay modal
      const razorpay = new window.Razorpay(options);
      return new Promise((resolve, reject) => {
        razorpay.on('payment.failed', (response) => {
          reject(new Error('Payment failed: ' + response.error.description));
        });
        
        razorpay.on('payment.success', async (response) => {
          try {
            const result = await options.handler(response);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });

        razorpay.open();
      });

    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  // Process membership payment using Razorpay
  static async processMembershipPayment(orderData, user) {
    try {
      // Load Razorpay if not already loaded
      if (!window.Razorpay) {
        await this.loadRazorpay();
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Schoolabe',
        description: orderData.description || 'Membership Subscription',
        order_id: orderData.orderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#667eea'
        },
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planType: orderData.planType
            };

            const verificationResponse = await this.verifyMembershipPayment(verificationData);
            
            if (verificationResponse.success) {
              return {
                success: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                message: 'Membership activated successfully!'
              };
            } else {
              throw new Error(verificationResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            throw error;
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
          }
        }
      };

      // Open Razorpay modal
      const razorpay = new window.Razorpay(options);
      return new Promise((resolve, reject) => {
        razorpay.on('payment.failed', (response) => {
          reject(new Error('Payment failed: ' + response.error.description));
        });
        
        razorpay.on('payment.success', async (response) => {
          try {
            const result = await options.handler(response);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });

        razorpay.open();
      });

    } catch (error) {
      console.error('Membership payment processing error:', error);
      throw error;
    }
  }

  // Get user's purchased courses
  static async getPurchasedCourses() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/payments/my-courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
      throw error;
    }
  }

  // Check if user has purchased a specific course
  static async checkCourseAccess(courseId) {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/payments/access/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking course access:', error);
      throw error;
    }
  }
}

export default PaymentService; 