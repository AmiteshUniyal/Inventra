import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 left-0 z-40">
      <SidebarContent />
    </aside>
  );
}