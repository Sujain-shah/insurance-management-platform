import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Dashboard() {
  const [counts, setCounts] = useState({
    totalCustomers: 0,
    totalPolicies: 0,
    totalClaims: 0,
    totalPremiumPayments: 0,
    totalDocuments: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCounts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        Insurance Management Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold">👤 Customers</h2>
          <p className="text-5xl font-bold mt-4">
            {counts.totalCustomers}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold">📄 Policies</h2>
          <p className="text-5xl font-bold mt-4">
            {counts.totalPolicies}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold">📋 Claims</h2>
          <p className="text-5xl font-bold mt-4">
            {counts.totalClaims}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold">💳 Premium</h2>
          <p className="text-5xl font-bold mt-4">
            {counts.totalPremiumPayments}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold">📁 Documents</h2>
          <p className="text-5xl font-bold mt-4">
            {counts.totalDocuments}
          </p>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;