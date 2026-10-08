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
} from "lucide-react";

import {
  getAdminProducts,
  getAdminUsers,
  getAdminOrders,
} from "../../services/adminService";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
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
    orders: orders.filter((order) => order.status === status).length,
  }));

  // Daily revenue
  // All orders from the same day are merged together
  const dailyRevenue = {};

  orders.forEach((order) => {
    if (!order.date) return;

    const date = new Date(order.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    dailyRevenue[date] =
      (dailyRevenue[date] || 0) + Number(order.total || 0);
  });

  const revenueChartData = Object.entries(dailyRevenue)
    .map(([date, revenue]) => ({
      date,
      revenue,
      sortDate: new Date(date),
    }))
    .sort((a, b) => a.sortDate - b.sortDate)
    .map(({ date, revenue }) => ({
      date,
      revenue,
    }));

  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl bg-white p-6 shadow">
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
    <div className="min-h-screen bg-[#f8f5ef] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold text-[#744b4b] sm:text-4xl">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Welcome to Misk Al-Sahar Admin Panel
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Products */}
        <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
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

        {/* Users */}
        <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
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

        {/* Orders */}
        <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
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

        {/* Total Revenue */}
        <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eee5d5]">
            <IndianRupee className="text-[#9a7b24]" size={24} />
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Total Revenue
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#9a7b24]">
            ₹{revenue.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Daily Revenue */}
        <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-[#744b4b]">
              Daily Revenue
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Total revenue generated each day
            </p>
          </div>

          <div className="h-[350px] w-full">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      `₹${value.toLocaleString("en-IN")}`
                    }
                  />

                  <Tooltip
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
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500">
                  No revenue data available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-[#744b4b]">
              Orders by Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Overview of current order statuses
            </p>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip />

                <Bar
                  dataKey="orders"
                  fill="#744b4b"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#744b4b]">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest customer orders
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#744b4b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#5f3c3c]"
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
          <div className="overflow-x-auto">
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
                      {Number(order.total || 0).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
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

                    <td className="px-4 py-4 text-sm text-gray-600">
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
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;