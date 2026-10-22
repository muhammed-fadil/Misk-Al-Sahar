
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../../services/adminService";

const initialForm = {
  name: "",
  slug: "",
  category: "",
  price: "",
  stock: "",
  rating: "",
  brand: "Misk Al-Sahar",
  image: "",
  size: "",
  shortDescription: "",
  description: "",
};

const categories = ["Oud", "Musk", "Floral", "Fresh", "Oriental", "Amber"];

const fields = [
  ["name", "Product Name"],
  ["slug", "Slug"],
  ["category", "Category"],
  ["price", "Price", "number"],
  ["stock", "Stock", "number"],
  ["rating", "Rating (0–5)", "number"],
  ["brand", "Brand"],
  ["size", "Size"],
  ["image", "Image URL"],
  ["shortDescription", "Short Description"],
  ["description", "Description", "textarea"],
];

function FormField({ field, form, handleChange }) {
  const [name, label, type = "text"] = field;

  const props = {
    name,
    value: form[name],
    onChange: handleChange,
    placeholder: label,
    required: true,
    className:
      "w-full rounded-md border border-gray-300 bg-white p-2 outline-none focus:border-gray-600",
  };

  return (
    <div>
      <label className="mb-1 block">{label}</label>

      {name === "category" ? (
        <select {...props}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea {...props} rows={4} />
      ) : (
        <input
          {...props}
          type={type}
          min={type === "number" ? 0 : undefined}
          max={name === "rating" ? 5 : undefined}
          step={
            name === "rating" ? 0.1 : name === "stock" ? 1 : undefined
          }
        />
      )}
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...initialForm });

  const loadProducts = async () => {
    try {
      const response = await getAdminProducts();
      setProducts([...response.data].reverse());
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ ...initialForm });
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm({ ...initialForm });
    setEditingId(null);
    setShowForm(true);
    setSelectedProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const product = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
    };

    try {
      if (editingId !== null) {
        await updateAdminProduct(editingId, product);
        toast.success("Product updated successfully");
      } else {
        await addAdminProduct(product);
        toast.success("Product added successfully");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setForm(
      Object.fromEntries(
        Object.keys(initialForm).map((key) => [
          key,
          product[key] ?? initialForm[key],
        ])
      )
    );

    setEditingId(product.id);
    setShowForm(true);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteAdminProduct(id);
      toast.success("Product deleted successfully");
      setSelectedProduct(null);
      await loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="p-4">Loading products...</p>;
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="mb-3">Products</h1>
        <p className="mb-3">Failed to load products.</p>

        <button
          className="rounded-md border border-gray-400 px-4 py-2 hover:bg-gray-100"
          onClick={() => {
            setLoading(true);
            loadProducts();
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-2 text-2xl font-semibold">Products</h1>
      <p className="mb-4">Manage your perfume products</p>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-4 rounded-md border border-gray-300 p-5"
        >
          <h2 className="text-xl font-semibold">
            {editingId !== null ? "Edit Product" : "Add Product"}
          </h2>

          {fields.map((field) => (
            <FormField
              key={field[0]}
              field={field}
              form={form}
              handleChange={handleChange}
            />
          ))}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-md border border-gray-400 px-5 py-2 hover:bg-gray-100"
            >
              {editingId !== null ? "Update Product" : "Add Product"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-gray-400 px-5 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <button
        onClick={openAddForm}
        className="mb-4 rounded-md border border-gray-400 px-5 py-2 hover:bg-gray-100"
      >
        + Add Product
      </button>

      <input
        className="mb-4 w-full rounded-md border border-gray-300 p-3 outline-none focus:border-gray-600"
        placeholder="Search products by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredProducts.length === 0 ? (
        <div className="rounded-md border border-gray-300 p-4">
          <h2 className="mb-2 font-semibold">
            {products.length === 0 ? "No products yet" : "No matching products"}
          </h2>

          <p>
            {products.length === 0
              ? "Add your first perfume product."
              : `No products match "${search}".`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                {[
                  "Image",
                  "Name",
                  "Category",
                  "Price",
                  "Stock",
                  "Rating",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="border-b border-gray-300 p-3 text-left"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-200">
                  <td className="p-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        width="60"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>

                  <td className="p-3">
                    <button
                      className="underline underline-offset-2"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.name}
                    </button>
                  </td>

                  <td className="p-3">{product.category}</td>

                  <td className="p-3">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.rating ?? 0}</td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-md border border-gray-400 px-3 py-1 hover:bg-gray-100"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>

                      <button
                        className="rounded-md border border-gray-400 px-3 py-1 hover:bg-gray-100"
                        onClick={() => handleDelete(product.id)}
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
      )}

      {selectedProduct && (
        <div className="mt-6 space-y-3 rounded-md border border-gray-300 p-5">
          <h2 className="text-xl font-semibold">Product Details</h2>

          <button
            className="rounded-md border border-gray-400 px-4 py-2 hover:bg-gray-100"
            onClick={() => setSelectedProduct(null)}
          >
            Close
          </button>

          {selectedProduct.image && (
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              width="150"
            />
          )}

          {[
            ["Name", selectedProduct.name],
            ["Brand", selectedProduct.brand || "Misk Al-Sahar"],
            ["Category", selectedProduct.category],
            ["Slug", selectedProduct.slug],
            [
              "Price",
              `₹${Number(selectedProduct.price || 0).toLocaleString("en-IN")}`,
            ],
            ["Stock", selectedProduct.stock],
            ["Rating", selectedProduct.rating ?? 0],
            ["Size", selectedProduct.size],
            ["Short Description", selectedProduct.shortDescription],
            ["Description", selectedProduct.description],
          ].map(([label, value]) => (
            <p key={label}>
              <strong>{label}:</strong> {value || "-"}
            </p>
          ))}

          <button
            className="mt-2 rounded-md border border-gray-400 px-4 py-2 hover:bg-gray-100"
            onClick={() => handleEdit(selectedProduct)}
          >
            Edit Product
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;

