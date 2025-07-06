import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Star, Plus, Minus,  ChevronDown, ChevronUp
} from 'lucide-react';
import Navbar from '../layout/navbar';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSpecification, setShowSpecification] = useState(false);
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchProduct = async () => {
    try {
      console.log("Fetching:", id);
      const res = await fetch(`http://localhost:3001/furniture/${id}`);
      console.log("Status:", res.status);
      const data = await res.json();
      console.log("Data:", data);
      setProduct(data);
      setLoading(false);  
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load product.");
      setLoading(false);  
    }
  };

  fetchProduct();
}, [id]);


  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!product) return null;

  const selectedVariant = product.colorOptions.find(c => c.color === selectedColor);
  const images = selectedVariant?.furnitureimages || [];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-2 lg:w-20">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={`http://localhost:3001/${image}`}
                    alt={`Product view ${index + 1}`}
                    className="w-16 h-16 object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={`http://localhost:3001/${images[selectedImage]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <div className="text-2xl font-bold">Rs. {product.price}</div>

            <p className="text-gray-600">{product.description.summary}</p>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex gap-3">
                {product.colorOptions.map(c => (
                  <button
                    key={c.color}
                    onClick={() => {
                      setSelectedColor(c.color);
                      setSelectedImage(0);
                    }}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === c.color ? 'border-gray-900' : 'border-gray-300'}`}
                    style={{ backgroundColor: c.colorCode || "#ccc" }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button onClick={decrementQuantity} className="p-2 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                <span className="px-4">{quantity}</span>
                <button onClick={incrementQuantity} className="p-2 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-black">
                Add To Cart
              </button>
            </div>

            {/* Product Overview */}
            <div className="grid grid-cols-2 gap-4">
              {product.productOverview.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {item.icon && <img src={`http://localhost:3001/${item.icon}`} alt="icon" className="w-5 h-5" />}
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Accordion Section */}
        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              {product.features?.map((f, i) => (
                <li key={i} className="text-gray-700">{f.label}: {f.value}</li>
              ))}
            </ul>
          </div>

          {/* Specification */}
          <div className="border rounded-lg">
            <button
              onClick={() => setShowSpecification(!showSpecification)}
              className="w-full flex items-center justify-between p-4"
            >
              <span className="font-semibold">Specification</span>
              {showSpecification ? <ChevronUp /> : <ChevronDown />}
            </button>
            {showSpecification && (
              <div className="p-4 border-t">
                <p><strong>Dimensions:</strong> {product.specifications.dimensions?.overall}</p>
                <p><strong>Weight:</strong> {product.specifications.dimensions?.overallProductWeight}</p>
                {product.specifications.dimensions?.additionalDimensions?.map((d, i) => (
                  <p key={i}>{d.label}: {d.value}</p>
                ))}
              </div>
            )}
          </div>

          {/* Return Policy */}
          <div className="border rounded-lg">
            <button
              onClick={() => setShowReturnPolicy(!showReturnPolicy)}
              className="w-full flex items-center justify-between p-4"
            >
              <span className="font-semibold">Return Policy</span>
              {showReturnPolicy ? <ChevronUp /> : <ChevronDown />}
            </button>
            {showReturnPolicy && product.returnPolicy && (
              <div className="p-4 border-t text-gray-700 whitespace-pre-line">
                {product.returnPolicy.policyText}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
