"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { 
  useGetProductsQuery, 
  useDeleteProductMutation,
  useUpdateProductMutation,
  useCreateProductMutation 
} from "@/services/productAPI";
import RoleGuard from "@/components/RoleGuard";
import { 
  Package, Search, Filter, Plus, Trash2, Edit3, 
  AlertCircle, CheckCircle2, XCircle, ArrowRightLeft, X, ChevronLeft, ChevronRight
} from "lucide-react";

export default function ProductsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data, isLoading, isError } = useGetProductsQuery({ page, status });
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [createProduct] = useCreateProductMutation();

  const isAdmin = user?.role === "ADMIN";

  if (isLoading) return <div className="p-10 text-white animate-pulse font-black text-center uppercase tracking-widest">Scanning Inventory Vault...</div>;
  if (isError) return <div className="p-10 text-red-500 text-center font-bold">Failed to sync with Inventory Server.</div>;

  const products = data?.items || [];

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      productCode: formData.get("productCode") as string,
      quantity: Number(formData.get("quantity")),
      departmentId: formData.get("departmentId") as string,
    };

    try {
      if (selectedProduct) {
        await updateProduct({ id: selectedProduct.id, ...payload }).unwrap();
      } 
      else {
        await createProduct(payload).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Operation failed", err);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-6 sm:space-y-8 pb-10 px-2 sm:px-6">
      
      {/* 1. Header */}
      <div className="sticky top-4 z-20 bg-white/10 backdrop-blur-xl border border-white/5 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter truncate">
            {isAdmin ? "Global Stock" : "Sector Inventory"}
          </h1>
          <p className="text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
            {isAdmin ? "Full Warehouse Access" : `Departmental Control`}
          </p>
        </div>

        <RoleGuard allowed={["ADMIN", "MANAGER"]}>
          <button 
            onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black transition-all active:scale-95 text-[10px] sm:text-xs uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </RoleGuard>
      </div>

      {/* 2. Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text"
            placeholder="Search by name or code..."
            className="w-full bg-[#333d4d] border border-white/5 rounded-xl sm:rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-white outline-none focus:border-blue-500 transition-all text-sm placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-[#333d4d] border border-white/5 text-white rounded-xl sm:rounded-2xl px-5 py-3 sm:py-4 text-sm outline-none focus:border-blue-500 cursor-pointer appearance-none"
          value={status ?? ""}
          onChange={(e) => {
            setStatus(e.target.value || undefined);
            setPage(1); // Reset to page 1 on filter change
          }}
        >
          <option value="">All Status</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {/* 3. Responsive List View */}
      {/* Mobile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredProducts.map((product: any) => (
          <div key={product.id} className="bg-[#333d4d] p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Package size={20}/></div>
                <div className="min-w-0">
                  <p className="text-white font-bold truncate">{product.name}</p>
                  <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">{product.productCode}</p>
                </div>
              </div>
              <StockBadge status={product.status} />
            </div>
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
               <span className="text-xs text-gray-400 uppercase font-black">Quantity: {product.quantity}</span>
               <div className="flex gap-2">
                  <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="p-2 bg-white/5 rounded-lg text-gray-400"><Edit3 size={16}/></button>
                  <RoleGuard allowed={["ADMIN"]}>
                    <button onClick={() => deleteProduct(product.id)} className="p-2 bg-red-500/10 rounded-lg text-red-500"><Trash2 size={16}/></button>
                  </RoleGuard>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-[#333d4d] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-500 uppercase text-[10px] tracking-widest font-black">
              <th className="px-8 py-6">Product</th>
              <th className="px-8 py-6 text-center">Stock</th>
              <th className="px-8 py-6">Status</th>
              {isAdmin && <th className="px-8 py-6">Department</th>}
              <th className="px-8 py-6 text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((product: any) => (
              <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0"><Package size={20}/></div>
                    <div className="min-w-0"><p className="text-white font-bold truncate">{product.name}</p><p className="text-[9px] font-mono text-gray-500 uppercase">{product.productCode}</p></div>
                  </div>
                </td>
                <td className="px-8 py-6 text-center font-black text-white">{product.quantity}</td>
                <td className="px-8 py-6"><StockBadge status={product.status} /></td>
                {isAdmin && <td className="px-8 py-6 text-xs text-gray-400 uppercase font-bold">{product.department?.name}</td>}
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-all active:scale-90"><Edit3 size={18}/></button>
                    <RoleGuard allowed={["ADMIN"]}>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-all active:scale-90"><Trash2 size={18}/></button>
                    </RoleGuard>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#333d4d] p-6 rounded-[2rem] border border-white/5 shadow-xl">
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Navigation Control</span>
          <div className="text-xs font-black text-white uppercase tracking-tighter">
            Page <span className="text-blue-500">{data.currentPage}</span> of {data.totalPages}
          </div>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all active:scale-95"
          >
            <ChevronLeft size={14} />
            Prev
          </button>
          <button
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all active:scale-95"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in duration-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  {selectedProduct ? "Update Stock" : "New Inventory Item"}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Name</label>
                  <input name="name" defaultValue={selectedProduct?.name} required disabled={user?.role === "STAFF"} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 disabled:opacity-50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Quantity</label>
                    <input name="quantity" type="number" defaultValue={selectedProduct?.quantity} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Code</label>
                    <input name="productCode" defaultValue={selectedProduct?.productCode} required disabled={user?.role === "STAFF"} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 disabled:opacity-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Department UUID</label>
                  <input name="departmentId" defaultValue={selectedProduct?.departmentId || user?.departmentId} required disabled={!isAdmin} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 disabled:opacity-50" />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase py-5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                {selectedProduct ? "Apply Changes" : "Confirm Entry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StockBadge({ status }: { status: string }) {
  const configs: any = {
    IN_STOCK: { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <CheckCircle2 size={12}/> },
    LOW_STOCK: { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <AlertCircle size={12}/> },
    OUT_OF_STOCK: { bg: "bg-red-500/10 text-red-400 border-red-500/20", icon: <XCircle size={12}/> },
  };
  const config = configs[status] || configs.OUT_OF_STOCK;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${config.bg}`}>
      {config.icon}
      {status.replace("_", " ")}
    </span>
  );
}