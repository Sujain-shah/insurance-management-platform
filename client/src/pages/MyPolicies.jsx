import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function MyPolicies() {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/policies/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPolicies(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        My Policies
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">Policy No.</th>
              <th className="p-4">Policy Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Premium</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {policies.length > 0 ? (
              policies.map((policy) => (
                <tr
                  key={policy.id}
                  className="border-b text-center"
                >
                  <td className="p-4">{policy.policyNumber}</td>
                  <td className="p-4">{policy.policyName}</td>
                  <td className="p-4">{policy.policyType}</td>
                  <td className="p-4">₹{policy.premiumAmount}</td>
                  <td className="p-4">{policy.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6 text-gray-500"
                >
                  No Policies Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default MyPolicies;