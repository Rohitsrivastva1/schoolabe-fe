import axiosInstance from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

class MembershipApi {
  // Get available membership plans
  static async getAvailablePlans() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/membership/plans`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  }

  // Create subscription order
  static async createSubscriptionOrder(planType) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/membership/create-order`, {
        planType
      });
      return response.data;
    } catch (error) {
      console.error('Error creating subscription order:', error);
      throw error;
    }
  }

  // Verify payment
  static async verifyPayment(paymentData) {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/membership/verify-payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Get membership status
  static async getMembershipStatus() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/membership/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching membership status:', error);
      throw error;
    }
  }

  // Cancel subscription
  static async cancelSubscription() {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/membership/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  // Check premium access
  static async checkPremiumAccess() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/membership/premium-access`);
      return response.data;
    } catch (error) {
      console.error('Error checking premium access:', error);
      throw error;
    }
  }
}

export default MembershipApi;
