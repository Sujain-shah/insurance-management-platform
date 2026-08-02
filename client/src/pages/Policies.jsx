import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Policies() {
    const [policies, setPolicies] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);

    const [editingPolicy, setEditingPolicy] = useState(null);
    const [expiringPolicies, setExpiringPolicies] = useState([]);

    const [newPolicy, setNewPolicy] = useState({
        policyName: "",
        policyType: "",
        premiumAmount: "",
        startDate: "",
        endDate: "",
        status: "ACTIVE",
        customerId: "",
    });

    const [formData, setFormData] = useState({
        policyName: "",
        policyType: "",
        premiumAmount: "",
        startDate: "",
        endDate: "",
        status: "",
    });

    useEffect(() => {
        fetchPolicies();
        fetchCustomers();
        fetchExpiringPolicies();
    }, []);

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

    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get("/customers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCustomers(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchExpiringPolicies = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get("/policies/expiring", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setExpiringPolicies(res.data.data);

        } catch (error) {
            console.log(error);
        }
    };

    const renewPolicy = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/policies/${id}/renew`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Policy Renewed Successfully");

            fetchPolicies();
            fetchExpiringPolicies();

        } catch (error) {
            console.log(error);
        }
    };

    const cancelPolicy = async (id) => {
        if (!window.confirm("Cancel this policy?")) return;

        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/policies/${id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Policy Cancelled");

            fetchPolicies();
            fetchExpiringPolicies();

        } catch (error) {
            console.log(error);
        }
    };

    const addPolicy = async () => {
        try {
            const token = localStorage.getItem("token");

            await api.post("/policies", newPolicy, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Policy Added Successfully");

            setShowAddModal(false);

            setNewPolicy({
                policyName: "",
                policyType: "",
                premiumAmount: "",
                startDate: "",
                endDate: "",
                status: "ACTIVE",
                customerId: "",
            });

            fetchPolicies();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to add policy."
            );
        }
    };

    const deletePolicy = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this policy?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await api.delete(`/policies/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Policy Deleted Successfully");

            fetchPolicies();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete policy."
            );
        }
    };

    const handleEdit = (policy) => {
        setEditingPolicy(policy);

        setFormData({
            policyName: policy.policyName,
            policyType: policy.policyType,
            premiumAmount: policy.premiumAmount,
            startDate: policy.startDate.split("T")[0],
            endDate: policy.endDate.split("T")[0],
            status: policy.status,
        });
    };

    const updatePolicy = async () => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/policies/${editingPolicy.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Policy Updated Successfully");

            setEditingPolicy(null);

            fetchPolicies();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update policy."
            );
        }
    };
    const filteredPolicies = policies.filter((policy) =>
        policy.policyName
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        policy.policyType
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        policy.customer.fullName
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                {expiringPolicies.length > 0 && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg mb-6">
                        ⚠️ {expiringPolicies.length} polic{expiringPolicies.length === 1 ? "y is" : "ies are"} expiring within the next 30 days.
                    </div>
                )}
                <h1 className="text-3xl font-bold text-blue-700">
                    Policies
                </h1>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Add Policy
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by policy number, type or customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border p-3 rounded-lg"
                />
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4 text-left">Policy</th>
                            <th className="p-4 text-left">Type</th>
                            <th className="p-4 text-left">Customer</th>
                            <th className="p-4 text-left">Premium</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPolicies.map((policy) => (
                            <tr
                                key={policy.id}
                                className="border-b hover:bg-gray-100"
                            >
                                <td className="p-4">
                                    {policy.policyName}
                                </td>

                                <td className="p-4">
                                    {policy.policyType}
                                </td>

                                <td className="p-4">
                                    {policy.customer.fullName}
                                </td>

                                <td className="p-4">
                                    ₹ {policy.premiumAmount}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${policy.status === "ACTIVE"
                                            ? "bg-green-600"
                                            : policy.status === "EXPIRED"
                                                ? "bg-red-600"
                                                : policy.status === "CANCELLED"
                                                    ? "bg-gray-600"
                                                    : "bg-yellow-600"
                                            }`}
                                    >
                                        {policy.status}
                                    </span>
                                </td>

                                <td className="p-4 space-x-2">
                                    <button
                                        onClick={() =>
                                            handleEdit(policy)
                                        }
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => renewPolicy(policy.id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                    >
                                        Renew
                                    </button>

                                    <button
                                        onClick={() => cancelPolicy(policy.id)}
                                        className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() =>
                                            deletePolicy(policy.id)
                                        }
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredPolicies.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center p-6"
                                >
                                    No Policies Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Add Policy Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[550px] p-6 rounded-xl shadow-xl">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">
                            Add Policy
                        </h2>

                        <div className="grid grid-cols-1 gap-3">

                            <input
                                type="text"
                                placeholder="Policy Name"
                                value={newPolicy.policyName}
                                onChange={(e) =>
                                    setNewPolicy({
                                        ...newPolicy,
                                        policyName: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="text"
                                placeholder="Policy Type"
                                value={newPolicy.policyType}
                                onChange={(e) =>
                                    setNewPolicy({
                                        ...newPolicy,
                                        policyType: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="number"
                                placeholder="Premium Amount"
                                value={newPolicy.premiumAmount}
                                onChange={(e) =>
                                    setNewPolicy({
                                        ...newPolicy,
                                        premiumAmount: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <select
                                value={newPolicy.customerId}
                                onChange={(e) =>
                                    setNewPolicy({
                                        ...newPolicy,
                                        customerId: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            >
                                <option value="">Select Customer</option>

                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.fullName}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="date"
                                value={newPolicy.startDate}
                                onChange={(e) =>
                                    setNewPolicy({
                                        ...newPolicy,
                                        startDate: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="date"
                                value={newPolicy.endDate}
                                onChange={(e) =>
                                    setNewPolicy({
                                        ...newPolicy,
                                        endDate: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <select
                                value={newPolicy.status}
                                onChange={(e) =>
                                    setNewPolicy({
                                        ...newPolicy,
                                        status: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="PENDING">PENDING</option>
                                <option value="EXPIRED">EXPIRED</option>
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
                                onClick={addPolicy}
                                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Policy */}
            {editingPolicy && (
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">
                        Edit Policy
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="text"
                            value={formData.policyName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    policyName: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            value={formData.policyType}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    policyType: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="number"
                            value={formData.premiumAmount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    premiumAmount: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
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
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="PENDING">PENDING</option>
                            <option value="EXPIRED">EXPIRED</option>
                        </select>

                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    startDate: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    endDate: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                    </div>

                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={updatePolicy}
                            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                        >
                            Update Policy
                        </button>

                        <button
                            onClick={() => setEditingPolicy(null)}
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

export default Policies;