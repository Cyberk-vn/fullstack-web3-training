import { Button } from "@workspace/ui/components/button";
import { SignInWithGoogleButton } from "./_components/SignWithGoogleButton";

export default function AuthPage() {
  return (
    <div className="">
      <h1>Login</h1>
      <SignInWithGoogleButton />
    </div>
  );
}
