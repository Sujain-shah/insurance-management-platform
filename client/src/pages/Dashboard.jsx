import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Dashboard() {

  const [counts, setCounts] = useState({
    totalCustomers: 0,
    totalPolicies: 0,
    activePolicies: 0,
    expiredPolicies: 0,

    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,

    totalPremiumPayments: 0,
    paidPayments: 0,
    pendingPayments: 0,
    overduePayments: 0,

    premiumCollection: 0,

    totalDocuments: 0,

    customerGrowth: 0,
    monthlyPolicies: 0,
    monthlyClaims: 0,
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

  const cards = [

    {
      title: "👥 Customers",
      value: counts.totalCustomers,
    },

    {
      title: "📄 Policies",
      value: counts.totalPolicies,
    },

    {
      title: "🟢 Active Policies",
      value: counts.activePolicies,
    },

    {
      title: "🔴 Expired Policies",
      value: counts.expiredPolicies,
    },

    {
      title: "📋 Claims",
      value: counts.totalClaims,
    },

    {
      title: "⏳ Pending Claims",
      value: counts.pendingClaims,
    },

    {
      title: "✅ Approved Claims",
      value: counts.approvedClaims,
    },

    {
      title: "❌ Rejected Claims",
      value: counts.rejectedClaims,
    },

    {
      title: "💳 Payments",
      value: counts.totalPremiumPayments,
    },

    {
      title: "💰 Premium Collection",
      value: `₹${counts.premiumCollection}`,
    },

    {
      title: "🟢 Paid",
      value: counts.paidPayments,
    },

    {
      title: "🟡 Pending",
      value: counts.pendingPayments,
    },

    {
      title: "🔴 Overdue",
      value: counts.overduePayments,
    },

    {
      title: "📁 Documents",
      value: counts.totalDocuments,
    },

    {
      title: "📈 New Customers",
      value: counts.customerGrowth,
    },

    {
      title: "📅 Monthly Policies",
      value: counts.monthlyPolicies,
    },

    {
      title: "📋 Monthly Claims",
      value: counts.monthlyClaims,
    },

  ];

  return (

    <Layout>
      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        Insurance Management Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {cards.map((card, index) => (

          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition"
          >

            <h2 className="text-lg font-semibold text-gray-600">
              {card.title}
            </h2>

            <p className="text-4xl font-bold mt-4 text-blue-700">
              {card.value}
            </p>

          </div>

        ))}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-bold text-blue-700 mb-5">
            📊 Claim Statistics
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Pending Claims</span>
              <span className="font-bold text-yellow-600">
                {counts.pendingClaims}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Approved Claims</span>
              <span className="font-bold text-green-600">
                {counts.approvedClaims}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Rejected Claims</span>
              <span className="font-bold text-red-600">
                {counts.rejectedClaims}
              </span>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-bold text-blue-700 mb-5">
            💳 Premium Statistics
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Paid Payments</span>
              <span className="font-bold text-green-600">
                {counts.paidPayments}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Pending Payments</span>
              <span className="font-bold text-yellow-600">
                {counts.pendingPayments}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Overdue Payments</span>
              <span className="font-bold text-red-600">
                {counts.overduePayments}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Premium Collection</span>
              <span className="font-bold text-blue-700">
                ₹{counts.premiumCollection}
              </span>
            </div>

          </div>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          📅 Monthly Business Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-blue-50 rounded-lg p-5 text-center">

            <h3 className="text-lg font-semibold">
              New Customers
            </h3>

            <p className="text-4xl font-bold text-blue-700 mt-3">
              {counts.customerGrowth}
            </p>

          </div>

          <div className="bg-green-50 rounded-lg p-5 text-center">

            <h3 className="text-lg font-semibold">
              Policies Created
            </h3>

            <p className="text-4xl font-bold text-green-700 mt-3">
              {counts.monthlyPolicies}
            </p>

          </div>

          <div className="bg-yellow-50 rounded-lg p-5 text-center">

            <h3 className="text-lg font-semibold">
              Claims Submitted
            </h3>

            <p className="text-4xl font-bold text-yellow-700 mt-3">
              {counts.monthlyClaims}
            </p>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default Dashboard;