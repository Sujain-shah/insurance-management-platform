import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function MyPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/premium-payments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPayments(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        My Premium Payments
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Method</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="border-b text-center">
                  <td className="p-4">₹{payment.amount}</td>
                  <td className="p-4">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">{payment.paymentStatus}</td>
                  <td className="p-4">{payment.paymentMethod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No Premium Payments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default MyPayments;