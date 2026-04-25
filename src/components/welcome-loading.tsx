export function WelcomeLoading() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <img
        src="/trajectory-logo.svg"
        alt="Loading"
        className="w-24 h-24 animate-spin"
        style={{ animationDuration: "0.8s" }}
      />
    </main>
  );
}
