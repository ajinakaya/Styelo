import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../layout/navbar";
import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/authconetxt";

const Checkout = () => {
  const { cart } = useCart();
  const { authToken } = useAuth();

  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState({});

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

  const total = cart.reduce(
    (sum, item) => sum + item.furniture.price * item.quantity,
    0
  ) + (selectedShipping?.cost || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!selectedShipping || !paymentMethod) return alert("Fill required fields");

    try {
      const res = await axios.post(
        "http://localhost:3001/order/create",
        {
          shippingMethod: selectedShipping.method,
          shippingAddress: formData,
          paymentMethod: paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Order failed", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-10 font-poppins">
        {/* Breadcrumb */}
        <div className="text-center mb-10">
          <h2 className="text-xl">
            <span className={`${selectedShipping ? 'text-black font-semibold' : 'text-black'}`}>Shipping</span> &gt; 
            <span className={`${selectedShipping ? 'text-black font-semibold' : 'text-gray-400'}`}>Details</span> &gt; 
            <span className="text-gray-400">Order</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Shipping + Billing */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
            <div className="space-y-4 border p-5 rounded mb-6">
              {shippingOptions.map((option, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedShipping?.method === option.method}
                    onChange={() => setSelectedShipping(option)}
                  />
                  <span>{option.label} – Rs{option.cost}</span>
                </label>
              ))}
            </div>

            {selectedShipping && (
              <>
                <h3 className="text-lg font-semibold mb-4">Billing details</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input name="firstName" onChange={handleChange} type="text" placeholder="First Name" className="w-1/2 border p-2 rounded" />
                    <input name="lastName" onChange={handleChange} type="text" placeholder="Last Name" className="w-1/2 border p-2 rounded" />
                  </div>
                  <input name="companyName" onChange={handleChange} type="text" placeholder="Company Name (Optional)" className="w-full border p-2 rounded" />
                  <select name="country" onChange={handleChange} className="w-full border p-2 rounded">
                    <option>Nepal</option>
                  </select>
                  <input name="streetAddress" onChange={handleChange} type="text" placeholder="Street address" className="w-full border p-2 rounded" />
                  <input name="city" onChange={handleChange} type="text" placeholder="Town / City" className="w-full border p-2 rounded" />
                  <select name="province" onChange={handleChange} className="w-full border p-2 rounded">
                    <option disabled selected>Province</option>
                    <option>Province 1</option>
                    <option>Province 2</option>
                    <option>Bagmati</option>
                    <option>Gandaki</option>
                    <option>Lumbini</option>
                    <option>Karnali</option>
                    <option>Sudurpaschim</option>
                  </select>
                  <input name="phone" onChange={handleChange} type="text" placeholder="Phone" className="w-full border p-2 rounded" />
                  <input name="email" onChange={handleChange} type="email" placeholder="Email address" className="w-full border p-2 rounded" />
                  <textarea name="additionalInfo" onChange={handleChange} placeholder="Additional information" className="w-full border p-2 rounded" rows={3} />
                </div>
              </>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="border p-6 rounded shadow-sm h-fit">
            <h3 className="text-center text-lg font-semibold mb-4">ORDER SUMMARY</h3>
            {cart.map((item, i) => (
              <div className="border-b pb-4 flex gap-4 items-start" key={i}>
                <img src={item.furniture.thumbnail} alt={item.furniture.name} className="w-24 h-24 rounded object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.furniture.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-right font-medium text-black">Rs. {(item.furniture.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>Rs. {cart.reduce((sum, item) => sum + item.furniture.price * item.quantity, 0).toLocaleString()}</span>
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

            {selectedShipping && (
              <div className="mt-4">
                <label className="flex items-center space-x-3">
                  <input type="radio" name="payment" value="DIRECT_BANK_TRANSFER" onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Direct Bank Transfer</span>
                </label>
                <label className="flex items-center space-x-3 mt-2">
                  <input type="radio" name="payment" value="CASH_ON_DELIVERY" onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Cash On Delivery</span>
                </label>
              </div>
            )}

            <div className="text-center mt-6">
              <button
                className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition"
                onClick={handlePlaceOrder}
              >
                Place order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
