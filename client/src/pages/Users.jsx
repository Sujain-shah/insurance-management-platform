import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(res.data.data);

        } catch (error) {
            console.log(error);
        }
    };
    const updateRole = async (id, role) => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/users/${id}/role`,
                { role },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Role Updated Successfully");

            fetchUsers();

        } catch (error) {
            console.log(error);
            alert("Failed to Update Role");
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-blue-700 mb-6">
                Users
            </h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">

                <table className="w-full">

                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Created</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.map((user) => (

                            <tr
                                key={user.id}
                                className="border-b text-center"
                            >
                                <td className="p-4">{user.email}</td>

                                <td className="p-4">
                                    <select
                                        defaultValue={user.role}
                                        onChange={(e) => updateRole(user.id, e.target.value)}
                                        className="border rounded p-2"
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="AGENT">AGENT</option>
                                        <option value="CUSTOMER">CUSTOMER</option>
                                    </select>
                                </td>

                                <td className="p-4">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>

                                <td className="p-4 text-green-600 font-semibold">
                                    Change Role
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </Layout>
    );
}

export default Users;