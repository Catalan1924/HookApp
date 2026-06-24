import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'; // Icons for feedback

const PaymentModal = ({ phoneNumber }) => {
  const [status, setStatus] = useState('initiating'); // initiating, success, failure

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get(`/api/user/status/${localStorage.getItem('userId')}`); // Assume userId is stored
        if (res.data.isPaid) setStatus('success');
      } catch (err) {
        setStatus('failure');
      }
    };
    const interval = setInterval(checkStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        {status === 'initiating' && (
          <div>
            <p>Final Step: Unlock HookApp with a small security fee.</p>
            <p>Amount: KSh 20</p>
            <p>Please check your phone for an M-Pesa prompt...</p>
            <div className="spinner border-4 border-[#FF3E6E] animate-spin rounded-full h-8 w-8 mx-auto mt-4" />
          </div>
        )}
        {status === 'success' && (
          <div className="text-green-500">
            <CheckCircleIcon className="h-12 w-12 mx-auto animate-bounce" />
            <p>Payment Received! Welcome to HookApp!</p>
          </div>
        )}
        {status === 'failure' && (
          <div className="text-red-500">
            <XCircleIcon className="h-12 w-12 mx-auto" />
            <p>Payment was not completed. Please try again.</p>
            <button onClick={() => window.location.reload()}>Retry Payment</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;