import Layout from "./components/layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead className="">
          <tr className="">
            <th>Name & Email</th>
            <th>Address</th>
            <th>Product(s) Ordered</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id} className="border-b border-gray-200">
                <td>
                  {order.name}
                  <br />
                  {order.email}
                </td>
                <td>
                  {order.address} <br />
                  {order.city}, {order.state}
                  {""} {order.zip}
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <>
                      {l.price_data?.product_data.name} [x{l.quantity}]
                      <br />
                    </>
                  ))}
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
