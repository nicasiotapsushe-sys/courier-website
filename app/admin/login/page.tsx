import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        "Invalid email or password."
      )}`
    );
  }

  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-2xl md:p-10">

          <div className="mb-8 text-center">
            <Image
              src="/logos/drop-it-logo.png"
              alt="Drop It Courier Services"
              width={210}
              height={80}
              priority
              className="mx-auto h-auto w-[210px]"
            />

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-orange-500">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Admin Login
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to manage shipments, quotation requests and courier
              operations.
            </p>
          </div>

          {params.error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {params.error}
            </div>
          )}

          <form action={login} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@dropit.co.bw"
                className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-600"
            >
              Sign In
            </button>
          </form>

          <p className="mt-7 text-center text-xs leading-5 text-slate-400">
            Drop It Courier Services administrative access.
          </p>
        </div>
      </div>
    </main>
  );
}