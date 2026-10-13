import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Boxes,
} from "lucide-react";

import {
  getAdminProducts,
  getAdminUsers,
  getAdminOrders,
} from "../../services/adminService";

const LOW_STOCK_LIMIT = 5;

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productsRes, usersRes, ordersRes] =
          await Promise.all([
            getAdminProducts(),
            getAdminUsers(),
            getAdminOrders(),
          ]);

        setProducts(productsRes.data);
        setUsers(usersRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error(error);
        setError(true);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Total revenue
  const revenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  // Inventory calculations
  const getStock = (product) => {
    const stock = Number(product.stock);
    return Number.isFinite(stock) ? stock : 0;
  };

  const inStockProducts = products.filter(
    (product) => getStock(product) > LOW_STOCK_LIMIT
  );

  const lowStockProducts = products.filter(
    (product) =>
      getStock(product) > 0 &&
      getStock(product) <= LOW_STOCK_LIMIT
  );

  const outOfStockProducts = products.filter(
    (product) => getStock(product) <= 0
  );

  const stockAlertProducts = [...products]
    .filter((product) => getStock(product) <= LOW_STOCK_LIMIT)
    .sort((a, b) => getStock(a) - getStock(b));

  // Orders by status
  const statusNames = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const orderChartData = statusNames.map((status) => ({
    status,
    orders: orders.filter(
      (order) => order.status === status
    ).length,
  }));

  // Daily revenue
  const dailyRevenue = {};

  orders.forEach((order) => {
    if (!order.date) return;

    const orderDate = new Date(order.date);

    if (Number.isNaN(orderDate.getTime())) return;

    const dateKey = [
      orderDate.getFullYear(),
      String(orderDate.getMonth() + 1).padStart(2, "0"),
      String(orderDate.getDate()).padStart(2, "0"),
    ].join("-");

    if (!dailyRevenue[dateKey]) {
      dailyRevenue[dateKey] = 0;
    }

    dailyRevenue[dateKey] += Number(order.total || 0);
  });

  const revenueChartData = Object.entries(dailyRevenue)
    .sort(([dateA], [dateB]) =>
      dateA.localeCompare(dateB)
    )
    .map(([date, dailyTotal]) => {
      const [year, month, day] = date.split("-");

      const dateLabel = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return {
        date: dateLabel,
        revenue: dailyTotal,
      };
    });

  // Recent orders
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.date || 0) - new Date(a.date || 0)
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f5ef]">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[#744b4b]">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-red-600">
            Unable to load dashboard data.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Make sure JSON Server is running on port 3001.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f8f5ef] p-3 sm:p-5 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-[#744b4b] sm:text-3xl lg:text-4xl">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Welcome to Misk Al-Sahar Admin Panel
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-w-0 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3dddd]">
            <Package className="text-[#744b4b]" size={24} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Products
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#744b4b]">
            {products.length}
          </h2>
        </div>

        <div className="min-w-0 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eee5d5]">
            <Users className="text-[#9a7b24]" size={24} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Users
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#744b4b]">
            {users.length}
          </h2>
        </div>

        <div className="min-w-0 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3dddd]">
            <ShoppingBag className="text-[#744b4b]" size={24} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Orders
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#744b4b]">
            {orders.length}
          </h2>
        </div>

        <div className="min-w-0 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eee5d5]">
            <IndianRupee className="text-[#9a7b24]" size={24} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Total Revenue
          </p>

          <h2 className="mt-1 break-words text-2xl font-bold text-[#9a7b24] sm:text-3xl">
            ₹{revenue.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#744b4b] sm:text-xl">
              Daily Revenue
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Total revenue generated each day
            </p>
          </div>

          <div className="h-[260px] w-full min-w-0 xs:h-[280px] sm:h-[350px]">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                    minTickGap={20}
                    tickFormatter={(value) =>
                      value.replace(/ \d{4}$/, "")
                    }
                  />

                  <YAxis
                    width={65}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                  />

                  <Tooltip
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString("en-IN")}`,
                      "Daily Revenue",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#744b4b"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-sm text-gray-500">
                  No revenue data available
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#744b4b] sm:text-xl">
              Orders by Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Overview of current order statuses
            </p>
          </div>

          <div className="h-[260px] w-full min-w-0 xs:h-[280px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 25,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="status"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={65}
                  tick={{ fontSize: 10 }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10 }}
                  width={30}
                />

                <Tooltip />

                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#744b4b"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[3px] text-[#9a7b24]">
              INVENTORY MANAGEMENT
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#744b4b] sm:text-2xl">
              Stock Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Monitor available inventory and identify products that need restocking.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#744b4b] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#5f3c3c]"
          >
            Manage Products
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle
                  className="text-green-700"
                  size={24}
                />
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                Healthy
              </span>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              In Stock
            </p>

            <h3 className="mt-1 text-3xl font-bold text-green-700">
              {inStockProducts.length}
            </h3>

            <p className="mt-2 text-xs text-gray-500">
              Products with more than {LOW_STOCK_LIMIT} units
            </p>
          </div>

          <div className="rounded-xl border border-yellow-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <AlertTriangle
                  className="text-yellow-700"
                  size={24}
                />
              </div>

              <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                Attention
              </span>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Low Stock
            </p>

            <h3 className="mt-1 text-3xl font-bold text-yellow-700">
              {lowStockProducts.length}
            </h3>

            <p className="mt-2 text-xs text-gray-500">
              Products with 1–{LOW_STOCK_LIMIT} units
            </p>
          </div>

          <div className="rounded-xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle
                  className="text-red-700"
                  size={24}
                />
              </div>

              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                Critical
              </span>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Out of Stock
            </p>

            <h3 className="mt-1 text-3xl font-bold text-red-700">
              {outOfStockProducts.length}
            </h3>

            <p className="mt-2 text-xs text-gray-500">
              Products with no available stock
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#eee7df] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <div className="flex items-center gap-2">
                <Boxes size={21} className="text-[#9a7b24]" />

                <h3 className="text-lg font-semibold text-[#744b4b]">
                  Stock Alerts
                </h3>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Products that need your attention
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#f8f5ef] px-3 py-1.5 text-sm font-medium text-[#744b4b]">
              {stockAlertProducts.length}{" "}
              {stockAlertProducts.length === 1
                ? "product"
                : "products"}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Package
                size={40}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 font-medium text-[#744b4b]">
                No products found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add products to start monitoring your inventory.
              </p>

              <Link
                to="/admin/products"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#9a7b24] hover:underline"
              >
                Add Products
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : stockAlertProducts.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <CheckCircle
                size={42}
                className="mx-auto text-green-600"
              />

              <h4 className="mt-3 font-semibold text-[#744b4b]">
                All products are sufficiently stocked
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                No low-stock or out-of-stock products need attention.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:hidden">
                {stockAlertProducts.map((product) => {
                  const stock = getStock(product);
                  const isOutOfStock = stock <= 0;

                  return (
                    <article
                      key={product.id}
                      className="min-w-0 rounded-xl border border-[#eee7df] bg-[#fffdf9] p-4"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f3eee6]">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={20} className="text-[#9a7b24]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="break-words font-semibold text-[#744b4b]">
                            {product.name}
                          </h4>
                          <p className="mt-1 break-words text-xs text-gray-500">
                            {product.category || "Uncategorized"} · ID: {product.id}
                          </p>
                          <p className="mt-2 text-sm font-medium text-[#9a7b24]">
                            ₹{Number(product.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee7df] pt-3">
                        <div>
                          <p className="text-xs text-gray-500">Available stock</p>
                          <p className={`mt-1 text-lg font-bold ${isOutOfStock ? "text-red-600" : "text-yellow-700"}`}>
                            {stock} <span className="text-xs font-normal">units</span>
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ${
                            isOutOfStock
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {isOutOfStock ? <XCircle size={13} /> : <AlertTriangle size={13} />}
                          {isOutOfStock ? "Out of Stock" : "Low Stock"}
                        </span>
                      </div>

                      <Link
                        to="/admin/products"
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#744b4b] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#5f3c3c]"
                      >
                        Manage Product <ArrowRight size={15} />
                      </Link>
                    </article>
                  );
                })}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="bg-[#f8f5ef] text-left text-sm text-[#744b4b]">
                      <th className="px-5 py-4 font-medium">Product</th>
                      <th className="px-5 py-4 font-medium">Category</th>
                      <th className="px-5 py-4 font-medium">Price</th>
                      <th className="px-5 py-4 font-medium">Available Stock</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 text-right font-medium">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stockAlertProducts.map((product) => {
                      const stock = getStock(product);
                      const isOutOfStock = stock <= 0;

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-[#f0ebe5] transition last:border-b-0 hover:bg-[#fcfaf7]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f3eee6]">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Package size={20} className="text-[#9a7b24]" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="break-words font-medium text-[#744b4b]">{product.name}</p>
                                <p className="mt-0.5 text-xs text-gray-400">ID: {product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">{product.category || "-"}</td>
                          <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-[#9a7b24]">
                            ₹{Number(product.price || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <span className={`font-semibold ${isOutOfStock ? "text-red-600" : "text-yellow-700"}`}>
                              {stock}
                            </span>
                            <span className="ml-1 text-xs text-gray-400">units</span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                                isOutOfStock ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {isOutOfStock ? <XCircle size={13} /> : <AlertTriangle size={13} />}
                              {isOutOfStock ? "Out of Stock" : "Low Stock"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Link
                              to="/admin/products"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4dccf] px-3 py-2 text-xs font-medium text-[#744b4b] transition hover:border-[#744b4b] hover:bg-[#744b4b] hover:text-white"
                            >
                              Manage <ArrowRight size={13} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>

          )}
        </div>
      </section>

      <div className="mt-6 min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#744b4b] sm:text-xl">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest customer orders
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#744b4b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#5f3c3c] sm:w-auto"
          >
            View All Orders
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">
              No orders found.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
              {recentOrders.map((order) => (
                <article key={order.id} className="min-w-0 rounded-xl border border-[#eee7df] bg-[#fffdf9] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#744b4b]">Order #{order.id}</p>
                      <p className="mt-1 break-words text-xs text-gray-500">User ID: {order.userId}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#eee7df] pt-3">
                    <div>
                      <p className="text-xs text-gray-500">Order total</p>
                      <p className="mt-1 font-semibold text-[#9a7b24]">
                        ₹{Number(order.total || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="text-right text-xs text-gray-500">
                      {order.date
                        ? new Date(order.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-[#f8f5ef] text-left text-sm text-[#744b4b]">
                  <th className="px-4 py-3 font-medium">
                    Order ID
                  </th>

                  <th className="px-4 py-3 font-medium">
                    User ID
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Total
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-[#744b4b]">
                      #{order.id}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {order.userId}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-[#9a7b24]">
                      ₹
                      {Number(
                        order.total || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {order.date
                        ? new Date(
                            order.date
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;