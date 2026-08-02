import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="w-64 bg-blue-700 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        Insurance
      </h1>

      <nav className="flex flex-col gap-4">

        {/* Dashboard - Admin Only */}
        {role === "ADMIN" && (
          <Link
            to="/dashboard"
            className="hover:bg-blue-600 p-3 rounded-lg"
          >
            🏠 Dashboard
          </Link>
        )}

        {role === "ADMIN" && (
          <Link
            to="/users"
            className="hover:bg-blue-600 p-3 rounded-lg"
          >
            👥 Users
          </Link>
        )}

        {/* Customers */}
        {(role === "ADMIN" || role === "AGENT") && (
          <Link
            to="/customers"
            className="hover:bg-blue-600 p-3 rounded-lg"
          >
            👤 Customers
          </Link>
        )}

        {/* Policies */}
        {(role === "ADMIN" || role === "AGENT") && (
          <Link
            to="/policies"
            className="hover:bg-blue-600 p-3 rounded-lg"
          >
            📄 Policies
          </Link>
        )}

        {/* Claims */}
        {(role === "ADMIN" || role === "AGENT") && (
          <Link
            to="/claims"
            className="hover:bg-blue-600 p-3 rounded-lg"
          >
            📋 Claims
          </Link>
        )}

        {/* Premium Payments */}
        {(role === "ADMIN" || role === "AGENT") && (
          <Link
            to="/premium-payments"
            className="hover:bg-blue-600 p-3 rounded-lg"
          >
            💳 Premium Payments
          </Link>
        )}

        {/* Documents */}
        {(role === "ADMIN" || role === "AGENT") && (
          <Link
            to="/documents"
            className="hover:bg-blue-600 p-3 rounded-lg"
          >
            📁 Documents
          </Link>
        )}

        {/* Customer Menu */}
        {role === "CUSTOMER" && (
          <>
            <Link
              to="/profile"
              className="hover:bg-blue-600 p-3 rounded-lg"
            >
              👤 My Profile
            </Link>

            <Link
              to="/my-policies"
              className="hover:bg-blue-600 p-3 rounded-lg"
            >
              📄 My Policies
            </Link>

            <Link
              to="/my-claims"
              className="hover:bg-blue-600 p-3 rounded-lg"
            >
              📋 My Claims
            </Link>
            <Link
              to="/submit-claim"
              className="hover:bg-blue-600 p-3 rounded-lg"
            >
              ➕ Submit Claim
            </Link>
            <Link
              to="/my-payments"
              className="hover:bg-blue-600 p-3 rounded-lg"
            >
              💳 My Premium Payments
            </Link>

            <Link
              to="/history"
              className="hover:bg-blue-600 p-3 rounded-lg"
            >
              📜 History
            </Link>

          </>
        )}

        <button
          onClick={logout}
          className="mt-10 bg-red-500 hover:bg-red-600 rounded-lg p-3"
        >
          Logout
        </button>

      </nav>
    </div >
  );
}

export default Sidebar;