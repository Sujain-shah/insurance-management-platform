import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function CustomerHistory() {
  const [history, setHistory] = useState({
    totalPolicies: 0,
    totalClaims: 0,
    totalPayments: 0,
    totalDocuments: 0,
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/customers/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Customer History
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold">Policies</h2>
          <p className="text-4xl text-blue-600 mt-3">
            {history.totalPolicies}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold">Claims</h2>
          <p className="text-4xl text-green-600 mt-3">
            {history.totalClaims}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold">Payments</h2>
          <p className="text-4xl text-purple-600 mt-3">
            {history.totalPayments}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold">Documents</h2>
          <p className="text-4xl text-orange-600 mt-3">
            {history.totalDocuments}
          </p>
        </div>

      </div>
    </Layout>
  );
}

export default CustomerHistory;