export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full space-y-8 p-8 bg-white flex flex-col items-center rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Welcome! 🎉</h1>
          <p className="mt-4 text-lg text-gray-600">
            You have successfully signed in with Google.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Your authentication is now complete and you're ready to use the
            application.
          </p>
        </div>
      </div>
    </main>
  );
}
