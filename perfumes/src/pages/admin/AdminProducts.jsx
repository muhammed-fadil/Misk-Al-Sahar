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
    } catch (error) {
      console.error(error);
      setError(true);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAdminProducts();

        setProducts(response.data);
      } catch (error) {
        console.error(error);
        setError(true);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    load();
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
      <div className="p-8">
        <p className="text-gray-500">
          Loading products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="mb-2 text-3xl font-bold text-[#744b4b]">
          Products
        </h1>

        <p className="text-red-600">
          Unable to load products.
        </p>

        <p className="mt-2 text-gray-500">
          Make sure JSON Server is running on port 3001.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#744b4b]">
          Products
        </h1>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="rounded bg-[#744b4b] px-5 py-2 text-white"
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid gap-4 rounded-lg bg-white p-6 shadow sm:grid-cols-2"
        >
          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            required
            className="rounded border p-3"
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="rounded border p-3"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="rounded border p-3"
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
            className="rounded border p-3"
          />

          <input
            name="rating"
            type="number"
            step="0.1"
            placeholder="Rating"
            value={form.rating}
            onChange={handleChange}
            required
            className="rounded border p-3"
          />

          <input
            name="image"
            placeholder="Image path"
            value={form.image}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            name="shortDescription"
            placeholder="Short description"
            value={form.shortDescription}
            onChange={handleChange}
            className="rounded border p-3 sm:col-span-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="rounded border p-3 sm:col-span-2"
          />

          <button
            type="submit"
            className="rounded bg-[#9a7b24] px-5 py-3 text-white sm:col-span-2"
          >
            {editingId
              ? "Update Product"
              : "Add Product"}
          </button>
        </form>
      )}

      {products.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">
            No products found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full min-w-[800px]">
            <thead className="bg-[#744b4b] text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {product.name}
                  </td>

                  <td className="p-4">
                    {product.category}
                  </td>

                  <td className="p-4">
                    ₹{product.price}
                  </td>

                  <td className="p-4">
                    {product.stock}
                  </td>

                  <td className="p-4">
                    {product.rating}
                  </td>

                  <td className="flex gap-2 p-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="rounded bg-[#9a7b24] px-4 py-2 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(product.id)
                      }
                      className="rounded bg-red-600 px-4 py-2 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;