// import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PropsWithChildren } from "react";


export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  
	//const router = useRouter();

	// async function handleLogout() {
	// 	const res = await fetch("/api/auth", { method: "DELETE" });
	// 	if (res.ok) {
	// 		router.push("/");
	// 		router.refresh();
	// 	}
  	// }
	
	return (
    <div className="py-6 mr-36">
      <form action="/api/auth/logout" method="post" className="absolute right-4 top-4 z-10">
        <button
          type="submit"
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
        >
          Logout
        </button>
      </form>

	    <main>
        {children}
      </main>
    </div>
  );
}
