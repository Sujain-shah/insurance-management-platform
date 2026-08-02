import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function MyClaims() {
    const [claims, setClaims] = useState([]);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get("/claims/my", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setClaims(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-blue-700 mb-6">
                My Claims
            </h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4">Claim No.</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Remarks</th>
                            <th className="p-4">Verified On</th>
                        </tr>
                    </thead>

                    <tbody>
                        {claims.length > 0 ? (
                            claims.map((claim) => (
                                <tr key={claim.id} className="border-b text-center">

                                    <td className="p-4">
                                        {claim.claimNumber}
                                    </td>

                                    <td className="p-4">
                                        ₹{claim.claimAmount}
                                    </td>

                                    <td className="p-4">
                                        {claim.reason}
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-white ${claim.status === "APPROVED"
                                                    ? "bg-green-600"
                                                    : claim.status === "REJECTED"
                                                        ? "bg-red-600"
                                                        : "bg-yellow-500"
                                                }`}
                                        >
                                            {claim.status}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        {claim.remarks || "-"}
                                    </td>

                                    <td className="p-4">
                                        {claim.verifiedAt
                                            ? new Date(claim.verifiedAt).toLocaleDateString()
                                            : "-"}
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-6 text-center text-gray-500">
                                    No Claims Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default MyClaims;