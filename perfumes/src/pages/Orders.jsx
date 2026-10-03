
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import { getOrders, cancelOrder } from "../services/orderService";
import { setOrders } from "../redux/slices/orderSlice";

function Orders() {
  const user = useSelector((state) => state.auth.user);
  const orders = useSelector((state) => state.orders.orders);

  const dispatch = useDispatch();

  const {
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user?.id,

    queryFn: async () => {
      const response = await getOrders(user.id);

      dispatch(setOrders(response.data));

      return response.data;
    },
  });

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      await cancelOrder(orderId);
      await refetch();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <h2 className="text-xl text-[#744b4b]">
          Loading orders...
        </h2>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-5">
        <div className="text-center">
          <h2 className="text-xl text-red-600">
            Failed to load orders.
          </h2>

          <p className="mt-2 text-[#777]">
            Please try again.
          </p>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-5">
        <div className="text-center">
          <div className="mb-5 text-5xl">📦</div>

          <h2 className="font-serif text-3xl text-[#744b4b]">
            No Orders Yet
          </h2>

          <p className="mt-3 text-[#777]">
            Your orders will appear here after you make a purchase.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm tracking-[3px] text-[#9a7b24]">
            YOUR PURCHASES
          </p>

          <h1 className="font-serif text-4xl text-[#744b4b] sm:text-5xl">
            My Orders
          </h1>
        </div>

        {/* Orders */}
        <div className="space-y-6">
          {orders.map((order) => {
            const status = order.status || "Pending";

            return (
              <div
                key={order.id}
                className="rounded-lg bg-white p-5 shadow-sm sm:p-7"
              >

                {/* Order Header */}
                <div className="flex flex-col gap-3 border-b border-[#e5e0da] pb-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm tracking-wide text-[#9a7b24]">
                      ORDER
                    </p>

                    <h3 className="mt-1 font-serif text-2xl text-[#744b4b]">
                      #{order.id}
                    </h3>
                  </div>

                  {/* Status */}
                  <span
                    className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
                      status === "Cancelled"
                        ? "bg-red-100 text-red-600"
                        : status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {/* Date */}
                {order.date && (
                  <p className="mt-5 text-sm text-[#777]">
                    <strong className="text-[#555]">
                      Ordered on:
                    </strong>{" "}
                    {new Date(order.date).toLocaleString()}
                  </p>
                )}

                {/* Products */}
                <div className="mt-5 space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-[#744b4b]">
                    Items
                  </h4>

                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 border-b border-[#eee] py-3"
                    >
                      <div>
                        <p className="text-[#444]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-[#777]">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="whitespace-nowrap text-[#9a7b24]">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bottom */}
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm text-[#777]">
                      Order Total
                    </p>

                    <h3 className="mt-1 text-2xl font-semibold text-[#744b4b]">
                      ₹{order.total}
                    </h3>
                  </div>

                  {/* Cancel */}
                  {status === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="w-full rounded-lg border border-[#744b4b] px-5 py-3 text-sm font-medium text-[#744b4b] transition hover:bg-[#744b4b] hover:text-white sm:w-auto"
                    >
                      Cancel Order
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Orders;

