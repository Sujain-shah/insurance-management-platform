import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function SubmitClaim() {

  const [policies, setPolicies] = useState([]);

  const [document, setDocument] = useState(null);

  const [claim, setClaim] = useState({
    claimNumber: "",
    claimAmount: "",
    reason: "",
    policyId: "",
  });

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

  const submitClaim = async () => {
    try {

      const token = localStorage.getItem("token");

      const claimRes = await api.post(
        "/claims",
        {
          ...claim,
          status: "PENDING",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (document) {

        const formData = new FormData();

        formData.append("document", document);
        formData.append("claimId", claimRes.data.data.id);

        await api.post(
          "/claim-documents",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      alert("Claim Submitted Successfully");

      setClaim({
        claimNumber: "",
        claimAmount: "",
        reason: "",
        policyId: "",
      });

      setDocument(null);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to submit claim."
      );
    }
  };
    return (
    <Layout>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Submit Claim
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">

        <input
          type="text"
          placeholder="Claim Number"
          value={claim.claimNumber}
          onChange={(e) =>
            setClaim({
              ...claim,
              claimNumber: e.target.value,
            })
          }
          className="border p-3 rounded w-full mb-4"
        />

        <select
          value={claim.policyId}
          onChange={(e) =>
            setClaim({
              ...claim,
              policyId: Number(e.target.value),
            })
          }
          className="border p-3 rounded w-full mb-4"
        >
          <option value="">Select Policy</option>

          {policies.map((policy) => (
            <option
              key={policy.id}
              value={policy.id}
            >
              {policy.policyNumber}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Claim Amount"
          value={claim.claimAmount}
          onChange={(e) =>
            setClaim({
              ...claim,
              claimAmount: e.target.value,
            })
          }
          className="border p-3 rounded w-full mb-4"
        />

        <textarea
          placeholder="Reason"
          value={claim.reason}
          onChange={(e) =>
            setClaim({
              ...claim,
              reason: e.target.value,
            })
          }
          className="border p-3 rounded w-full mb-4"
        />

        <label className="block font-semibold mb-2">
          Supporting Document
        </label>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setDocument(e.target.files[0])}
          className="mb-6"
        />

        <button
          onClick={submitClaim}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Submit Claim
        </button>

      </div>
    </Layout>
  );
}

export default SubmitClaim;