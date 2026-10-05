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
      <div className="p-8">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="mb-2 text-3xl font-bold text-[#744b4b]">
          Orders
        </h1>

        <p className="text-red-600">
          Unable to load orders.
        </p>

        <p className="mt-2 text-gray-500">
          Make sure JSON Server is running on port 3001.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-[#744b4b]">
        Orders
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full min-w-[800px]">
            <thead className="bg-[#744b4b] text-white">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">User ID</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-4">{order.id}</td>

                  <td className="p-4">{order.userId}</td>

                  <td className="p-4">
                    ₹{order.total}
                  </td>

                  <td className="p-4">
                    {order.status}
                  </td>

                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value
                        )
                      }
                      className="rounded border p-2"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
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

export default AdminOrders;