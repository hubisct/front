import { Plus, UserX, UserCheck, Pencil, Trash2 } from "lucide-react";

export function UsersTab({
  ownerUsers,
  adminUsers,
  setShowAddUser,
  updateUser,
  setEditUser,
  setDeleteUser,
  enterprises,
  user,
  btnPrimary,
}: any) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h1
          className="text-gray-900 text-xl sm:text-2xl lg:text-3xl"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 800,
          }}
        >
          Gestão de Usuários
        </h1>
        <button
          onClick={() => setShowAddUser(true)}
          className={btnPrimary + " text-sm"}
          style={{
            background: "linear-gradient(135deg, #7C3AED, #EA580C)",
          }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo usuário</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      {/* Owners */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-1.5 h-5 rounded-full"
            style={{
              background: "linear-gradient(180deg, #7C3AED, #EA580C)",
            }}
          />
          <h2
            className="text-gray-800 text-sm sm:text-base"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
            }}
          >
            Donos de Empreendimentos ({ownerUsers.length})
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {ownerUsers.map((u: any) => {
            const linked = enterprises.find((e: any) => e.id === u.enterpriseId);
            return (
              <div
                key={u.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap"
              >
                <div
                  className="w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #EA580C)",
                  }}
                >
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 order-1 sm:order-none">
                  <p
                    className="text-gray-900 font-bold text-sm"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {u.name}
                  </p>
                  <p
                    className="text-gray-500 text-xs truncate"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {u.email}
                  </p>
                  {linked && (
                    <p
                      className="text-purple-600 text-xs font-bold truncate mt-0.5"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Loja: {linked.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-auto sm:ml-0">
                  <button
                    onClick={() => updateUser(u.id, { active: !u.active })}
                    className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
                      u.active
                        ? "text-orange-500 border-orange-200 hover:bg-orange-50"
                        : "text-green-500 border-green-200 hover:bg-green-50"
                    }`}
                    title={u.active ? "Desativar" : "Ativar"}
                  >
                    {u.active ? (
                      <UserX className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    ) : (
                      <UserCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditUser(u)}
                    className="p-1.5 sm:p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                  >
                    <Pencil className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteUser(u)}
                    className="p-1.5 sm:p-2 rounded-xl text-red-500 hover:bg-red-50 border border-red-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {ownerUsers.length === 0 && (
            <p
              className="text-gray-400 text-sm text-center py-6"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Nenhum dono cadastrado
            </p>
          )}
        </div>
      </div>

      {/* Admins */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-1.5 h-5 rounded-full"
            style={{
              background: "linear-gradient(180deg, #2563EB, #7C3AED)",
            }}
          />
          <h2
            className="text-gray-800 text-sm sm:text-base"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
            }}
          >
            Administradores ({adminUsers.length})
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {adminUsers.map((u: any) => (
            <div
              key={u.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap"
            >
              <div
                className="w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                }}
              >
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 order-1 sm:order-none">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className="text-gray-900 font-bold text-sm"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {u.name}
                  </p>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Admin
                  </span>
                </div>
                <p
                  className="text-gray-500 text-xs truncate"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {u.email}
                </p>
              </div>
              {u.id !== user.id && (
                <div className="flex items-center gap-1 flex-shrink-0 ml-auto sm:ml-0">
                  <button
                    onClick={() => setEditUser(u)}
                    className="p-1.5 sm:p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                  >
                    <Pencil className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteUser(u)}
                    className="p-1.5 sm:p-2 rounded-xl text-red-500 hover:bg-red-50 border border-red-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
