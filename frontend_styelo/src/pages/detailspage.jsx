import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../layout/navbar";
import { useCart } from "../context/cartcontext";
import { toast } from "react-toastify";
import Footer from "../layout/footer";
import Recommended from "../components/Recommendation";


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
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/furniture/${id}`);
        const data = await res.json();
        setProduct(data);

        if (data.colorOptions && data.colorOptions.length > 0) {
          setSelectedColor(data.colorOptions[0].color);
        }

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load product.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleAddToCart = async (furnitureId) => {
    try {
      await addToCart(furnitureId, quantity);
      toast.success("Added to cart successfully");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!product) return null;

  const selectedVariant = product.colorOptions.find(
    (c) => c.color === selectedColor
  );
  const images = selectedVariant?.furnitureimages || [];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-9 font-poppins">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-55">
          {/* Product Images */}
          <div className="flex flex-col-reverse lg:flex-row gap-5">
            {/* Thumbnail Images */}
            <div className="flex lg:flex-col gap-2 lg:w-24 lg:min-w-[96px] max-h-[600px] overflow-y-auto flex-shrink-0 pr-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden flex-shrink-0 ${
                    selectedImage === index
                      ? "border-black/70"
                      : "border-black/20"
                  }`}
                >
                  <img
                    src={`http://localhost:3001/${image}`}
                    alt={`Product view ${index + 1}`}
                    className="w-[90px] h-[90px] object-cover bg-white rounded flex-shrink-0"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1">
              <div className="relative max-w-[580px] h-[590px] aspect-square rounded-lg overflow-hidden bg-white border border-black/20 mx-auto">
                {images.length > 0 ? (
                  <img
                    src={`http://localhost:3001/${images[selectedImage]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-[35px] font-Regular text-black">
                {product.name}
              </h1>
              <div className="text-[26px] font-Regular text-black/85 mt-0">
                Rs. {product.price}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">5 Customer Review</span>
            </div>

            <p className="text-black/80 font-Regular text-[15px]">
              {product.description.summary}
            </p>

            <p className="text-[15px] text-black mb-1 font-Regular">
              Size:{" "}
              <span className="text-black">
                {product.specifications?.dimensions?.overall}
              </span>
            </p>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex gap-3">
                {product.colorOptions.map((c) => (
                  <button
                    key={c.color}
                    onClick={() => {
                      setSelectedColor(c.color);
                      setSelectedImage(0);
                    }}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === c.color
                        ? "border-black/70"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c.colorCode || "#ccc" }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-black/35 rounded-md h-10 w-30">
                <button onClick={decrementQuantity} className="p-3 ">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4">{quantity}</span>
                <button onClick={incrementQuantity} className="p-3 ">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => handleAddToCart(product._id)}
                className="h-10 w-52 bg-black/80 text-white text-sm rounded-md hover:bg-black/85 flex items-center justify-center"
              >
                Add To Cart
              </button>
            </div>

            {/* At a Glance */}
            <div>
              <h3 className="text-[20px] font-medium mb-3">At a Glance</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.productOverview.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.icon && (
                      <img
                        src={`http://localhost:3001/${item.icon}`}
                        alt="icon"
                        className="w-8 h-8"
                      />
                    )}
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 text-Regular leading-relaxed">
              {product.description.description}
            </p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              {product.description.features?.map((feature, i) => (
                <li key={i} className="text-gray-700">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Specification */}
          <div className="border  border-black/40 rounded-lg">
            <button
              onClick={() => setShowSpecification(!showSpecification)}
              className="w-full flex items-center justify-between p-4"
            >
              <span className="font-semibold">Specification</span>
              {showSpecification ? <ChevronUp /> : <ChevronDown />}
            </button>
            {showSpecification && (
              <div className="p-4 border-t  border-black/40">
                {(product.specifications.dimensions?.additionalDimensions
                  ?.length > 0 ||
                  product.specifications.dimensions?.overall ||
                  product.specifications.dimensions?.overallProductWeight) && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">All Dimensions</h3>

                    {product.specifications.specificationImage && (
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <img
                          src={`http://localhost:3001/${product.specifications.specificationImage}`}
                          alt="Product Dimensions"
                          className="w-full max-w-[566px] h-auto mx-auto object-contain"
                        />
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <tbody>
                          {product.specifications.dimensions.additionalDimensions?.map(
                            (dimension, i) => (
                              <tr key={i} className="border-b border-gray-300">
                                <td className="px-4 py-2 font-medium bg-gray-50 border-r border-gray-300">
                                  {dimension.label}
                                </td>
                                <td className="px-4 py-2">{dimension.value}</td>
                              </tr>
                            )
                          )}
                          {product.specifications.dimensions?.overall && (
                            <tr className="border-b border-gray-300">
                              <td className="px-4 py-2 font-medium bg-gray-50 border-r border-gray-300">
                                Overall Dimensions
                              </td>
                              <td className="px-4 py-2">
                                {product.specifications.dimensions.overall}
                              </td>
                            </tr>
                          )}
                          {product.specifications.dimensions
                            ?.overallProductWeight && (
                            <tr className="border-b border-gray-300">
                              <td className="px-4 py-2 font-medium bg-gray-50 border-r border-gray-300">
                                Overall Product Weight
                              </td>
                              <td className="px-4 py-2">
                                {
                                  product.specifications.dimensions
                                    .overallProductWeight
                                }
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {product.specifications.details?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Details</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <tbody>
                          {product.specifications.details.map((detail, i) => (
                            <tr key={i} className="border-b border-gray-300">
                              <td className="px-4 py-2 font-medium bg-gray-50 border-r border-gray-300">
                                {detail.label}
                              </td>
                              <td className="px-4 py-2">{detail.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Return Policy */}
          <div className="border border-black/40 rounded-lg">
            <button
              onClick={() => setShowReturnPolicy(!showReturnPolicy)}
              className="w-full flex items-center justify-between p-4"
            >
              <span className="font-semibold">Return Policy</span>
              {showReturnPolicy ? <ChevronUp /> : <ChevronDown />}
            </button>

            {showReturnPolicy && product.returnPolicy && (
              <div className="p-4 border-t border-black/40 text-gray-700 space-y-4">
                {/* Icon (if available) */}
                {product.returnPolicy.icon && (
                  <div className="flex items-center gap-2">
                    <img
                      src={`http://localhost:3001/${product.returnPolicy.icon}`}
                      alt="Return Policy Icon"
                      className="w-15 h-15"
                    />
                    <span className="text-lg font-semibold">
                      {product.returnPolicy.title}
                    </span>
                  </div>
                )}

                {!product.returnPolicy.icon && (
                  <h3 className="text-lg font-semibold">
                    {product.returnPolicy.title}
                  </h3>
                )}

                {/* Description */}
                <p className="whitespace-pre-line">
                  {product.returnPolicy.description}
                </p>

                {/* Duration */}
                <p>
                  <strong>Return Back:</strong> {product.returnPolicy.duration}
                </p>

                {/* Conditions */}
                {product.returnPolicy.conditions &&
                  product.returnPolicy.conditions.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">Conditions:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.returnPolicy.conditions.map(
                          (condition, index) => (
                            <li key={index}>{condition}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Recommended />
      <Footer />
    </>

  );
};

export default ProductDetails;
