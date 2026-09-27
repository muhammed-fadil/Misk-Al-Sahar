import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../services/orderService";
import { setOrders } from "../redux/slices/orderSlice";

function Orders() {
  const user = useSelector((state) => state.auth.user);
  const orders = useSelector((state) => state.orders.orders);

  const dispatch = useDispatch();

  const { isLoading, isError } = useQuery({
    queryKey: ["orders", user.id],

    queryFn: async () => {
      const response = await getOrders(user.id);

      dispatch(setOrders(response.data));

      return response.data;
    },
  });

  if (isLoading) {
    return <h2>Loading orders...</h2>;
  }

  if (isError) {
    return <h2>Failed to load orders. Please try again.</h2>;
  }

  if (orders.length === 0) {
    return <h2>You haven't placed any orders yet.</h2>;
  }

  return (
    <main className="orders">
      <h1>My Orders</h1>

      {orders.map((order) => (
        <div className="order" key={order.id}>
          <h3>Order #{order.id}</h3>

          {order.items.map((item) => (
            <p key={item.id}>
              {item.name} × {item.quantity}
            </p>
          ))}

          <h3>Total: ₹{order.total}</h3>
        </div>
      ))}
    </main>
  );
}

export default Orders;