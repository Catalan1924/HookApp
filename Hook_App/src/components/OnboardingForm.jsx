import React, { useState } from 'react';
import PaymentModal from './PaymentModal';
import { ChevronRightIcon, PhotoIcon, UserIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const OnboardingForm = ({ onComplete }) => {
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
      // Simulate API call for demo
      setTimeout(() => {
        setShowPayment(true);
        onComplete();
      }, 1000);
    } catch {
      setError('Network error or invalid data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#16213E] p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Your Profile</h2>
          <p className="text-gray-300">Step {step} of 2</p>
          <div className="flex justify-center mt-4">
            <div className={`w-8 h-2 rounded-full mx-1 ${step >= 1 ? 'bg-[#FF3E6E]' : 'bg-gray-600'}`}></div>
            <div className={`w-8 h-2 rounded-full mx-1 ${step >= 2 ? 'bg-[#FF3E6E]' : 'bg-gray-600'}`}></div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number (254XXXXXXXXX)"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3E6E] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3E6E] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <input
                type="number"
                name="age"
                placeholder="Your Age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full pl-4 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3E6E] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#FF3E6E] hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105"
            >
              <span>Next</span>
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="relative">
              <ChatBubbleLeftRightIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleInputChange}
                rows="3"
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3E6E] focus:border-transparent resize-none"
              />
            </div>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="w-full flex items-center justify-center space-x-2 bg-white/20 border border-white/30 rounded-lg py-3 px-4 text-gray-300 cursor-pointer hover:bg-white/30 transition-colors"
              >
                <PhotoIcon className="h-5 w-5" />
                <span>Add Photos</span>
              </label>
              {formData.photos.length > 0 && (
                <p className="text-sm text-green-400 mt-2">{formData.photos.length} photo(s) selected</p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-[#FF3E6E] hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105"
            >
              Complete Profile
            </button>
          </div>
        )}

        {showPayment && <PaymentModal phoneNumber={formData.phoneNumber} />}
      </div>
    </div>
  );
};

export default OnboardingForm;