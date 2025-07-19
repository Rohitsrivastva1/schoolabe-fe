import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PaymentService from '../services/paymentService';
import { FaLock, FaCreditCard, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './CourseAccessControl.css';

const CourseAccessControl = ({ course, children }) => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [course, user]);

  const checkAccess = async () => {
    if (!user) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    if (!course.isPremium) {
      setHasAccess(true);
      setLoading(false);
      return;
    }

    try {
      const response = await PaymentService.checkCourseAccess(course.id);
      setHasAccess(response.hasAccess);
    } catch (error) {
      console.error('Error checking course access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase this course');
      return;
    }

    setProcessing(true);

    try {
      const orderData = {
        courseIds: [course.id],
        amount: course.price * 100, // Convert to paise
        currency: 'INR',
        description: `Purchase of ${course.title}`,
        userEmail: user.email,
        userName: user.name
      };

      const result = await PaymentService.processPayment(orderData, user);
      
      if (result.success) {
        toast.success('Payment successful! You now have access to this course.');
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Purchase failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="access-loading">
        <div className="loading-spinner"></div>
        <p>Checking access...</p>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="access-control">
      <div className="access-overlay">
        <div className="access-content">
          <div className="access-icon">
            <FaLock />
          </div>
          <h2>Premium Course</h2>
          <p>This course requires a purchase to access the full content.</p>
          
          <div className="course-preview">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className="course-price">
              <span className="price">₹{course.price}</span>
              <span className="original-price">₹{course.price + 500}</span>
            </div>
          </div>

          <div className="access-actions">
            {user ? (
              <button
                className="purchase-btn"
                onClick={handlePurchase}
                disabled={processing}
              >
                {processing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <FaCreditCard />
                    Purchase Course
                  </>
                )}
              </button>
            ) : (
              <div className="login-prompt">
                <FaLock />
                <p>Please login to purchase this course</p>
              </div>
            )}
          </div>

          <div className="access-benefits">
            <h4>What you'll get:</h4>
            <ul>
              <li><FaCheck /> Full course access</li>
              <li><FaCheck /> Lifetime access</li>
              <li><FaCheck /> Certificate of completion</li>
              <li><FaCheck /> 24/7 support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAccessControl; 