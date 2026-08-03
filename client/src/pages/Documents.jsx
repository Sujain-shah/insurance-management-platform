import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Documents() {

    const [documents, setDocuments] = useState([]);
    const [policies, setPolicies] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [policyId, setPolicyId] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchDocuments();
        fetchPolicies();
    }, []);

    const fetchDocuments = async () => {
        try {

            const token = localStorage.getItem("token");

            const res = await api.get("/documents", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDocuments(res.data.data);

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

    const uploadDocument = async () => {

        try {

            if (!selectedFile || !policyId) {
                alert("Please select a policy and a file.");
                return;
            }

            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("file", selectedFile);
            formData.append("policyId", policyId);

            await api.post("/documents", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Document Uploaded Successfully");

            setSelectedFile(null);
            setPolicyId("");

            fetchDocuments();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Upload Failed"
            );

        }
    };

    const deleteDocument = async (id) => {

        if (!window.confirm("Delete this document?"))
            return;

        try {

            const token = localStorage.getItem("token");

            await api.delete(`/documents/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchDocuments();

        } catch (error) {
            console.log(error);
        }
    };

    const filteredDocuments = useMemo(() => {

        return documents.filter((doc) => {

            const value = search.toLowerCase();

            return (
                doc.fileName.toLowerCase().includes(value) ||
                doc.fileType.toLowerCase().includes(value) ||
                doc.policy.policyNumber.toLowerCase().includes(value)
            );

        });

    }, [documents, search]);

    return (
        <Layout>
            <div className="space-y-6">

                <div className="flex justify-between items-center">

                    <h1 className="text-3xl font-bold text-blue-700">
                        Document Management
                    </h1>

                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Total Documents : {filteredDocuments.length}
                    </div>

                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <select
                            value={policyId}
                            onChange={(e) => setPolicyId(e.target.value)}
                            className="border p-3 rounded"
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
                            type="file"
                            onChange={(e) =>
                                setSelectedFile(e.target.files[0])
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border p-3 rounded"
                        />

                        <button
                            onClick={uploadDocument}
                            className="bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Upload
                        </button>

                    </div>

                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-blue-600 text-white">

                            <tr>

                                <th className="p-4">Policy</th>

                                <th className="p-4">File Name</th>

                                <th className="p-4">Type</th>

                                <th className="p-4">Preview</th>

                                <th className="p-4">Download</th>

                                <th className="p-4">Delete</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredDocuments.length > 0 ? (

                                filteredDocuments.map((doc) => (

                                    <tr
                                        key={doc.id}
                                        className="border-b text-center hover:bg-gray-50"
                                    >

                                        <td className="p-4">
                                            {doc.policy.policyNumber}
                                        </td>

                                        <td className="p-4">
                                            {doc.fileName}
                                        </td>

                                        <td className="p-4">

                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">

                                                {doc.fileType}

                                            </span>

                                        </td>

                                        <td className="p-4">

                                            <a
                                                href={`https://insurance-management-api-dcuy.onrender.com/${doc.filePath.replace(/\\/g, "/")}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                View
                                            </a>

                                        </td>

                                        <td className="p-4">

                                            <a
                                                href={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${doc.filePath.replace(/\\/g, "/")}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Download
                                            </a>

                                        </td>

                                        <td className="p-4">

                                            <button
                                                onClick={() => deleteDocument(doc.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="p-8 text-center text-gray-500"
                                    >
                                        No Documents Found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </Layout>
    );
}

export default Documents;