type LoginProps = {
  error?: string;
};

export default function Login({ error }: LoginProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-md place-items-center">
        <section className="w-full rounded-2xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-200/40">
          <h1 className="text-center text-3xl font-bold tracking-tight text-red-700">
            Sign in to your account
          </h1>

          <form action="/api/auth" method="post" className="mt-6 space-y-4">
            <div>
              <label 
                htmlFor="Password"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Password
              </label>
              <input
                id="Password"
                name="Password"
                type="password"
                required
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-500 transition placeholder:text-slate-400 focus:ring-2"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-red-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}