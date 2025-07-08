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
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "streetAddress",
      "city",
      "province",
      "phone",
      "email",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
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

    navigate("/payment", {
      state: {
        selectedShipping,
        formData,
        total,
        subtotal,
      },
    });
     window.location.reload();
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-15 bg-white font-poppins">
        <div className="text-center mb-10">
          <h2 className="text-xl">
            <span className="text-black font-medium">Shipping</span> &gt;{" "}
            <span
              className={`${
                selectedShipping ? "text-black font-medium" : "text-gray-400"
              }`}
            >
              Details
            </span>{" "}
            &gt; <span className="text-gray-400 font-Regular">Payment</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Shipping + Billing */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>
            <div className="border-t border-gray-300 pt-4">
              {shippingOptions.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 cursor-pointer p-2 rounded"
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedShipping?.method === option.method}
                    onChange={() => setSelectedShipping(option)}
                    className="text-black"
                  />
                  <span>
                    {option.method} - Rs. {option.cost}
                  </span>
                </label>
              ))}
            </div>

            {selectedShipping && (
              <>
                <h3 className="text-lg font-semibold mb-2 pt-10">
                  Billing Details
                </h3>
                <div className="pt-6 border-t border-gray-300">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName || ""}
                          onChange={handleChange}
                          type="text"
                          className={`w-full border border-gray-300 p-2 rounded-md focus:outline-none ${
                            errors.firstName ? "border-red-500" : ""
                          }`}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div className="w-1/2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName || ""}
                          onChange={handleChange}
                          type="text"
                          className={`w-full border border-gray-300 p-2 rounded-md focus:outline-none ${
                            errors.lastName ? "border-red-500" : ""
                          }`}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
                      <input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName || ""}
                        onChange={handleChange}
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country / Region</label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
                      >
                        <option value="">Select Country</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Nepal">India</option>
                        <option value="Nepal">China</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                      <input
                        id="streetAddress"
                        name="streetAddress"
                        value={formData.streetAddress || ""}
                        onChange={handleChange}
                        type="text"
                        className={`w-full border border-gray-300 p-2 rounded-md focus:outline-none ${
                          errors.streetAddress ? "border-red-500" : ""
                        }`}
                      />
                      {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Town / City *</label>
                      <input
                        id="city"
                        name="city"
                        value={formData.city || ""}
                        onChange={handleChange}
                        type="text"
                        className={`w-full border border-gray-300 p-2 rounded-md focus:outline-none ${
                          errors.city ? "border-red-500" : ""
                        }`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                      <select
                        id="province"
                        name="province"
                        value={formData.province || ""}
                        onChange={handleChange}
                        className={`w-full border border-gray-300 p-2 rounded-md focus:outline-none ${
                          errors.province ? "border-red-500" : ""
                        }`}
                      >
                        <option value="" disabled>
                          Select Province
                        </option>
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
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        type="text"
                        className={`w-full border border-gray-300 p-2 rounded-md ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        id="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        type="email"
                        className={`w-full border border-gray-300 p-2 rounded-md focus:outline-none ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information (Optional)</label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo || ""}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-gray-300 p-2 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="border border-black/30 p-7 rounded h-fit bg-white mt-10">
            <h3 className="text-center text-lg font-semibold mb-4">
              ORDER SUMMARY
            </h3>
            {cart.map((item, i) => (
              <div
                className="border-b border-gray-300 pb-4 mb-4 flex gap-4 items-start"
                key={i}
              >
                <img
                  src={`http://localhost:3001/${item.furniture.thumbnail}`}
                  alt={item.furniture.name}
                  className="w-24 h-24 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.furniture.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.furniture.specifications?.dimensions?.overall}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Color:</span>
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{
                        backgroundColor:
                          item.furniture.colorOptions?.[0]?.colorCode || "#000",
                      }}
                    />
                  </div>
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
              <div className="flex justify-between text-lg pt-2 border-t border-gray-300 font-medium text-black">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                className="bg-black/75 text-white py-3 px-8 rounded hover:bg-black/80 transition-colors font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
