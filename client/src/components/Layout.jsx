import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}

export default Layout;