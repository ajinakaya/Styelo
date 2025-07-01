import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/ordercontext";
import Navbar from "../layout/navbar";

const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const OrderStatusTracker = ({ currentStatus }) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600 mt-6">
      {statusOrder.map((step, index) => {
        const isReached = statusOrder.indexOf(currentStatus) >= index;
        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div
              className={`w-5 h-5 rounded-full border-2 mb-1 ${
                isReached ? "bg-blue-600 border-blue-600" : "border-gray-300"
              }`}
            />
            <span
              className={`text-xs ${
                isReached ? "text-blue-700 font-semibold" : "text-gray-400"
              }`}
            >
              {step}
            </span>
            {index < statusOrder.length - 1 && (
              <div className={`w-full h-1 ${isReached ? "bg-blue-500" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const MyOrders = () => {
  const { orders, loading, error, fetchOrders, cancelOrder } = useOrder();
  const navigate = useNavigate();
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelClick = (e, order) => {
    e.stopPropagation();
    setOrderToCancel(order);
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (!orderToCancel) return;

    setCancellingOrder(orderToCancel.orderNumber);
    setShowCancelDialog(false);

    try {
      await cancelOrder(orderToCancel.orderNumber);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setCancellingOrder(null);
      setOrderToCancel(null);
    }
  };

  const cancelDialog = () => {
    setShowCancelDialog(false);
    setOrderToCancel(null);
  };

  const canCancelOrder = (status) => {
    return status === "PENDING" || status === "CONFIRMED";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED": return "border-l-green-500 bg-green-50";
      case "PENDING": return "border-l-orange-500 bg-orange-50";
      case "CANCELLED": return "border-l-red-500 bg-red-50";
      case "DELIVERED": return "border-l-blue-500 bg-blue-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-poppins">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-black/30 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                <p className="text-gray-600 mt-1">Manage and track your orders</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`bg-white/ rounded-xl shadow-sm border-l-4 ${getStatusColor(order.status)} overflow-hidden`}
              >
                <div 
                  className="p-6 cursor-pointer transition-colors"
                  
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "PENDING"
                            ? "bg-orange-100 text-orange-800"
                            : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : order.status === "DELIVERED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
                        <div className="mb-2 sm:mb-0">
                          <span className="text-gray-500">Order Date: </span>
                          <span className="font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </span>
                          <div>
                            <span className="text-gray-500">Total Amount: </span>
                            <span className="font-medium text-lg text-gray-900">
                              Rs. {order.total.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Payment Status: </span>
                            <span className="font-medium text-sm text-yellow-700">
                              {order.payment?.status || "PENDING"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {canCancelOrder(order.status) && (
                        <button
                          onClick={(e) => handleCancelClick(e, order)}
                          disabled={cancellingOrder === order.orderNumber}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          {cancellingOrder === order.orderNumber ? (
                            <span className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-red-300 border-t-red-700 rounded-full animate-spin"></div>
                              <span>Cancelling...</span>
                            </span>
                          ) : (
                            "Cancel Order"
                          )}
                        </button>
                      )}
                      <button className="px-4 py-2 bg-black/70 text-white rounded-lg hover:bg-black/75 transition-colors font-medium"
                      onClick={() => navigate(`/order-confirmation/${order.orderNumber}`)}
                      >
                        View Details
                        
                      </button>
                    </div>
                  </div>
                  <OrderStatusTracker currentStatus={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        {/* Cancel Confirmation */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-[#D9D9D960] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-3">Are you sure you want to cancel this order?</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">Order #{orderToCancel?.orderNumber}</p>
                  <p className="text-sm text-gray-600">Amount: Rs. {orderToCancel?.total?.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={cancelDialog}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Keep Order
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;