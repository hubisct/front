import { Plus, Trash2, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { getCategoryColors } from "../../utils/categoryStyle";

export function CategoriesTab({
  categoryError,
  setCategoryError,
  setShowAddCategory,
  categoriesLoading,
  sortedCategories,
  pagedCategories,
  setEditCategory,
  setDeleteCategory,
  categoryPage,
  setCategoryPage,
  totalCategoryPages,
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
          Gestão de Categorias
        </h1>
        <button
          onClick={() => {
            setShowAddCategory(true);
            setCategoryError("");
          }}
          className={btnPrimary + " text-sm"}
          style={{
            background: "linear-gradient(135deg, #7C3AED, #EA580C)",
          }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova categoria</span>
          <span className="sm:hidden">Nova</span>
        </button>
      </div>

      {categoryError && (
        <div
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-semibold"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {categoryError}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-50 via-white to-orange-50">
              <TableHead className="text-gray-700 text-xs uppercase tracking-wider font-semibold">
                Categoria
              </TableHead>
              <TableHead className="text-right text-gray-700 text-xs uppercase tracking-wider font-semibold">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:nth-child(even)]:bg-gray-50/60">
            {categoriesLoading && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-gray-400"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Carregando categorias...
                </TableCell>
              </TableRow>
            )}
            {!categoriesLoading && sortedCategories.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-gray-400"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Nenhuma categoria cadastrada
                </TableCell>
              </TableRow>
            )}
            {!categoriesLoading &&
              pagedCategories.map((cat: any) => (
                <TableRow key={cat.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-sm font-bold"
                        style={{
                          fontFamily: "Nunito, sans-serif",
                          backgroundColor: getCategoryColors(cat.color).bg,
                          color: getCategoryColors(cat.color).text,
                          borderColor: getCategoryColors(cat.color).bg,
                        }}
                      >
                        {cat.emoji || "🏷️"}
                      </span>
                      <p
                        className="text-gray-900 font-bold text-sm sm:text-base truncate"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        {cat.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditCategory(cat);
                          setCategoryError("");
                        }}
                        className="p-1.5 sm:p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteCategory(cat);
                          setCategoryError("");
                        }}
                        className="p-1.5 sm:p-2 rounded-xl text-red-500 hover:bg-red-50 border border-red-200 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {!categoriesLoading && sortedCategories.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <span
            className="text-sm text-gray-500 font-semibold"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Pagina {categoryPage} de {totalCategoryPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCategoryPage((p: number) => Math.max(1, p - 1))}
              disabled={categoryPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setCategoryPage((p: number) =>
                  Math.min(totalCategoryPages, p + 1),
                )
              }
              disabled={categoryPage === totalCategoryPages}
              className="px-3 py-1.5 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Proxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
