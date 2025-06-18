import { Button } from "@workspace/ui/components/button";

export default function SignInWithGoogleButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return <Button onClick={onClick}>Sign in with Google</Button>;
}
