import React, { useState } from 'react';
import axios from 'axios';
import PaymentModal from './PaymentModal';

const OnboardingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ phoneNumber: '', name: '', age: '', bio: '', photos: [] });
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: files.map(file => URL.createObjectURL(file)) }); // Simple URL for preview
  };

  const handleSubmit = async () => {
    if (!formData.phoneNumber.match(/^254[0-9]{9}$/)) { // Kenyan phone validation
      setError('Invalid phone number format.');
      return;
    }
    try {
      const res = await axios.post('/api/auth/register', formData);
      const userId = res.data.userId;
      const paymentRes = await axios.post('/api/payments/initiate-stk', { phoneNumber: formData.phoneNumber, userId });
      setShowPayment(true); // Show payment modal
    } catch (err) {
      setError('Network error or invalid data. Please try again.');
    }
  };

  return (
    <div className="p-6">
      {error && <p className="text-red-500">{error}</p>}
      {step === 1 && (
        <div>
          <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleInputChange} className="p-2 bg-gray-800 rounded" />
          <input type="text" name="name" placeholder="Name" onChange={handleInputChange} className="p-2 bg-gray-800 rounded mt-4" />
          <input type="number" name="age" placeholder="Age" onChange={handleInputChange} className="p-2 bg-gray-800 rounded mt-4" />
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <textarea name="bio" placeholder="Bio" onChange={handleInputChange} className="p-2 bg-gray-800 rounded" />
          <input type="file" multiple onChange={handlePhotoUpload} className="mt-4" /> {/* Drag-and-drop can be added with libraries */}
          <button onClick={handleSubmit} className="bg-[#FF3E6E] px-4 py-2 rounded mt-4">Submit</button>
        </div>
      )}
      {showPayment && <PaymentModal phoneNumber={formData.phoneNumber} />}
    </div>
  );
};

export default OnboardingForm;