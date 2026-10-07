import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../../services/adminService";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      setProducts(response.data);
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

      loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-[#744b4b]">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="mb-4 text-red-500">Failed to load products.</p>

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
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="rounded bg-[#744b4b] px-5 py-3 text-sm font-medium text-white hover:bg-[#5f3c3c]"
        >
          {showForm ? "Close" : "Add Product"}
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg bg-white p-4 shadow sm:p-6"
        >
          <h2 className="mb-5 text-xl font-semibold text-[#744b4b]">
            {editingId ? "Edit Product" : "Add Product"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              required
              className="rounded border p-3 outline-none focus:border-[#744b4b]"
            />

            <input
              name="slug"
              placeholder="Slug (e.g. royal-oud)"
              value={form.slug}
              onChange={handleChange}
              required
              className="rounded border p-3 outline-none focus:border-[#744b4b]"
            />

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
              className="rounded border p-3 outline-none focus:border-[#744b4b]"
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="rounded border p-3 outline-none focus:border-[#744b4b]"
            />

            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              required
              className="rounded border p-3 outline-none focus:border-[#744b4b]"
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
              className="rounded border p-3 outline-none focus:border-[#744b4b]"
            />

            <input
              name="image"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
              className="rounded border p-3 outline-none focus:border-[#744b4b] sm:col-span-2"
            />

            <input
              name="shortDescription"
              placeholder="Short description"
              value={form.shortDescription}
              onChange={handleChange}
              className="rounded border p-3 outline-none focus:border-[#744b4b] sm:col-span-2"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="rounded border p-3 outline-none focus:border-[#744b4b] sm:col-span-2"
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded bg-[#744b4b] px-6 py-3 text-white hover:bg-[#5f3c3c]"
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products */}
      {products.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          {/* Mobile scroll */}
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
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t text-sm hover:bg-[#fffdf8]"
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
                          onClick={() => handleEdit(product)}
                          className="rounded bg-[#744b4b] px-3 py-2 text-xs text-white hover:bg-[#5f3c3c]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded bg-red-500 px-3 py-2 text-xs text-white hover:bg-red-600"
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
    </div>
  );
}

export default AdminProducts;