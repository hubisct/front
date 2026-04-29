import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, LogIn, LogOut, LayoutDashboard, Store } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isOwner, logout } = useAuth();

  const isHome = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const dashboardPath = isAdmin ? "/admin" : "/painel";
  const dashboardLabel = isAdmin ? "Painel Admin" : "Meu Painel";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-purple-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center cursor-pointer"
            onClick={() => setMenuOpen(false)}
          >
            <div className="h-14 md:h-16 overflow-hidden">
              <ImageWithFallback
                src="/logo-hubis.png"
                alt="HUB IS - Incubadora Social UFSM"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                isHome
                  ? "text-purple-700 bg-purple-50"
                  : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
              }`}
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Início
            </Link>
            <a
              href="/#empreendimentos"
              className="px-4 py-2 rounded-xl text-gray-600 hover:text-purple-700 hover:bg-purple-50 font-bold text-sm transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Empreendimentos
            </a>
            <a
              href="https://www.ufsm.br"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-gray-600 hover:text-purple-700 hover:bg-purple-50 font-bold text-sm transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              UFSM
            </a>

            {user ? (
              // Logged in
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 transition-all"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {isAdmin ? (
                    <LayoutDashboard className="w-4 h-4" />
                  ) : (
                    <Store className="w-4 h-4" />
                  )}
                  {dashboardLabel}
                </Link>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #EA580C)",
                    }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <span
                    className="text-gray-700 font-bold text-xs max-w-[100px] truncate"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {user.name.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold text-sm transition-colors border border-red-200"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              // Not logged in
              <Link
                to="/login"
                className="ml-2 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #EA580C 100%)",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-purple-100 pt-4 flex flex-col gap-1.5">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-bold text-sm transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
              onClick={() => setMenuOpen(false)}
            >
              🏠 Início
            </Link>
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-bold text-sm transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
              onClick={() => setMenuOpen(false)}
            >
              🏪 Empreendimentos
            </Link>
            <a
              href="https://www.ufsm.br"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-bold text-sm transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
              onClick={() => setMenuOpen(false)}
            >
              🎓 UFSM
            </a>

            {user ? (
              <>
                <div className="px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-100">
                  <p
                    className="text-purple-700 font-bold text-sm"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    👤 {user.name}
                  </p>
                  <p
                    className="text-purple-500 text-xs"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {isAdmin ? "Administrador" : "Dono de empreendimento"}
                  </p>
                </div>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-purple-700 bg-purple-50 border border-purple-200 transition-colors"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {isAdmin ? (
                    <LayoutDashboard className="w-4 h-4" />
                  ) : (
                    <Store className="w-4 h-4" />
                  )}
                  {dashboardLabel}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-red-600 font-bold text-sm border-2 border-red-200 hover:bg-red-50 transition-colors"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="mt-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-sm text-center shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #EA580C 100%)",
                  fontFamily: "Nunito, sans-serif",
                }}
                onClick={() => setMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
