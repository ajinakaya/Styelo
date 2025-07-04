import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/authconetxt";
import Navbar from "../layout/navbar";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { authToken } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("DIRECT_BANK_TRANSFER");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [createdOrderNumber, setCreatedOrderNumber] = useState(null);

  useEffect(() => {
    if (location.state) {
      setOrderData(location.state);
    } else {
      navigate("/checkout");
    }
  }, [location.state, navigate]);

  if (!orderData) return <div>Loading...</div>;

  const { selectedShipping, formData, total } = orderData;

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/order/create",
        {
          shippingMethod: selectedShipping.method,
          shippingAddress: formData,
          paymentMethod: paymentMethod,
          items: cart.map((item) => ({
            furnitureId: item.furniture._id,
            quantity: item.quantity,
            price: item.furniture.price,
          })),
          total: total,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data) {
        const { orderNumber } = response.data;
        setCreatedOrderNumber(orderNumber);
        setShowSuccess(true);

        setTimeout(() => {
          clearCart();
          navigate(`/order-confirmation/${orderNumber}`);
        }, 3000);
      }
    } catch (error) {
      console.error("Order failed", error);
      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.furniture.price * item.quantity,
    0
  );

  const qrData = `Bank: Nepal Investment Bank\nAccount Name: STYELO Furniture\nAccount Number: 1234567890123\nAmount: Rs. ${total.toLocaleString()}\nReference: ORD-${Date.now().toString().slice(-6)}`;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-poppins">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <nav className="flex items-center justify-center space-x-2 text-[20px] text-black font-medium mb-10">
            <span>Shipping</span>
            <span>&gt;</span>
            <span>Details</span>
            <span>&gt;</span>
            <span>Payment</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="bg-white rounded-lg border border-black/30 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-black/50 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="DIRECT_BANK_TRANSFER"
                      checked={paymentMethod === "DIRECT_BANK_TRANSFER"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>Direct Bank Transfer</span>
                  </label>
                  <label className="flex items-center p-3 border border-black/50 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {/* Bank Transfer Details */}
              {paymentMethod === "DIRECT_BANK_TRANSFER" && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                  <h4 className="font-medium mb-3 text-blue-800">
                    Bank Transfer Instructions
                  </h4>
                  <div className="text-sm space-y-2 text-blue-700">
                    <p>
                      Please transfer the total amount to the following account:
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <p>
                        <strong>Bank Name:</strong> Nepal Investment Bank
                      </p>
                      <p>
                        <strong>Account Name:</strong> STYELO Furniture
                      </p>
                      <p>
                        <strong>Account Number:</strong> 1234567890123
                      </p>
                      <p>
                        <strong>Amount:</strong> Rs. {total.toLocaleString()}
                      </p>
                      <p>
                        <strong>Reference:</strong> ORD-
                        {Date.now().toString().slice(-6)}
                      </p>
                    </div>
                    <p className="text-xs text-blue-600">
                      Please keep the transaction receipt and send it to our
                      WhatsApp: +977-9801234567
                    </p>
                  </div>
                </div>
              )}

              {/* COD Details */}
              {paymentMethod === "CASH_ON_DELIVERY" && (
                <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                  <h4 className="font-medium mb-2 text-green-800">
                    Cash on Delivery
                  </h4>
                  <p className="text-sm text-green-700">
                    Pay Rs. {total.toLocaleString()} when your order is
                    delivered to your doorstep.
                  </p>
                </div>
              )}

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-3">Customer Information</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Name:</strong> {formData.firstName}{" "}
                    {formData.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {formData.streetAddress},{" "}
                    {formData.city}
                  </p>
                  <p>
                    <strong>Shipping:</strong> {selectedShipping.method}
                  </p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-black/80 text-white py-3 px-4 rounded-md hover:bg-black transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : `Place Order - Rs. ${total.toLocaleString()}`}
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-black/30 p-6 h-fit">
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
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size:{" "}
                      {item.furniture.specifications?.dimensions?.overall}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Color:</span>
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{
                          backgroundColor:
                            item.furniture.colorOptions?.[0]?.colorCode ||
                            "#000",
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

              {/* QR Code */}
              {paymentMethod === "DIRECT_BANK_TRANSFER" && (
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-center font-medium mb-3">Scan to Pay</h4>
                  <div className="flex justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        qrData
                      )}`}
                      alt="QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-xs text-center text-gray-600 mt-2">
                    Scan using your mobile banking app to pay
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-[#D9D9D980] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center relative">
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-yellow-700" />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">
                Your order has been placed!
              </h3>
              <p className="text-gray-600 mb-6">
                Hi {formData.firstName}, we're processing your order!
                {paymentMethod === "DIRECT_BANK_TRANSFER"
                  ? " Please complete the bank transfer and send us the receipt."
                  : " We will deliver your order soon."}
              </p>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate(`/order-confirmation/${createdOrderNumber}`);
                }}
                className="bg-black/80 text-white px-8 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                View Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Payment;
