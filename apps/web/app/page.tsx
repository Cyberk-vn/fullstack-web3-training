import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function Page() {
  // Redirect to auth page immediately
  redirect(ROUTES.AUTH);
}
