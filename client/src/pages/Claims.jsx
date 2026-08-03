import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
const BASE_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

function Claims() {
    const [claims, setClaims] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [search, setSearch] = useState("");
    const [documents, setDocuments] = useState([]);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [remarks, setRemarks] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);

    const [editingClaim, setEditingClaim] = useState(null);

    const [newClaim, setNewClaim] = useState({
        claimNumber: "",
        claimAmount: "",
        reason: "",
        status: "PENDING",
        policyId: "",
    });

    const [formData, setFormData] = useState({
        claimNumber: "",
        claimAmount: "",
        reason: "",
        status: "",
    });

    useEffect(() => {
        fetchClaims();
        fetchPolicies();
    }, []);

    const fetchClaims = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get("/claims", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setClaims(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const viewDocuments = async (claimId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get(`/claim-documents/${claimId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDocuments(res.data.data);
            setSelectedClaim(claimId);

        } catch (error) {
            console.log(error);
        }
    };

    const verifyClaim = async (claimId, status) => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/claims/${claimId}/verify`,
                {
                    status,
                    remarks,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(`Claim ${status}`);

            setRemarks("");
            setSelectedClaim(null);

            fetchClaims();

        } catch (error) {
            console.log(error);
        }
    };

    const fetchPolicies = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get("/policies", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPolicies(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    const addClaim = async () => {
        try {
            const token = localStorage.getItem("token");

            await api.post("/claims", newClaim, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Claim Added Successfully");

            setShowAddModal(false);

            setNewClaim({
                claimNumber: "",
                claimAmount: "",
                reason: "",
                status: "PENDING",
                policyId: "",
            });

            fetchClaims();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to add claim."
            );
        }
    };

    const deleteClaim = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this claim?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await api.delete(`/claims/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Claim Deleted Successfully");

            fetchClaims();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete claim."
            );
        }
    };

    const handleEdit = (claim) => {
        setEditingClaim(claim);

        setFormData({
            claimNumber: claim.claimNumber,
            claimAmount: claim.claimAmount,
            reason: claim.reason,
            status: claim.status,
        });
    };

    const updateClaim = async () => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/claims/${editingClaim.id}`,
                {
                    ...formData,
                    policyId: editingClaim.policyId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Claim Updated Successfully");

            setEditingClaim(null);

            fetchClaims();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update claim."
            );
        }
    };
    const filteredClaims = claims.filter((claim) =>
        claim.claimNumber
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        claim.policy.policyNumber
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        claim.status
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-700">
                    Claims
                </h1>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Add Claim
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by claim number, policy or status..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border p-3 rounded-lg"
                />
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4 text-left">Claim No.</th>
                            <th className="p-4 text-left">Policy</th>
                            <th className="p-4 text-left">Amount</th>
                            <th className="p-4 text-left">Reason</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredClaims.map((claim) => (
                            <tr
                                key={claim.id}
                                className="border-b hover:bg-gray-100"
                            >
                                <td className="p-4">
                                    {claim.claimNumber}
                                </td>

                                <td className="p-4">
                                    {claim.policy.policyNumber}
                                </td>

                                <td className="p-4">
                                    ₹ {claim.claimAmount}
                                </td>

                                <td className="p-4">
                                    {claim.reason}
                                </td>

                                <td className="p-4">
                                    {claim.status}
                                </td>

                                <td className="p-4 space-x-2">
                                    <button
                                        onClick={() => handleEdit(claim)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => viewDocuments(claim.id)}
                                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                                    >
                                        Documents
                                    </button>
                                    <button
                                        onClick={() => deleteClaim(claim.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredClaims.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center p-6"
                                >
                                    No Claims Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
            {selectedClaim && (
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">

                    <h2 className="text-2xl font-bold mb-4">
                        Claim Documents
                    </h2>

                    {documents.map((doc) => (
                        <div key={doc.id} className="mb-3">

                            <a
                                href={`${BASE_URL}/${doc.filePath.replace(/\\/g, "/")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                            >
                                {doc.fileName}
                            </a>

                        </div>
                    ))}

                    <textarea
                        placeholder="Remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="border rounded p-3 w-full mt-4"
                    />

                    <div className="flex gap-3 mt-4">

                        <button
                            onClick={() => verifyClaim(selectedClaim, "APPROVED")}
                            className="bg-green-600 text-white px-5 py-2 rounded"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => verifyClaim(selectedClaim, "REJECTED")}
                            className="bg-red-600 text-white px-5 py-2 rounded"
                        >
                            Reject
                        </button>

                    </div>

                </div>
            )}
            {/* Add Claim Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[550px] p-6 rounded-xl shadow-xl">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">
                            Add Claim
                        </h2>

                        <div className="grid grid-cols-1 gap-3">

                            <input
                                type="text"
                                placeholder="Claim Number"
                                value={newClaim.claimNumber}
                                onChange={(e) =>
                                    setNewClaim({
                                        ...newClaim,
                                        claimNumber: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <select
                                value={newClaim.policyId}
                                onChange={(e) =>
                                    setNewClaim({
                                        ...newClaim,
                                        policyId: Number(e.target.value),
                                    })
                                }
                                className="border p-2 rounded"
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
                                value={newClaim.claimAmount}
                                onChange={(e) =>
                                    setNewClaim({
                                        ...newClaim,
                                        claimAmount: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <textarea
                                placeholder="Reason"
                                value={newClaim.reason}
                                onChange={(e) =>
                                    setNewClaim({
                                        ...newClaim,
                                        reason: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <select
                                value={newClaim.status}
                                onChange={(e) =>
                                    setNewClaim({
                                        ...newClaim,
                                        status: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>

                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={addClaim}
                                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Claim */}
            {editingClaim && (
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">
                        Edit Claim
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="text"
                            value={formData.claimNumber}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    claimNumber: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="number"
                            value={formData.claimAmount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    claimAmount: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <textarea
                            value={formData.reason}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    reason: e.target.value,
                                })
                            }
                            className="border p-2 rounded col-span-2"
                        />

                        <select
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="REJECTED">REJECTED</option>
                        </select>

                    </div>

                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={updateClaim}
                            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                        >
                            Update Claim
                        </button>

                        <button
                            onClick={() => setEditingClaim(null)}
                            className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Claims;