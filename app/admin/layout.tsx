export const dynamic = "force-dynamic";
export const revalidate = 0;

import AdminLayoutShell from "@/components/admin/AdminLayoutShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutShell>
      {children}
    </AdminLayoutShell>
  );
}