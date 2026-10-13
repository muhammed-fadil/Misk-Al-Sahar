import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X, Package, Star, Search, Plus } from "lucide-react";

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
    size: "",
    gender: "",
    occasion: "",
    shortDescription: "",
    description: "",
    topNotes: "",
    heartNotes: "",
    baseNotes: "",
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
    const load = async () => {
      await loadProducts();
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
      slug: "",
      category: "",
      price: "",
      stock: "",
      rating: "",
      brand: "Misk Al-Sahar",
      image: "",
      size: "",
      gender: "",
      occasion: "",
      shortDescription: "",
      description: "",
      topNotes: "",
      heartNotes: "",
      baseNotes: "",
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
      size: "",
      gender: "",
      occasion: "",
      shortDescription: "",
      description: "",
      topNotes: "",
      heartNotes: "",
      baseNotes: "",
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { topNotes, heartNotes, baseNotes, ...rest } = form;

      const toNotes = (value) =>
        value
          .split(",")
          .map((note) => note.trim())
          .filter(Boolean);

      const product = {
        ...rest,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: Number(form.rating),
        notes: {
          top: toNotes(topNotes),
          heart: toNotes(heartNotes),
          base: toNotes(baseNotes),
        },
      };

      if (editingId) {
        await updateAdminProduct(editingId, product);
        toast.success("Product updated successfully");
      } else {
        await addAdminProduct(product);
        toast.success("Product added successfully");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      slug: product.slug || "",
      category: product.category || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      rating: product.rating ?? "",
      brand: product.brand || "Misk Al-Sahar",
      image: product.image || "",
      size: product.size || "",
      gender: product.gender || "",
      occasion: product.occasion || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      topNotes: product.notes?.top?.join(", ") || "",
      heartNotes: product.notes?.heart?.join(", ") || "",
      baseNotes: product.notes?.base?.join(", ") || "",
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
      await loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass =
    "min-w-0 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]";

  const getStockStyle = (stock) =>
    Number(stock) === 0
      ? "bg-red-100 text-red-700"
      : Number(stock) < 5
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f5ef]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#e8ddd2] border-t-[#744b4b]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] p-4 sm:p-6">
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#744b4b]">
            Products
          </h1>

          <p className="mt-3 text-red-500">
            Failed to load products.
          </p>

          <button
            onClick={() => {
              setLoading(true);
              loadProducts();
            }}
            className="mt-5 rounded-lg bg-[#744b4b] px-5 py-2.5 text-white transition hover:bg-[#5f3c3c]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-0 bg-[#f8f5ef] p-4 sm:p-6 lg:p-8">
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
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#744b4b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5f3c3c] sm:w-auto"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="mb-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm sm:p-12">
          <Package
            size={40}
            className="mx-auto text-[#744b4b]"
          />

          <h2 className="mt-4 font-semibold text-[#744b4b]">
            {products.length === 0
              ? "No products yet"
              : "No matching products"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {products.length === 0
              ? "Add your first perfume product."
              : `No products match "${search}".`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className="flex w-full gap-4 p-4 text-left"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-28 w-24 shrink-0 rounded-lg bg-[#f8f5ef] object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-24 shrink-0 items-center justify-center rounded-lg bg-[#f3eee6]">
                      <Package
                        size={30}
                        className="text-[#744b4b]"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-[#744b4b]">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {product.category}
                    </p>

                    <p className="mt-2 font-semibold text-[#9a7b24]">
                      ₹
                      {Number(product.price || 0).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStockStyle(
                        product.stock
                      )}`}
                    >
                      Stock: {product.stock}
                    </span>

                    <p className="mt-2 flex items-center gap-1 text-sm text-[#9a7b24]">
                      <Star
                        size={14}
                        className="fill-[#9a7b24]"
                      />
                      {product.rating ?? 0}
                    </p>
                  </div>
                </button>

                <div className="flex gap-3 border-t border-gray-100 p-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 rounded-lg bg-[#744b4b] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#5f3c3c]"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 rounded-lg bg-red-500 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm lg:block">
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
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#f3eee6]">
                            <Package
                              size={24}
                              className="text-[#744b4b]"
                            />
                          </div>
                        )}
                      </td>

                      <td className="max-w-48 px-4 py-4">
                        <p className="break-words font-semibold text-[#744b4b]">
                          {product.name}
                        </p>

                        <p className="mt-1 break-all text-xs text-gray-400">
                          {product.slug}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {product.category}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-medium text-[#9a7b24]">
                        ₹
                        {Number(product.price || 0).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStockStyle(
                            product.stock
                          )}`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-[#9a7b24]">
                        ★ {product.rating ?? 0}
                      </td>

                      <td
                        className="px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="rounded-lg bg-[#744b4b] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#5f3c3c]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-600"
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
        </>
      )}

      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
              <div className="min-w-0 pr-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Product Details
                </p>

                <h2 className="mt-1 break-words text-lg font-bold text-[#744b4b] sm:text-2xl">
                  {selectedProduct.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 p-4 sm:p-6 md:grid-cols-2">
              <div className="flex min-w-0 items-center justify-center rounded-xl bg-[#f8f5ef] p-3 sm:p-4">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-56 w-full rounded-xl object-contain sm:h-72 md:h-80"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center rounded-xl bg-[#f3eee6]">
                    <Package
                      size={50}
                      className="text-[#744b4b]"
                    />
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-4">
                <div>
                  <p className="text-xs text-gray-400">
                    Product Name
                  </p>

                  <p className="mt-1 break-words font-semibold text-[#744b4b]">
                    {selectedProduct.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Brand</p>

                  <p className="mt-1 break-words font-medium text-gray-700">
                    {selectedProduct.brand || "Misk Al-Sahar"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Category</p>

                  <p className="mt-1 font-medium text-gray-700">
                    {selectedProduct.category || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Slug</p>

                  <p className="mt-1 break-all font-medium text-gray-700">
                    {selectedProduct.slug || "-"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0 rounded-xl bg-[#f8f5ef] p-3 sm:p-4">
                    <p className="text-xs text-gray-400">Price</p>

                    <p className="mt-1 break-words font-bold text-[#9a7b24]">
                      ₹
                      {Number(
                        selectedProduct.price || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl bg-[#f8f5ef] p-3 sm:p-4">
                    <p className="text-xs text-gray-400">Stock</p>

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
                  <p className="text-xs text-gray-400">Rating</p>

                  <div className="mt-1 flex items-center gap-2">
                    <Star
                      size={18}
                      className="fill-[#9a7b24] text-[#9a7b24]"
                    />

                    <span className="font-semibold text-[#744b4b]">
                      {selectedProduct.rating ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="min-w-0 md:col-span-2">
                <p className="text-sm font-semibold text-[#744b4b]">
                  Short Description
                </p>

                <p className="mt-2 break-words rounded-xl bg-[#f8f5ef] p-4 text-sm leading-6 text-gray-600">
                  {selectedProduct.shortDescription ||
                    "No short description available."}
                </p>
              </div>

              <div className="min-w-0 md:col-span-2">
                <p className="text-sm font-semibold text-[#744b4b]">
                  Description
                </p>

                <p className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-[#f8f5ef] p-4 text-sm leading-6 text-gray-600">
                  {selectedProduct.description ||
                    "No description available."}
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-col gap-3 border-t border-gray-100 bg-white p-4 sm:flex-row sm:justify-end sm:p-6">
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full rounded-lg border border-gray-300 px-6 py-3 text-sm text-gray-700 transition hover:bg-gray-100 sm:w-auto"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const product = selectedProduct;
                  setSelectedProduct(null);
                  handleEdit(product);
                }}
                className="w-full rounded-lg bg-[#744b4b] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5f3c3c] sm:w-auto"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
          onClick={resetForm}
        >
          <div
            className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
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
                aria-label="Close product form"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  placeholder="Product name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <input
                  name="slug"
                  placeholder="Slug (e.g. royal-oud)"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select Category</option>
                  <option value="Oud">Oud</option>
                  <option value="Musk">Musk</option>
                  <option value="Floral">Floral</option>
                  <option value="Fresh">Fresh</option>
                  <option value="Oriental">Oriental</option>
                  <option value="Amber">Amber</option>
                </select>

                <input
                  name="price"
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <input
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="Rating (0–5)"
                  value={form.rating}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <input
                  name="size"
                  placeholder="Size (e.g. 100ml)"
                  value={form.size}
                  onChange={handleChange}
                  className={inputClass}
                />

                <input
                  name="gender"
                  placeholder="Gender (e.g. Unisex)"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputClass}
                />

                <input
                  name="occasion"
                  placeholder="Occasion (e.g. Evening)"
                  value={form.occasion}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                />

                <input
                  name="image"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                />

                <input
                  name="shortDescription"
                  placeholder="Short description"
                  value={form.shortDescription}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputClass} resize-y sm:col-span-2`}
                />

                <input
                  name="topNotes"
                  placeholder="Top notes (comma separated)"
                  value={form.topNotes}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                />

                <input
                  name="heartNotes"
                  placeholder="Heart notes (comma separated)"
                  value={form.heartNotes}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                />

                <input
                  name="baseNotes"
                  placeholder="Base notes (comma separated)"
                  value={form.baseNotes}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full rounded-lg border border-gray-300 px-6 py-3 text-sm text-gray-700 transition hover:bg-gray-100 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#744b4b] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5f3c3c] sm:w-auto"
                >
                  {editingId ? "Update Product" : "Add Product"}
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