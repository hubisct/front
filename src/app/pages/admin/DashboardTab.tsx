import { useNavigate } from "react-router";
import {
  Store,
  Users,
  Package,
  UserCheck,
  Home,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import type { Enterprise } from "../../types";

type Tab = "dashboard" | "enterprises" | "users" | "categories";

export function DashboardTab({
  setTab,
  setShowAddEnterprise,
  setShowAddUser,
}: {
  setTab: (tab: Tab) => void;
  setShowAddEnterprise: (show: boolean) => void;
  setShowAddUser: (show: boolean) => void;
}) {
  const navigate = useNavigate();
  const { enterprises, users } = useAuth();
  
  const ownerUsers = users.filter((u) => u.role === "owner");

  return (
    <div>
      <h1
        className="text-gray-900 text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-6"
        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
      >
        Visão Geral
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          {
            label: "Empreendimentos",
            value: enterprises.length,
            icon: Store,
            color: "#7C3AED",
            bg: "#F3F0FF",
          },
          {
            label: "Produtos",
            value: enterprises.reduce((a, e) => a + e.products.length, 0),
            icon: Package,
            color: "#EA580C",
            bg: "#FFF7ED",
          },
          {
            label: "Donos Cadastrados",
            value: ownerUsers.length,
            icon: Users,
            color: "#2563EB",
            bg: "#EFF6FF",
          },
          {
            label: "Usuários Ativos",
            value: users.filter((u) => u.active).length,
            icon: UserCheck,
            color: "#16A34A",
            bg: "#F0FDF4",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm"
          >
            <div
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
              style={{ background: stat.bg }}
            >
              <stat.icon
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: stat.color }}
              />
            </div>
            <p
              className="text-xl sm:text-2xl font-black text-gray-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {stat.value}
            </p>
            <p
              className="text-gray-500 text-sm"
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 600,
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Adicionar empreendimento",
            icon: Store,
            action: () => {
              setTab("enterprises");
              setShowAddEnterprise(true);
            },
            color: "linear-gradient(135deg, #7C3AED, #EA580C)",
          },
          {
            label: "Cadastrar novo usuário",
            icon: Users,
            action: () => {
              setTab("users");
              setShowAddUser(true);
            },
            color: "linear-gradient(135deg, #2563EB, #7C3AED)",
          },
          {
            label: "Ver site público",
            icon: Home,
            action: () => navigate("/"),
            color: "linear-gradient(135deg, #EA580C, #FBBF24)",
          },
        ].map((action) => (
          <button
            key={action.label}
            onClick={action.action}
            className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            style={{
              background: action.color,
              fontFamily: "Nunito, sans-serif",
            }}
          >
            <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Recent enterprises */}
      <div className="mt-6 sm:mt-8">
        <h2
          className="text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
          }}
        >
          Empreendimentos recentes
        </h2>
        <div className="space-y-2 sm:space-y-3">
          {enterprises.slice(0, 5).map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm"
            >
              <img
                src={e.coverImage}
                alt={e.name}
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-gray-900 text-sm sm:text-base truncate"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {e.name}
                </p>
                <p
                  className="text-gray-500 text-xs sm:text-sm truncate"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {e.category}
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <p
                  className="text-gray-900 font-bold text-sm"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {e.products.length}
                </p>
                <p
                  className="text-gray-400 text-xs"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  produtos
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
