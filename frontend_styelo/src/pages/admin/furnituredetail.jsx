import React, { useState, useEffect } from "react";
import {
  Upload,
  Plus,
  X,
  Save,
  Package,
  FileText,
  Camera,
  Palette,
  Settings,
  Info,
} from "lucide-react";

const FurnitureUploadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: {
      summary: "",
      description: "",
      features: [""],
      whatIncluded: [""],

    },
    price: "",
    category: "",
    sector: "",
    returnPolicy: "",
    tags: [],
    thumbnail: null,
    colorOptions: [{ color: "", colorCode: "", furnitureimages: [] }],
    productOverview: [{ label: "", icon: null }],
    specifications: {
      specificationImage: null,
      dimensions: {
        overall: "",
        overallProductWeight: "",
        additionalDimensions: [{ label: "", value: "" }],
      },
      details: [{ label: "", value: "" }],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState({
    categories: [],
    sectors: [],
    returnPolicies: [],
  });
  const [apiError, setApiError] = useState(null);

  const availableTags = [
    "New Arrival",
    "Best Seller",
    "Featured",
    "Popular",
    "Recommended",
  ];

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        const [categoriesResponse, sectorsResponse, returnPoliciesResponse] =
          await Promise.all([
            fetch("http://localhost:3001/category/"),
            fetch("http://localhost:3001/sector/"),
            fetch("http://localhost:3001/returnpolicy/"),
          ]);

        if (
          !categoriesResponse.ok ||
          !sectorsResponse.ok ||
          !returnPoliciesResponse.ok
        ) {
          throw new Error("Failed to fetch data from one or more APIs");
        }

        const [categories, sectors, returnPolicies] = await Promise.all([
          categoriesResponse.json(),
          sectorsResponse.json(),
          returnPoliciesResponse.json(),
        ]);

        setApiData({
          categories,
          sectors,
          returnPolicies,
        });
      } catch (error) {
        console.error("Error fetching API data:", error);
        setApiError(error.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDescriptionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (field, files) => {
    if (field === "thumbnail") {
      setFormData((prev) => ({ ...prev, thumbnail: files[0] }));
    } else if (field === "specificationImage") {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          specificationImage: files[0],
        },
      }));
    }
  };

  const handleColorVariantChange = (index, field, value) => {
    const newColorOptions = [...formData.colorOptions];
    newColorOptions[index][field] = value;
    setFormData((prev) => ({ ...prev, colorOptions: newColorOptions }));
  };

  const handleColorVariantImages = (index, files) => {
    const newColorOptions = [...formData.colorOptions];
    newColorOptions[index].furnitureimages = Array.from(files);
    setFormData((prev) => ({ ...prev, colorOptions: newColorOptions }));
  };

  const addColorVariant = () => {
    setFormData((prev) => ({
      ...prev,
      colorOptions: [
        ...prev.colorOptions,
        { color: "", colorCode: "", furnitureimages: [] },
      ],
    }));
  };

  const removeColorVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      colorOptions: prev.colorOptions.filter((_, i) => i !== index),
    }));
  };

  const handleOverviewChange = (index, field, value) => {
    const newOverview = [...formData.productOverview];
    newOverview[index][field] = value;
    setFormData((prev) => ({ ...prev, productOverview: newOverview }));
  };

  const handleOverviewIcon = (index, file) => {
    const newOverview = [...formData.productOverview];
    newOverview[index].icon = file;
    setFormData((prev) => ({ ...prev, productOverview: newOverview }));
  };

  const addOverviewItem = () => {
    setFormData((prev) => ({
      ...prev,
      productOverview: [...prev.productOverview, { label: "", icon: null }],
    }));
  };

  const removeOverviewItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      productOverview: prev.productOverview.filter((_, i) => i !== index),
    }));
  };

  const handleSpecificationChange = (type, index, field, value) => {
    const newSpecs = { ...formData.specifications };
    if (type === "dimensions") {
      if (field === "overall" || field === "overallProductWeight") {
        newSpecs.dimensions[field] = value;
      } else {
        newSpecs.dimensions.additionalDimensions[index][field] = value;
      }
    } else if (type === "details") {
      newSpecs.details[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const addSpecificationItem = (type) => {
    const newSpecs = { ...formData.specifications };
    if (type === "dimensions") {
      newSpecs.dimensions.additionalDimensions.push({ label: "", value: "" });
    } else if (type === "details") {
      newSpecs.details.push({ label: "", value: "" });
    }
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const removeSpecificationItem = (type, index) => {
    const newSpecs = { ...formData.specifications };
    if (type === "dimensions") {
      newSpecs.dimensions.additionalDimensions =
        newSpecs.dimensions.additionalDimensions.filter((_, i) => i !== index);
    } else if (type === "details") {
      newSpecs.details = newSpecs.details.filter((_, i) => i !== index);
    }
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const toggleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();

    submitData.append("name", formData.name);
    submitData.append("description", JSON.stringify(formData.description));
    submitData.append("price", formData.price);
    submitData.append("category", formData.category);
    submitData.append("sector", formData.sector);
    submitData.append("returnPolicy", formData.returnPolicy);
    submitData.append("tags", JSON.stringify(formData.tags));

    submitData.append(
      "colorOptions",
      JSON.stringify(
        formData.colorOptions.map((opt) => ({
          color: opt.color,
          colorCode: opt.colorCode,
        }))
      )
    );

    submitData.append(
      "productOverview",
      JSON.stringify(
        formData.productOverview.map((item) => ({
          label: item.label,
        }))
      )
    );

    submitData.append(
      "specifications",
      JSON.stringify({
        ...formData.specifications,
        specificationImage: undefined,
      })
    );

    if (formData.thumbnail) {
      submitData.append("thumbnail", formData.thumbnail);
    }

    if (formData.specifications.specificationImage) {
      submitData.append(
        "specificationImage",
        formData.specifications.specificationImage
      );
    }

    formData.productOverview.forEach((item) => {
      if (item.icon) {
        submitData.append("productIcons", item.icon);
      }
    });

    formData.colorOptions.forEach((option) => {
      option.furnitureimages.forEach((image) => {
        submitData.append("furnitureimages", image);
      });
    });

    try {
      const response = await fetch("http://localhost:3001/furniture", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        alert("Furniture uploaded successfully!");
        // Reset form...
      } else {
        alert("Error uploading furniture");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading furniture");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
            <h1 className="text-3xl font-bold text-white">
              Upload New Furniture
            </h1>
            <p className="text-blue-100 mt-2">
              Add your furniture to the catalog with all details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Package className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Basic Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Furniture Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter furniture name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Detailed Description
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Summary
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.description.summary}
                            onChange={(e) =>
                              handleDescriptionChange("summary", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.description.description}
                            onChange={(e) =>
                              handleDescriptionChange(
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Features (one per line)
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.description.features}
                            onChange={(e) =>
                              handleDescriptionChange(
                                "features",
                                e.target.value
                              )
                            }
                            placeholder="Enter each feature on a new line"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            What’s Included (one per line)
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.description.whatIncluded}
                            onChange={(e) =>
                              handleDescriptionChange(
                                "whatIncluded",
                                e.target.value
                              )
                            }
                            placeholder="Enter each item on a new line"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select category</option>
                        {apiData.categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section *
                      </label>
                      <select
                        value={formData.sector}
                        onChange={(e) =>
                          handleInputChange("sector", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select section</option>
                        {apiData.sectors.map((sector) => (
                          <option key={sector._id} value={sector._id}>
                            {sector.sector}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Return Policy
                      </label>
                      <select
                        value={formData.returnPolicy}
                        onChange={(e) =>
                          handleInputChange("returnPolicy", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select return policy</option>
                        {apiData.returnPolicies.map((policy) => (
                          <option key={policy._id} value={policy._id}>
                            {policy.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                              formData.tags.includes(tag)
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Camera className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Thumbnail Image
                    </h2>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("thumbnail", e.target.files)
                      }
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload thumbnail image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                      {formData.thumbnail && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {formData.thumbnail.name}
                        </p>
                      )}
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Camera className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Specification Image
                    </h2>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload("specificationImage", e.target.files)
                      }
                      className="hidden"
                      id="specification-upload"
                    />
                    <label
                      htmlFor="specification-upload"
                      className="cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600">
                        Click to upload specification image
                      </p>
                      {formData.specifications?.specificationImage && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {formData.specifications.specificationImage.name}
                        </p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Product Overview */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Info className="h-5 w-5 text-blue-600 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Product Overview
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={addOverviewItem}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.productOverview.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 text-sm">
                            Item {index + 1}
                          </h4>
                          {formData.productOverview.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOverviewItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Label
                            </label>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) =>
                                handleOverviewChange(
                                  index,
                                  "label",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., Comfortable Seating"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Icon
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-500 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleOverviewIcon(index, e.target.files[0])
                                }
                                className="hidden"
                                id={`icon-upload-${index}`}
                              />
                              <label
                                htmlFor={`icon-upload-${index}`}
                                className="cursor-pointer"
                              >
                                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">
                                  Upload icon
                                </p>
                                {item.icon && (
                                  <p className="text-xs text-green-600 mt-1">
                                    ✓ {item.icon.name}
                                  </p>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Color Variants */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Palette className="h-5 w-5 text-blue-600 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Color Variants
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={addColorVariant}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Color
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {formData.colorOptions.map((option, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 text-sm">
                            Color {index + 1}
                          </h4>
                          {formData.colorOptions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeColorVariant(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color Name
                              </label>
                              <input
                                type="text"
                                value={option.color}
                                onChange={(e) =>
                                  handleColorVariantChange(
                                    index,
                                    "color",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Navy Blue"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color Code
                              </label>
                              <input
                                type="text"
                                value={option.colorCode}
                                onChange={(e) =>
                                  handleColorVariantChange(
                                    index,
                                    "colorCode",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="#1a365d"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Furniture Images
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-500 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) =>
                                  handleColorVariantImages(
                                    index,
                                    e.target.files
                                  )
                                }
                                className="hidden"
                                id={`images-upload-${index}`}
                              />
                              <label
                                htmlFor={`images-upload-${index}`}
                                className="cursor-pointer"
                              >
                                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">
                                  Upload images
                                </p>
                                {option.furnitureimages.length > 0 && (
                                  <p className="text-xs text-green-600 mt-1">
                                    ✓ {option.furnitureimages.length} files
                                  </p>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Settings className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Specifications
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Dimensions */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">
                        Dimensions
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Overall
                            </label>
                            <input
                              type="text"
                              value={formData.specifications.dimensions.overall}
                              onChange={(e) =>
                                handleSpecificationChange(
                                  "dimensions",
                                  null,
                                  "overall",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="72W x 36D x 30H"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Weight
                            </label>
                            <input
                              type="text"
                              value={
                                formData.specifications.dimensions
                                  .overallProductWeight
                              }
                              onChange={(e) =>
                                handleSpecificationChange(
                                  "dimensions",
                                  null,
                                  "overallProductWeight",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="45 lbs"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Additional Dimensions
                            </label>
                            <button
                              type="button"
                              onClick={() => addSpecificationItem("dimensions")}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="space-y-2">
                            {formData.specifications.dimensions.additionalDimensions.map(
                              (dim, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="text"
                                    value={dim.label}
                                    onChange={(e) =>
                                      handleSpecificationChange(
                                        "dimensions",
                                        index,
                                        "label",
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Label"
                                  />
                                  <input
                                    type="text"
                                    value={dim.value}
                                    onChange={(e) =>
                                      handleSpecificationChange(
                                        "dimensions",
                                        index,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Value"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeSpecificationItem(
                                        "dimensions",
                                        index
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-medium text-gray-900">
                          Details
                        </h3>
                        <button
                          type="button"
                          onClick={() => addSpecificationItem("details")}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {formData.specifications.details.map(
                          (details, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                value={details.label}
                                onChange={(e) =>
                                  handleSpecificationChange(
                                    "details",
                                    index,
                                    "label",
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Feature name"
                              />
                              <input
                                type="text"
                                value={details.value}
                                onChange={(e) =>
                                  handleSpecificationChange(
                                    "details",
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Feature value"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeSpecificationItem("details", index)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center px-8 py-3 rounded-lg font-medium transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  } text-white`}
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isSubmitting ? "Uploading..." : "Upload Furniture"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FurnitureUploadForm;
