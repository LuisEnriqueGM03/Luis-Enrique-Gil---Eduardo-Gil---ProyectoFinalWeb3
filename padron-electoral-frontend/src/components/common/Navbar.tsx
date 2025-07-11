import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 w-full bg-white shadow flex items-center justify-between px-8 py-4">
      <div className="text-xl font-bold text-blue-700">Padrón Electoral</div>
      <button
        onClick={handleLogout}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium transition"
      >
        Cerrar Sesión
      </button>
    </nav>
  );
};

export default Navbar; 