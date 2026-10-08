import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CalendarDays,
  ShoppingBag,
  X,
} from "lucide-react";

import {
  getAdminOrders,
  updateAdminOrder,
} from "../../services/adminService";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getAdminOrders();

        const sortedOrders = [...response.data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setOrders(sortedOrders);
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
    const currentOrder = orders.find((order) => order.id === id);

    // Prevent changing a cancelled order
    if (currentOrder?.status === "Cancelled") {
      toast.info("Cancelled orders cannot be changed");
      return;
    }

    try {
      await updateAdminOrder(id, status);

      toast.success("Order status updated");

      const response = await getAdminOrders();

      const sortedOrders = [...response.data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setOrders(sortedOrders);

      if (selectedOrder?.id === id) {
        const updatedOrder = sortedOrders.find(
          (order) => order.id === id
        );

        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status) => {
    if (status === "Delivered") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Shipped") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Processing") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f5ef]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#e8ddd2] border-t-[#744b4b]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[#744b4b]">
            Orders
          </h1>

          <p className="mt-2 text-red-600">
            Unable to load orders.
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#744b4b] text-white">
            <ShoppingBag size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#744b4b] sm:text-3xl">
              Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage customer orders and their status
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Orders
          </p>

          <p className="text-xl font-bold text-[#744b4b]">
            {orders.length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3eee6]">
            <ShoppingBag
              size={26}
              className="text-[#744b4b]"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-[#744b4b]">
            No orders yet
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold text-[#744b4b]">
                Customer Orders
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Click an order to view its details
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="bg-[#f8f5ef] text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    Order ID
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    User ID
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    Total
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    Order Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer border-b border-gray-100 transition last:border-b-0 hover:bg-[#fffdf8]"
                  >
                    <td className="px-5 py-5">
                      <span className="font-semibold text-[#744b4b]">
                        #{order.id}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-sm text-gray-600">
                      {order.userId}
                    </td>

                    <td className="px-5 py-5">
                      <span className="font-semibold text-[#9a7b24]">
                        ₹
                        {Number(order.total || 0).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays
                          size={16}
                          className="text-[#9a7b24]"
                        />

                        {formatDate(order.date)}
                      </div>
                    </td>

                    <td
                      className="px-5 py-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.status === "Cancelled" ? (
                        <span className="inline-flex rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                          cancelled
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
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
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Order Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#744b4b]">
                  Order #{selectedOrder.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Order Summary */}
            <div className="grid gap-4 border-b border-gray-100 p-5 sm:grid-cols-3 sm:p-6">
              <div className="rounded-xl bg-[#f8f5ef] p-4">
                <p className="text-xs text-gray-500">
                  Customer ID
                </p>

                <p className="mt-1 font-semibold text-[#744b4b]">
                  {selectedOrder.userId}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f5ef] p-4">
                <p className="text-xs text-gray-500">
                  Order Date
                </p>

                <p className="mt-1 font-semibold text-[#744b4b]">
                  {formatDateTime(selectedOrder.date)}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f5ef] p-4">
                <p className="text-xs text-gray-500">
                  Total Amount
                </p>

                <p className="mt-1 font-bold text-[#9a7b24]">
                  ₹
                  {Number(
                    selectedOrder.total || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <p className="mb-3 text-sm font-semibold text-[#744b4b]">
                Order Status
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>

                {selectedOrder.status === "Cancelled" ? (
                  <span className="text-sm font-medium text-red-600">
                    This order is cancelled and cannot be changed.
                  </span>
                ) : (
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedOrder.id,
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#744b4b]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="p-5 sm:p-6">
              <h3 className="mb-4 text-sm font-semibold text-[#744b4b]">
                Ordered Products
              </h3>

              {selectedOrder.items &&
              selectedOrder.items.length > 0 ? (
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#fffdf8] p-4"
                    >
                      <div>
                        <p className="font-medium text-[#744b4b]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-[#9a7b24]">
                        ₹
                        {Number(
                          item.price || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-[#f8f5ef] p-4 text-sm text-gray-500">
                  Product details are not available for this
                  order.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;