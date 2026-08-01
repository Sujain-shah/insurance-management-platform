import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [policyId, setPolicyId] = useState("");

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

      alert("Document uploaded successfully.");

      setSelectedFile(null);
      setPolicyId("");

      fetchDocuments();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to upload document."
      );
    }
  };

  const deleteDocument = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Document deleted successfully.");

      fetchDocuments();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete document."
      );
    }
  };
    return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Document Management
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <select
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Policy</option>

            {policies.map((policy) => (
              <option key={policy.id} value={policy.id}>
                {policy.policyNumber}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="border p-2 rounded"
          />

          <button
            onClick={uploadDocument}
            className="bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload Document
          </button>

        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">Policy</th>
              <th className="p-4 text-left">File Name</th>
              <th className="p-4 text-left">File Type</th>
              <th className="p-4 text-left">View</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="border-b hover:bg-gray-100"
              >
                <td className="p-4">
                  {doc.policy.policyNumber}
                </td>

                <td className="p-4">
                  {doc.fileName}
                </td>

                <td className="p-4">
                  {doc.fileType}
                </td>

                <td className="p-4">
                  <a
                    href={`http://localhost:5000/${doc.filePath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
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
            ))}

            {documents.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6"
                >
                  No Documents Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
          </Layout>
  );
}

export default Documents;