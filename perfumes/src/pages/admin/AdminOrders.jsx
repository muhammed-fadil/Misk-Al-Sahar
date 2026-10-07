import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAdminOrders,
  updateAdminOrder,
} from "../../services/adminService";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getAdminOrders();

        setOrders(response.data);
      } catch (error) {
        console.error(error);
        setError(true);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAdminOrder(id, status);

      toast.success("Order status updated");

      const response = await getAdminOrders();

      setOrders(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h1 className="mb-2 text-2xl font-bold text-[#744b4b] sm:text-3xl">
            Orders
          </h1>

          <p className="text-red-600">Unable to load orders.</p>

          <p className="mt-2 text-sm text-gray-500">
            Make sure JSON Server is running on port 3001.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#744b4b] sm:text-3xl">
          Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer orders and their status
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#744b4b] text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-medium">
                    Order ID
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-medium">
                    User ID
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-medium">
                    Total
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-medium">
                    Status
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-b-0 hover:bg-[#fffdf8]"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-[#744b4b]">
                      {order.id}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {order.userId}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-[#9a7b24]">
                      ₹{order.total}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "Processing"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="rounded border border-gray-300 bg-white p-2 text-sm outline-none focus:border-[#744b4b]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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

export default AdminOrders;