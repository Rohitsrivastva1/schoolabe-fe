import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MembershipApi from '../api/membershipApi';
import PaymentService from '../services/paymentService';
import { toast } from 'react-toastify';
import { 
  FaCrown, 
  FaCheck, 
  FaCode, 
  FaGraduationCap, 
  FaHeadset, 
  FaChartLine,
  FaLock,
  FaSpinner
} from 'react-icons/fa';
import './MembershipPlans.css';

const MembershipPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState(null);

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchMembershipStatus();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const response = await MembershipApi.getAvailablePlans();
      if (response.success) {
        setPlans(response.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load membership plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembershipStatus = async () => {
    try {
      const response = await MembershipApi.getMembershipStatus();
      if (response.success) {
        setMembershipStatus(response.membership);
      }
    } catch (error) {
      console.error('Error fetching membership status:', error);
    }
  };

  const handleSubscribe = async (planType) => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }

    if (membershipStatus?.isPremium) {
      toast.error('You already have an active subscription');
      return;
    }

    setProcessing(true);

    try {
      // Create subscription order
      const orderResponse = await MembershipApi.createSubscriptionOrder(planType);
      
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const plan = plans.find(p => p.type === planType);
      
      // Process payment using Razorpay
      const orderData = {
        orderId: orderResponse.order.id,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        description: `Schoolabe ${plan.name}`,
        planType: planType
      };

      const result = await PaymentService.processMembershipPayment(orderData, user);
      
      if (result.success) {
        toast.success('Subscription activated successfully!');
        fetchMembershipStatus(); // Refresh membership status
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Subscription failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!membershipStatus?.isPremium) {
      toast.error('No active subscription to cancel');
      return;
    }

    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        const response = await MembershipApi.cancelSubscription();
        if (response.success) {
          toast.success('Subscription cancelled successfully');
          fetchMembershipStatus();
        }
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        toast.error('Failed to cancel subscription');
      }
    }
  };

  const formatPrice = (amount) => {
    return `₹${(amount / 100).toLocaleString()}`;
  };

  const getFeatureIcon = (feature) => {
    switch (feature) {
      case 'codeEditor':
        return <FaCode />;
      case 'premiumCourses':
        return <FaGraduationCap />;
      case 'prioritySupport':
        return <FaHeadset />;
      case 'advancedAnalytics':
        return <FaChartLine />;
      default:
        return <FaCheck />;
    }
  };

  if (loading) {
    return (
      <div className="membership-loading">
        <FaSpinner className="spinner" />
        <p>Loading membership plans...</p>
      </div>
    );
  }

  return (
    <div className="membership-container">
      <div className="membership-header">
        <h1>
          <FaCrown className="crown-icon" />
          Choose Your Plan
        </h1>
        <p>Unlock premium features and accelerate your learning journey</p>
        
        {membershipStatus?.isPremium && (
          <div className="current-plan-banner">
            <FaCrown />
            <span>
              You have an active {membershipStatus.currentPlan} plan
              {membershipStatus.premiumExpiresAt && (
                <span> (expires {new Date(membershipStatus.premiumExpiresAt).toLocaleDateString()})</span>
              )}
            </span>
            <button 
              onClick={handleCancelSubscription}
              className="cancel-subscription-btn"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div 
            key={plan.type} 
            className={`plan-card ${plan.type === 'yearly' ? 'featured' : ''}`}
          >
            {plan.type === 'yearly' && (
              <div className="featured-badge">
                <FaCrown />
                Best Value
              </div>
            )}
            
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span className="price">{formatPrice(plan.amount)}</span>
                <span className="duration">/{plan.type === 'weekly' ? 'week' : plan.type === 'monthly' ? 'month' : 'year'}</span>
              </div>
            </div>

            <div className="plan-features">
              <h4>What's included:</h4>
              <ul>
                <li>
                  <FaCode />
                  <span>Advanced Code Editor</span>
                </li>
                <li>
                  <FaGraduationCap />
                  <span>Premium Course Access</span>
                </li>
                <li>
                  <FaHeadset />
                  <span>Priority Support</span>
                </li>
                <li>
                  <FaChartLine />
                  <span>Advanced Analytics</span>
                </li>
              </ul>
            </div>

            <div className="plan-actions">
              {membershipStatus?.isPremium ? (
                <button className="plan-btn disabled" disabled>
                  <FaLock />
                  Already Subscribed
                </button>
              ) : (
                <button 
                  className={`plan-btn ${plan.type === 'yearly' ? 'featured' : ''}`}
                  onClick={() => handleSubscribe(plan.type)}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <FaSpinner className="spinner" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCrown />
                      Subscribe Now
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="membership-footer">
        <h3>Why Choose Premium?</h3>
        <div className="benefits-grid">
          <div className="benefit">
            <FaCode />
            <h4>Advanced Code Editor</h4>
            <p>Access to our premium Monaco-based code editor with syntax highlighting, autocomplete, and debugging tools.</p>
          </div>
          <div className="benefit">
            <FaGraduationCap />
            <h4>Premium Courses</h4>
            <p>Unlock exclusive courses and advanced tutorials not available to free users.</p>
          </div>
          <div className="benefit">
            <FaHeadset />
            <h4>Priority Support</h4>
            <p>Get faster response times and dedicated support for all your learning needs.</p>
          </div>
          <div className="benefit">
            <FaChartLine />
            <h4>Advanced Analytics</h4>
            <p>Track your progress with detailed analytics and personalized learning insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;
