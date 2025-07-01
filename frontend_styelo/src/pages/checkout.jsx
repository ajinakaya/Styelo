import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/navbar";
import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/authconetxt";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { authToken } = useAuth();

  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchShippingRates();
  }, []);

  const fetchShippingRates = async () => {
    try {
      const res = await axios.get("http://localhost:3001/shippingrate");
      setShippingOptions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch shipping rates", err);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.furniture.price * item.quantity,
    0
  );

  const total = subtotal + (selectedShipping?.cost || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'streetAddress', 'city', 'province', 'phone', 'email'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!selectedShipping) {
      alert("Please select a shipping method");
      return;
    }

    if (!validateForm()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    navigate('/payment', {
      state: {
        selectedShipping,
        formData,
        total,
        subtotal
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-10 font-poppins">
        {/* Breadcrumb */}
        <div className="text-center mb-10">
          <h2 className="text-xl">
            <span className="text-black font-semibold">Shipping</span> &gt; 
            <span className={`${selectedShipping && Object.keys(formData).length > 0 ? 'text-black font-semibold' : 'text-gray-400'}`}>Details</span> &gt; 
            <span className="text-gray-400">Payment</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Shipping + Billing */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
            <div className="space-y-4 border p-5 rounded mb-6">
              {shippingOptions.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedShipping?.method === option.method}
                    onChange={() => setSelectedShipping(option)}
                    className="text-black focus:ring-black"
                  />
                  <span>{option.label} – Rs. {option.cost}</span>
                </label>
              ))}
            </div>

            {selectedShipping && (
              <>
                <h3 className="text-lg font-semibold mb-4">Billing Details</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <input 
                        name="firstName" 
                        onChange={handleChange} 
                        type="text" 
                        placeholder="First Name *" 
                        className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="w-1/2">
                      <input 
                        name="lastName" 
                        onChange={handleChange} 
                        type="text" 
                        placeholder="Last Name *" 
                        className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  
                  <input 
                    name="companyName" 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="Company Name (Optional)" 
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" 
                  />
                  
                  <select 
                    name="country" 
                    onChange={handleChange} 
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Nepal">Nepal</option>
                  </select>
                  
                  <div>
                    <input 
                      name="streetAddress" 
                      onChange={handleChange} 
                      type="text" 
                      placeholder="Street Address *" 
                      className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${errors.streetAddress ? 'border-red-500' : ''}`}
                    />
                    {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>}
                  </div>
                  
                  <div>
                    <input 
                      name="city" 
                      onChange={handleChange} 
                      type="text" 
                      placeholder="Town / City *" 
                      className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${errors.city ? 'border-red-500' : ''}`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <select 
                      name="province" 
                      onChange={handleChange} 
                      className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${errors.province ? 'border-red-500' : ''}`}
                    >
                      <option value="" disabled selected>Province *</option>
                      <option value="Province 1">Province 1</option>
                      <option value="Province 2">Province 2</option>
                      <option value="Bagmati">Bagmati</option>
                      <option value="Gandaki">Gandaki</option>
                      <option value="Lumbini">Lumbini</option>
                      <option value="Karnali">Karnali</option>
                      <option value="Sudurpaschim">Sudurpaschim</option>
                    </select>
                    {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                  </div>
                  
                  <div>
                    <input 
                      name="phone" 
                      onChange={handleChange} 
                      type="text" 
                      placeholder="Phone *" 
                      className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <input 
                      name="email" 
                      onChange={handleChange} 
                      type="email" 
                      placeholder="Email Address *" 
                      className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <textarea 
                    name="additionalInfo" 
                    onChange={handleChange} 
                    placeholder="Additional Information (Optional)" 
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" 
                    rows={3} 
                  />
                </div>
              </>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="border p-6 rounded shadow-sm h-fit">
            <h3 className="text-center text-lg font-semibold mb-4">ORDER SUMMARY</h3>
            {cart.map((item, i) => (
              <div className="border-b pb-4 mb-4 flex gap-4 items-start" key={i}>
                <img 
                  src={item.furniture.thumbnail} 
                  alt={item.furniture.name} 
                  className="w-24 h-24 rounded object-cover" 
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.furniture.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Rs. {item.furniture.price.toLocaleString()} each</p>
                </div>
                <p className="text-right font-medium text-black">
                  Rs. {(item.furniture.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
           

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs. {selectedShipping?.cost || 0}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                className="bg-black text-white py-3 px-8 rounded hover:bg-gray-800 transition-colors font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleProceedToPayment}
                disabled={!selectedShipping}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;