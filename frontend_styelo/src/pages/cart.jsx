import React from "react";
import Navbar from "../layout/navbar";
import { useCart } from "../context/cartcontext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, loading, error, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.furniture.price * item.quantity,
      0
    );
  };

   const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (loading) return <div className="text-center py-20">Loading cart...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (cart.length === 0)
    return (
      <>
        <Navbar />
        <div className="text-center py-20 font-poppins text-lg">
          Your cart is empty.
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-10 font-poppins">
        <h1 className="text-3xl font-medium mb-8 text-center">Cart</h1>

        <div className="grid grid-cols-4 font-semibold text-sm border-b border-gray-300 py-2 text-center text-white bg-[#C69C6D] rounded">
          <div>PRODUCT</div>
          <div>QTY</div>
          <div>PRICE</div>
          <div>TOTAL PRICE</div>
        </div>

        {cart.map((item) => (
          <div
            key={item.furniture._id}
            className="grid grid-cols-4 items-center gap-4 border p-4 rounded my-4 shadow-sm"
          >
            <div className="flex gap-4 items-center">
              <img
                src={`http://localhost:3001/${item.furniture.thumbnail}`}
                alt={item.furniture.name}
                className="w-28 rounded shadow-md"
              />
              <div>
                <h2 className="font-semibold text-lg">
                  {item.furniture.name || "No name"}
                </h2>
                <p className="text-sm text-gray-600">Colors:</p>
                <div
                  className="w-4 h-4 rounded-full mb-1"
                  style={{
                    backgroundColor:
                      item.furniture.colorOptions?.[0]?.colorCode || "#ccc",
                  }}
                ></div>
                <p className="text-sm text-gray-600">
                  Size: {item.furniture.specifications?.dimensions?.overall}
                </p>
                <button className="text-xs text-gray-500 mt-1 mr-2">
                  Edit
                </button>
                <button
                  onClick={() => removeFromCart(item.furniture._id)}
                  className="text-xs text-red-600"
                >
                  Remove item
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  if (item.quantity > 1) {
                    addToCart(item.furniture._id, -1);
                  }
                }}
                className="px-2 py-1 border"
              >
                -
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button
                onClick={() => addToCart(item.furniture._id, 1)}
                className="px-2 py-1 border"
              >
                +
              </button>
            </div>

            <div className="text-center font-medium">
              Rs:{item.furniture.price.toLocaleString()}
            </div>
            <div className="text-center font-medium">
              Rs:{(item.furniture.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-10">
          <div className="border rounded-lg p-6 w-64 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Cart Totals</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>Rs:{calculateTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#C69C6D] mb-4">
              <span>Total</span>
              <span>Rs:{calculateTotal().toLocaleString()}</span>
            </div>
            <button 
            onClick={handleCheckout}
            className="bg-black/80 text-white w-full py-2 rounded">
              Check Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
