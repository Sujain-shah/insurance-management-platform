import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/customers/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.data;

      setProfile({
        fullName: data.fullName,
        email: data.user.email,
        phone: data.phone,
        address: data.address,
        dob: data.dob?.split("T")[0],
      });

    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        "/customers/profile",
        {
          fullName: profile.fullName,
          phone: profile.phone,
          address: profile.address,
          dob: profile.dob,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile Updated Successfully");
      setEditing(false);

    } catch (error) {
      console.log(error);
      alert("Failed to Update Profile");
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        My Profile
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl">

        <label className="font-semibold">Full Name</label>
        <input
          className="border w-full p-3 rounded mb-4"
          value={profile.fullName}
          disabled={!editing}
          onChange={(e) =>
            setProfile({ ...profile, fullName: e.target.value })
          }
        />

        <label className="font-semibold">Email</label>
        <input
          className="border w-full p-3 rounded mb-4 bg-gray-100"
          value={profile.email}
          disabled
        />

        <label className="font-semibold">Phone</label>
        <input
          className="border w-full p-3 rounded mb-4"
          value={profile.phone}
          disabled={!editing}
          onChange={(e) =>
            setProfile({ ...profile, phone: e.target.value })
          }
        />

        <label className="font-semibold">Address</label>
        <textarea
          className="border w-full p-3 rounded mb-4"
          value={profile.address}
          disabled={!editing}
          onChange={(e) =>
            setProfile({ ...profile, address: e.target.value })
          }
        />

        <label className="font-semibold">Date of Birth</label>
        <input
          type="date"
          className="border w-full p-3 rounded mb-6"
          value={profile.dob}
          disabled={!editing}
          onChange={(e) =>
            setProfile({ ...profile, dob: e.target.value })
          }
        />

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={updateProfile}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Save Changes
          </button>
        )}

      </div>
    </Layout>
  );
}

export default Profile;