"use client";

import { usePathname } from "next/navigation";
import AdminNav from "./AdminNav";

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
  <>
    <header className="border-b border-white/10 bg-slate-950 text-white">
      <div className="flex w-full flex-col gap-5 px-8 py-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="shrink-0">
          <p className="text-xl font-black tracking-tight">
            DROP IT{" "}
            <span className="text-orange-500">
              ADMIN
            </span>
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Courier Management System
          </p>
        </div>

        <div className="flex-1 xl:flex xl:justify-start xl:pl-20">
  <AdminNav />
</div>
      </div>
    </header>

    {children}
  </>
);
}