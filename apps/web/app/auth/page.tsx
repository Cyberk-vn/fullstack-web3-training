import { SignInWithGoogleButton } from "./_components/SignInWithGoogleButton";

export default function AuthPage() {
  return (
    <div className="grid grid-cols-1">
      <p>Login</p>
      <SignInWithGoogleButton />
    </div>
  );
}
