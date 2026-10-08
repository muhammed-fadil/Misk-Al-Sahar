import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X, Package, Star } from "lucide-react";

import {
  getAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../../services/adminService";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    price: "",
    stock: "",
    rating: "",
    brand: "Misk Al-Sahar",
    image: "",
    shortDescription: "",
    description: "",
  });

  const loadProducts = async () => {
    try {
      const response = await getAdminProducts();

      setProducts([...response.data].reverse());
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      slug: "",
      category: "",
      price: "",
      stock: "",
      rating: "",
      brand: "Misk Al-Sahar",
      image: "",
      shortDescription: "",
      description: "",
    });

    setShowForm(false);
  };

  const openAddModal = () => {
    setEditingId(null);

    setForm({
      name: "",
      slug: "",
      category: "",
      price: "",
      stock: "",
      rating: "",
      brand: "Misk Al-Sahar",
      image: "",
      shortDescription: "",
      description: "",
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const product = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: Number(form.rating),
      };

      if (editingId) {
        await updateAdminProduct(editingId, product);
        toast.success("Product updated successfully");
      } else {
        await addAdminProduct(product);
        toast.success("Product added successfully");
      }

      resetForm();
      loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      slug: product.slug || "",
      category: product.category,
      price: product.price,
      stock: product.stock,
      rating: product.rating,
      brand: product.brand || "Misk Al-Sahar",
      image: product.image || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteAdminProduct(id);

      toast.success("Product deleted successfully");

      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  // Search products by name
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-[#744b4b]">
          Loading products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="mb-4 text-red-500">
            Failed to load products.
          </p>

          <button
            onClick={loadProducts}
            className="rounded bg-[#744b4b] px-5 py-2 text-white hover:bg-[#5f3c3c]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#744b4b] sm:text-3xl">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your perfume products
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded bg-[#744b4b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5f3c3c]"
        >
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
        />
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">
            No products found.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">
            No products match "{search}".
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-[#f3eee6]">
                <tr className="text-left text-sm text-[#744b4b]">
                  <th className="px-4 py-4">Image</th>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">Stock</th>
                  <th className="px-4 py-4">Rating</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer border-t text-sm transition hover:bg-[#fffdf8]"
                  >
                    <td className="px-4 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-[#744b4b]">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {product.slug}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-4 py-4 font-medium text-[#9a7b24]">
                      ₹{product.price}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          product.stock === 0
                            ? "font-medium text-red-500"
                            : "text-gray-600"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-[#9a7b24]">
                      ★ {product.rating}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(product);
                          }}
                          className="rounded bg-[#744b4b] px-3 py-2 text-xs text-white transition hover:bg-[#5f3c3c]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                          className="rounded bg-red-500 px-3 py-2 text-xs text-white transition hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Product Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#744b4b] sm:text-2xl">
                  {selectedProduct.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Product Details */}
            <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
              {/* Image */}
              <div className="flex items-center justify-center rounded-xl bg-[#f8f5ef] p-4">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-72 w-full rounded-xl object-cover sm:h-80"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center rounded-xl bg-[#f3eee6]">
                    <Package
                      size={50}
                      className="text-[#744b4b]"
                    />
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400">
                    Product Name
                  </p>

                  <p className="mt-1 text-lg font-semibold text-[#744b4b]">
                    {selectedProduct.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Brand
                  </p>

                  <p className="mt-1 font-medium text-gray-700">
                    {selectedProduct.brand || "Misk Al-Sahar"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Category
                  </p>

                  <p className="mt-1 font-medium text-gray-700">
                    {selectedProduct.category || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Slug
                  </p>

                  <p className="mt-1 break-all font-medium text-gray-700">
                    {selectedProduct.slug || "-"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#f8f5ef] p-4">
                    <p className="text-xs text-gray-400">
                      Price
                    </p>

                    <p className="mt-1 font-bold text-[#9a7b24]">
                      ₹
                      {Number(
                        selectedProduct.price || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f8f5ef] p-4">
                    <p className="text-xs text-gray-400">
                      Stock
                    </p>

                    <p
                      className={`mt-1 font-bold ${
                        Number(selectedProduct.stock) === 0
                          ? "text-red-500"
                          : "text-[#744b4b]"
                      }`}
                    >
                      {selectedProduct.stock}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-[#f8f5ef] p-4">
                  <p className="text-xs text-gray-400">
                    Rating
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <Star
                      size={18}
                      className="fill-[#9a7b24] text-[#9a7b24]"
                    />

                    <span className="font-semibold text-[#744b4b]">
                      {selectedProduct.rating || "0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-[#744b4b]">
                  Short Description
                </p>

                <p className="mt-2 rounded-xl bg-[#f8f5ef] p-4 text-sm leading-6 text-gray-600">
                  {selectedProduct.shortDescription ||
                    "No short description available."}
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-[#744b4b]">
                  Description
                </p>

                <p className="mt-2 rounded-xl bg-[#f8f5ef] p-4 text-sm leading-6 text-gray-600">
                  {selectedProduct.description ||
                    "No description available."}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col gap-3 border-t border-gray-100 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-100"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const product = selectedProduct;

                  setSelectedProduct(null);
                  handleEdit(product);
                }}
                className="rounded-lg bg-[#744b4b] px-6 py-3 font-medium text-white transition hover:bg-[#5f3c3c]"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={resetForm}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-[#744b4b]">
                  {editingId ? "Edit Product" : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingId
                    ? "Update product information"
                    : "Add a new perfume product"}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  placeholder="Product name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-200 p-3 outline-none focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
                />

                <input
                  name="slug"
                  placeholder="Slug (e.g. royal-oud)"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-200 p-3 outline-none focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-200 bg-white p-3 outline-none focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
                >
                  <option value="">Select Category</option>
                  <option value="Oud">Oud</option>
                  <option value="Musk">Musk</option>
                  <option value="Floral">Floral</option>
                  <option value="Fresh">Fresh</option>
                  <option value="Oriental">Oriental</option>
                </select>

                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-200 p-3 outline-none focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
                />

                <input
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-200 p-3 outline-none focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
                />

                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="Rating"
                  value={form.rating}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-200 p-3 outline-none focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
                />

                <input
                  name="image"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-200 p-3 outline-none focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b] sm:col-span-2"
                />

                <input
                  name="shortDescription"
                  placeholder="Short description"
                  value={form.shortDescription}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-200 p-3 outline-none focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b] sm:col-span-2"
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="rounded-lg border border-gray-200 p-3 outline-none focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b] sm:col-span-2"
                />
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#744b4b] px-6 py-3 font-medium text-white transition hover:bg-[#5f3c3c]"
                >
                  {editingId
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;