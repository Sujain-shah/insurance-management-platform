import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function PremiumPayments() {

    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState("");
    const [policies, setPolicies] = useState([]);

    const [showAddModal, setShowAddModal] = useState(false);

    const [editingPayment, setEditingPayment] = useState(null);

    const [newPayment, setNewPayment] = useState({
        amount: "",
        paymentDate: "",
        dueDate: "",
        paymentStatus: "PENDING",
        paymentMethod: "",
        policyId: "",
    });

    const [formData, setFormData] = useState({
        amount: "",
        paymentDate: "",
        dueDate: "",
        paymentStatus: "",
        paymentMethod: "",
    });

    useEffect(() => {
        fetchPayments();
        fetchPolicies();
    }, []);

    const fetchPayments = async () => {
        try {

            const token = localStorage.getItem("token");

            const res = await api.get("/premium-payments", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPayments(res.data.data);

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

    const addPayment = async () => {
        try {

            const token = localStorage.getItem("token");

            await api.post(
                "/premium-payments",
                newPayment,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Premium Payment Added Successfully");

            setShowAddModal(false);

            setNewPayment({
                amount: "",
                paymentDate: "",
                dueDate: "",
                paymentStatus: "PENDING",
                paymentMethod: "",
                policyId: "",
            });

            fetchPayments();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to add payment."
            );
        }
    };

    const deletePayment = async (id) => {

        if (!window.confirm("Delete this payment?"))
            return;

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/premium-payments/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchPayments();

        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (payment) => {

        setEditingPayment(payment);

        setFormData({
            amount: payment.amount,
            paymentDate: payment.paymentDate.split("T")[0],
            dueDate: payment.dueDate
                ? payment.dueDate.split("T")[0]
                : "",
            paymentMethod: payment.paymentMethod,
            paymentStatus: payment.paymentStatus,
        });
    };

    const updatePayment = async () => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/premium-payments/${editingPayment.id}`,
                {
                    ...formData,
                    policyId: editingPayment.policyId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Updated Successfully");

            setEditingPayment(null);

            fetchPayments();

        } catch (error) {
            console.log(error);
        }
    };

    const filteredPayments = payments.filter((payment) =>
        payment.policy.policyNumber
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        payment.paymentMethod
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        payment.paymentStatus
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold text-blue-700">
                    Premium Payments
                </h1>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Add Payment
                </button>

            </div>

            <div className="mb-4">

                <input
                    type="text"
                    placeholder="Search..."
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

                            <th className="p-4 text-left">Amount</th>

                            <th className="p-4 text-left">Payment Date</th>

                            <th className="p-4 text-left">Due Date</th>

                            <th className="p-4 text-left">Method</th>

                            <th className="p-4 text-left">Status</th>

                            <th className="p-4 text-left">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredPayments.map((payment) => {

                            const overdue =
                                payment.paymentStatus === "PENDING" &&
                                payment.dueDate &&
                                new Date(payment.dueDate) < new Date();

                            return (

                                <tr
                                    key={payment.id}
                                    className="border-b hover:bg-gray-100"
                                >

                                    <td className="p-4">
                                        {payment.policy.policyNumber}
                                    </td>

                                    <td className="p-4">
                                        ₹ {payment.amount}
                                    </td>

                                    <td className="p-4">
                                        {payment.paymentDate.split("T")[0]}
                                    </td>

                                    <td className="p-4">
                                        {payment.dueDate
                                            ? payment.dueDate.split("T")[0]
                                            : "-"}
                                    </td>

                                    <td className="p-4">
                                        {payment.paymentMethod}
                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-white ${payment.paymentStatus === "PAID"
                                                    ? "bg-green-600"
                                                    : overdue
                                                        ? "bg-red-600"
                                                        : "bg-yellow-500"
                                                }`}
                                        >
                                            {overdue
                                                ? "OVERDUE"
                                                : payment.paymentStatus}
                                        </span>

                                    </td>

                                    <td className="p-4 space-x-2">

                                        <button
                                            onClick={() =>
                                                handleEdit(payment)
                                            }
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deletePayment(payment.id)
                                            }
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            );

                        })}

                        {filteredPayments.length === 0 && (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center p-6"
                                >
                                    No Premium Payments Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* Add Payment Modal */}

            {showAddModal && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-[550px] p-6 rounded-xl shadow-xl">

                        <h2 className="text-2xl font-bold text-blue-700 mb-4">
                            Add Premium Payment
                        </h2>

                        <div className="grid grid-cols-1 gap-3">

                            <select
                                value={newPayment.policyId}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
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
                                placeholder="Amount"
                                value={newPayment.amount}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        amount: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="date"
                                value={newPayment.paymentDate}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        paymentDate: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="date"
                                value={newPayment.dueDate}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        dueDate: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="text"
                                placeholder="Payment Method"
                                value={newPayment.paymentMethod}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        paymentMethod: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <select
                                value={newPayment.paymentStatus}
                                onChange={(e) =>
                                    setNewPayment({
                                        ...newPayment,
                                        paymentStatus: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            >

                                <option value="PENDING">PENDING</option>

                                <option value="PAID">PAID</option>

                                <option value="OVERDUE">OVERDUE</option>

                            </select>

                        </div>

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-gray-500 text-white px-5 py-2 rounded"
                            >

                                Cancel

                            </button>

                            <button
                                onClick={addPayment}
                                className="bg-green-600 text-white px-5 py-2 rounded"
                            >

                                Save

                            </button>

                        </div>

                    </div>

                </div>

            )}
            {/* Edit Payment */}

            {editingPayment && (

                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">

                    <h2 className="text-2xl font-bold text-blue-700 mb-4">
                        Edit Premium Payment
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="date"
                            value={formData.paymentDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    paymentDate: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    dueDate: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            value={formData.paymentMethod}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    paymentMethod: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <select
                            value={formData.paymentStatus}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    paymentStatus: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        >

                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="OVERDUE">OVERDUE</option>

                        </select>

                    </div>

                    <div className="flex gap-3 mt-5">

                        <button
                            onClick={updatePayment}
                            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                        >
                            Update Payment
                        </button>

                        <button
                            onClick={() => setEditingPayment(null)}
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

export default PremiumPayments;