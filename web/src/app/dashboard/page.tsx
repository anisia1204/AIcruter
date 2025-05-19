import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/getUser";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { isAuthenticated } = await getUser();

  if (!isAuthenticated) redirect("/login");

  return (
    <section className="container mx-auto">
      <Link href={"/create-job"}>
        <Button className="cursor-pointer">Create Job</Button>
      </Link>
      <Link href={"/jobs"}>
        <Button className="cursor-pointer">See Created Jobs</Button>
      </Link>
    </section>
  );
}
