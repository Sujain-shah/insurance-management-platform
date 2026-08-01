import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);

    const [editingCustomer, setEditingCustomer] = useState(null);

    const [newCustomer, setNewCustomer] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        dob: "",
    });

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        dob: "",
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

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
    const addCustomer = async () => {
        try {
            const token = localStorage.getItem("token");

            await api.post("/customers", newCustomer, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Customer Added Successfully");

            setShowAddModal(false);

            setNewCustomer({
                fullName: "",
                email: "",
                password: "",
                phone: "",
                address: "",
                dob: "",
            });

            fetchCustomers();
        } catch (error) {
            console.log(error);
            console.log(error.response);
            console.log(error.response?.data);

            alert(JSON.stringify(error.response?.data));
        }
    };

    const deleteCustomer = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await api.delete(`/customers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Customer deleted successfully.");

            fetchCustomers();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete customer."
            );
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);

        setFormData({
            fullName: customer.fullName,
            phone: customer.phone,
            address: customer.address,
            dob: customer.dob.split("T")[0],
        });
    };

    const updateCustomer = async () => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/customers/${editingCustomer.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Customer Updated Successfully");

            setEditingCustomer(null);

            setFormData({
                fullName: "",
                phone: "",
                address: "",
                dob: "",
            });

            fetchCustomers();
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update customer."
            );
        }
    };
    const filteredCustomers = customers.filter((customer) =>
        customer.fullName
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        customer.user.email
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        customer.phone
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-700">
                    Customers
                </h1>

                <button
                    onClick={() => {
                        console.log("Button Clicked");
                        setShowAddModal(true);
                    }}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Add Customer
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border p-3 rounded-lg"
                />
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Phone</th>
                            <th className="p-4 text-left">Address</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCustomers.map((customer) => (
                            <tr
                                key={customer.id}
                                className="border-b hover:bg-gray-100"
                            >
                                <td className="p-4">
                                    {customer.fullName}
                                </td>

                                <td className="p-4">
                                    {customer.user.email}
                                </td>

                                <td className="p-4">
                                    {customer.phone}
                                </td>

                                <td className="p-4">
                                    {customer.address}
                                </td>

                                <td className="p-4 space-x-2">
                                    <button
                                        onClick={() =>
                                            handleEdit(customer)
                                        }
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteCustomer(customer.id)
                                        }
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredCustomers.length === 0 && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center p-6"
                                >
                                    No Customers Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Add Customer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[500px] p-6 rounded-xl shadow-xl">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">
                            Add Customer
                        </h2>

                        <div className="grid grid-cols-1 gap-3">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={newCustomer.fullName}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        fullName: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={newCustomer.email}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        email: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={newCustomer.password}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        password: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="text"
                                placeholder="Phone"
                                value={newCustomer.phone}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        phone: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="text"
                                placeholder="Address"
                                value={newCustomer.address}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        address: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />

                            <input
                                type="date"
                                value={newCustomer.dob}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        dob: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);

                                    setNewCustomer({
                                        fullName: "",
                                        email: "",
                                        password: "",
                                        phone: "",
                                        address: "",
                                        dob: "",
                                    });
                                }}
                                className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={addCustomer}
                                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Customer */}
            {editingCustomer && (
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">
                        Edit Customer
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    fullName: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    address: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="date"
                            value={formData.dob}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    dob: e.target.value,
                                })
                            }
                            className="border p-2 rounded"
                        />
                    </div>

                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={updateCustomer}
                            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                        >
                            Update Customer
                        </button>

                        <button
                            onClick={() => {
                                setEditingCustomer(null);

                                setFormData({
                                    fullName: "",
                                    phone: "",
                                    address: "",
                                    dob: "",
                                });
                            }}
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

export default Customers;