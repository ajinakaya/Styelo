import React, { useState } from 'react';
import { Star, Plus, Minus, ShoppingCart, User, Package, Wrench, Shield, ChevronDown, ChevronUp } from 'lucide-react';

// Mock components for Navbar and Footer
const Navbar = () => (
  <nav className="bg-white shadow-sm border-b">
    <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-black rounded"></div>
        <span className="text-xl font-bold">STYELO</span>
      </div>
      <div className="hidden md:flex space-x-8">
        <a href="#" className="text-gray-700 hover:text-black">Furniture</a>
        <a href="#" className="text-gray-700 hover:text-black">Decors</a>
        <a href="#" className="text-gray-700 hover:text-black">About</a>
        <a href="#" className="text-gray-700 hover:text-black">Contact</a>
      </div>
      <div className="flex items-center space-x-4">
        <User className="w-5 h-5 text-gray-700" />
        <Package className="w-5 h-5 text-gray-700" />
        <ShoppingCart className="w-5 h-5 text-gray-700" />
      </div>
    </div>
  </nav>
);

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('brown');
  const [quantity, setQuantity] = useState(1);
  const [showSpecification, setShowSpecification] = useState(false);
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);

  // Mock product data
  const product = {
    name: "Storage Bookcase",
    price: "Rs. 24,999.00",
    rating: 4.5,
    reviews: 5,
    size: "70×30×14 inches",
    colors: [
      { name: 'brown', color: 'bg-amber-700' },
      { name: 'black', color: 'bg-black' },
      { name: 'dark-brown', color: 'bg-amber-900' }
    ],
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
    ],
    description: "Designed with a unique rattan look, this bookshelf adds a touch of bohemian charm to any room in your home. The charming farmhouse bookcase features a tall design, 2 doors, 3 height adjustable shelves, and ample storage space, making it a perfect fit for living rooms, bedrooms, home offices and kitchens. It is not only a bookshelf or plant shelf but also a standing large storage shelf to meet your different needs.",
    features: [
      "Stylish rattan accents: with its farmhouse-inspired design and rattan accents, this bookshelf adds a touch of rustic charm to any living space. The combination of wood and rattan elements creates a unique and eye-catching aesthetic that complements various home decor styles.",
      "Abundant storage: this bookcase features three spacious open shelves that are ideal for storing and displaying all your home essentials. With 3 height-adjustable shelves within doors, you can easily personalize the bookshelf according to your storage needs, accommodating items of various sizes. This bookcase with doors, not only can keep your items, but protect your items from dust and other potential hazards.",
      "Safety first: the included anti-tip kit ensures stability and safety, preventing the bookshelf from tipping over, and making it suitable for households with children or pets.",
      "Premium quality materials: crafted from a high-quality thick MDF board, this bookshelf offers long-lasting durability and a sturdy structure, perfect for heavy books or decor items."
    ],
    specifications: {
      "Frame Material": "Manufactured Wood",
      "Shelf Weight Capacity": "44 lb.",
      "Assembly Tools Included": "Yes",
      "Tipover Restraint Device Included": "Yes",
      "Scratch Resistant": "Yes",
      "Assembly Required": "Yes"
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  return (
    <>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnail Images */}
            <div className="flex lg:flex-col gap-2 lg:w-20">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="w-16 h-16 lg:w-18 lg:h-18 object-cover"
                  />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">{product.name}</h1>
              <div className="text-2xl font-bold text-gray-900 mb-4">{product.price}</div>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : i < product.rating
                          ? 'text-yellow-400 fill-current opacity-50'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.reviews} Customer Review</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Size */}
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-900">Size: </span>
                <span className="text-sm text-gray-600">{product.size}</span>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 ${color.color} ${
                        selectedColor === color.name ? 'border-gray-900' : 'border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-black transition-colors duration-200"
                >
                  Add To Cart
                </button>
              </div>

              {/* At a Glance */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">At a Glance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Frame Material: Manufactured Wood</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Shelf Weight Capacity: 44 lb.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Assembly Tools Included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Scratch Resistant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Tipover Restraint Device Included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Assembly Required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description, Features, Specifications */}
        <div className="mt-16 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description} Class up your home with this 5-tier library bookcase!
            </p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="text-gray-600 leading-relaxed">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Specification Accordion */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setShowSpecification(!showSpecification)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <span className="font-semibold">Specification</span>
              {showSpecification ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {showSpecification && (
              <div className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Return Policy Accordion */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setShowReturnPolicy(!showReturnPolicy)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <span className="font-semibold">Return Policy</span>
              {showReturnPolicy ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {showReturnPolicy && (
              <div className="border-t border-gray-200 p-4">
                <div className="space-y-3 text-gray-600">
                  <p>• 30-day return policy from the date of delivery</p>
                  <p>• Items must be in original condition with all packaging</p>
                  <p>• Assembly tools and hardware must be included</p>
                  <p>• Customer is responsible for return shipping costs</p>
                  <p>• Refund will be processed within 5-7 business days after receiving the returned item</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;