import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CalendarDays,
  ShoppingBag,
  X,
  Package,
  UserRound,
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

  // Fetch orders and display the newest first.
  const loadOrders = async () => {
    try {
      const response = await getAdminOrders();

      const sortedOrders = [...response.data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setOrders(sortedOrders);
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadOrders();
    };

    load();
  }, []);

  // Update an order's status.
  const handleStatusChange = async (id, status) => {
    const currentOrder = orders.find((order) => order.id === id);

    // Cancelled orders cannot be changed.
    if (currentOrder?.status === "Cancelled") {
      toast.info("Cancelled orders cannot be changed");
      return;
    }

    try {
      await updateAdminOrder(id, status);

      const response = await getAdminOrders();

      const sortedOrders = [...response.data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setOrders(sortedOrders);

      const updatedOrder = sortedOrders.find(
        (order) => order.id === id
      );

      if (selectedOrder?.id === id) {
        setSelectedOrder(updatedOrder || null);
      }

      toast.success("Order status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order");
    }
  };

  // Format the order date.
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format the order date and time.
  const formatDateTime = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status badge colors.
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

  const statusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // Loading state.
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f5ef] p-4">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e8ddd2] border-t-[#744b4b]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // Error state.
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-[#744b4b] sm:text-3xl">
            Orders
          </h1>

          <p className="mt-3 text-sm text-red-600">
            Unable to load orders.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Make sure JSON Server is running on port 3001.
          </p>

          <button
            onClick={() => {
              setLoading(true);
              loadOrders();
            }}
            className="mt-5 w-full rounded-lg bg-[#744b4b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5f3c3c] sm:w-auto"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-0 bg-[#f8f5ef] p-3 sm:p-5 md:p-6 lg:p-8">
    
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#744b4b] text-white sm:h-12 sm:w-12">
            <ShoppingBag size={22} />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-[#744b4b] sm:text-3xl">
              Orders
            </h1>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Manage customer orders and their status
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm sm:min-w-40 sm:px-5">
          <div>
            <p className="text-xs text-gray-500">
              Total Orders
            </p>

            <p className="mt-1 text-2xl font-bold text-[#744b4b]">
              {orders.length}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3eee6]">
            <ShoppingBag
              size={20}
              className="text-[#744b4b]"
            />
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white px-4 py-12 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3eee6]">
            <ShoppingBag
              size={28}
              className="text-[#744b4b]"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-[#744b4b]">
            No orders yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-4 sm:px-6">
            <h2 className="font-semibold text-[#744b4b]">
              Customer Orders
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Select an order to view details and update its status.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 sm:p-4 lg:hidden">
            {orders.map((order) => (
              <div
                key={order.id}
                className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:border-[#e8ddd2]"
              >
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#744b4b]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Order ID
                      </p>

                      <h3 className="mt-1 break-all font-bold text-[#744b4b]">
                        #{order.id}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="min-w-0 rounded-lg bg-[#f8f5ef] p-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <UserRound size={14} />
                        Customer ID
                      </div>

                      <p className="mt-2 break-all text-sm font-semibold text-[#744b4b]">
                        {order.userId}
                      </p>
                    </div>

                    <div className="min-w-0 rounded-lg bg-[#f8f5ef] p-3">
                      <p className="text-xs text-gray-500">
                        Total Amount
                      </p>

                      <p className="mt-2 break-words font-bold text-[#9a7b24]">
                        ₹
                        {Number(order.total || 0).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex min-w-0 items-start gap-2">
                    <CalendarDays
                      size={16}
                      className="mt-0.5 shrink-0 text-[#9a7b24]"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Order Date
                      </p>

                      <p className="mt-1 break-words text-sm text-gray-600">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-right text-xs font-medium text-[#744b4b]">
                    View Order Details →
                  </p>
                </button>

                <div
                  className="border-t border-gray-100 p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label
                    htmlFor={`mobile-status-${order.id}`}
                    className="mb-2 block text-xs font-medium text-gray-500"
                  >
                    Update Status
                  </label>

                  {order.status === "Cancelled" ? (
                    <span className="inline-flex rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                      Cancelled orders cannot be changed
                    </span>
                  ) : (
                    <select
                      id={`mobile-status-${order.id}`}
                      value={order.status || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="bg-[#f8f5ef] text-left">
                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    Order ID
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    User ID
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    Total
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    Order Date
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedOrder(order);
                      }
                    }}
                    className="cursor-pointer border-b border-gray-100 transition last:border-b-0 hover:bg-[#fffdf8] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#744b4b]"
                  >
                    <td className="px-5 py-5">
                      <span className="font-semibold text-[#744b4b]">
                        #{order.id}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-sm text-gray-600">
                      {order.userId}
                    </td>

                    <td className="whitespace-nowrap px-5 py-5">
                      <span className="font-semibold text-[#9a7b24]">
                        ₹
                        {Number(order.total || 0).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays
                          size={16}
                          className="shrink-0 text-[#9a7b24]"
                        />

                        {formatDate(order.date)}
                      </div>
                    </td>

                    <td
                      className="px-5 py-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.status === "Cancelled" ? (
                        <span className="inline-flex whitespace-nowrap rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                          Cancelled
                        </span>
                      ) : (
                        <select
                          aria-label={`Update order ${order.id} status`}
                          value={order.status || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-4 py-3 sm:px-6">
            <p className="text-xs text-gray-500">
              Showing {orders.length} orders
            </p>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
            className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Order Details
                </p>

                <h2
                  id="order-details-title"
                  className="mt-1 break-all text-xl font-bold text-[#744b4b]"
                >
                  Order #{selectedOrder.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 border-b border-gray-100 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              <div className="min-w-0 rounded-xl bg-[#f8f5ef] p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <UserRound size={15} />
                  Customer ID
                </div>

                <p className="mt-2 break-all font-semibold text-[#744b4b]">
                  {selectedOrder.userId}
                </p>
              </div>

              <div className="min-w-0 rounded-xl bg-[#f8f5ef] p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={15} />
                  Order Date
                </div>

                <p className="mt-2 break-words text-sm font-semibold text-[#744b4b]">
                  {formatDateTime(selectedOrder.date)}
                </p>
              </div>

              <div className="min-w-0 rounded-xl bg-[#f8f5ef] p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-xs text-gray-500">
                  Total Amount
                </p>

                <p className="mt-2 break-words text-lg font-bold text-[#9a7b24]">
                  ₹
                  {Number(selectedOrder.total || 0).toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>

            <div className="border-b border-gray-100 p-4 sm:p-6">
              <h3 className="mb-3 text-sm font-semibold text-[#744b4b]">
                Order Status
              </h3>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status || "Pending"}
                </span>

                {selectedOrder.status === "Cancelled" ? (
                  <p className="text-sm leading-5 text-red-600">
                    This order is cancelled and cannot be changed.
                  </p>
                ) : (
                  <div className="w-full sm:w-auto">
                    <label
                      htmlFor="modal-order-status"
                      className="mb-2 block text-xs text-gray-500"
                    >
                      Change status
                    </label>

                    <select
                      id="modal-order-status"
                      value={selectedOrder.status || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedOrder.id,
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b] sm:w-52"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Package
                  size={18}
                  className="text-[#744b4b]"
                />

                <h3 className="text-sm font-semibold text-[#744b4b]">
                  Ordered Products
                </h3>
              </div>

              {selectedOrder.items &&
              selectedOrder.items.length > 0 ? (
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-gray-100 bg-[#fffdf8] p-3 sm:p-4"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3eee6]">
                          <ShoppingBag
                            size={18}
                            className="text-[#744b4b]"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="break-words font-medium text-[#744b4b]">
                            {item.name || "Product"}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 break-words text-right text-sm font-semibold text-[#9a7b24] sm:text-base">
                        ₹
                        {Number(item.price || 0).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-[#f8f5ef] p-4 text-sm leading-6 text-gray-500">
                  Product details are not available for this order.
                </p>
              )}
            </div>

            <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4 sm:px-6">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full rounded-lg bg-[#744b4b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5f3c3c]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;