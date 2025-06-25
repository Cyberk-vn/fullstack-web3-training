import { LoginButton } from "./_components/LoginButton";

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white flex flex-col items-center rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to continue
          </p>
        </div>

        <div className="mt-8 mx-auto space-y-6">
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
