import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

  const revenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="mb-2 text-2xl font-bold text-[#744b4b]">
          Admin Dashboard
        </h1>

        <p className="text-red-600">
          Unable to load dashboard data.
        </p>

        <p className="mt-2 text-gray-500">
          Make sure JSON Server is running on port 3001.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold text-[#744b4b]">
        Admin Dashboard
      </h1>

      <p className="mb-8 text-gray-500">
        Welcome to Misk Al-Sahar Admin Panel
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">Products</p>

          <h2 className="mt-2 text-3xl font-bold">
            {products.length}
          </h2>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">Users</p>

          <h2 className="mt-2 text-3xl font-bold">
            {users.length}
          </h2>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">Orders</p>

          <h2 className="mt-2 text-3xl font-bold">
            {orders.length}
          </h2>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">Revenue</p>

          <h2 className="mt-2 text-3xl font-bold">
            ₹{revenue}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;