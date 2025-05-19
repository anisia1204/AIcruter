import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/getUser";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { isAuthenticated } = await getUser();

  if (!isAuthenticated) redirect("/login");

  return (
    <section className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recruiter Dashboard</h1>
        <p className="text-gray-600 text-base">
          Welcome to your company portal. From here, you can manage job postings
          and review existing listings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
        <Link href="/create-job">
          <Button className="w-full h-full text-lg py-6 cursor-pointer">
            <PlusCircle className="w-6 h-6 text-white" /> Create New Job
          </Button>
        </Link>

        <Link href="/jobs">
          <Button
            variant="outline"
            className="w-full h-full text-lg py-6 cursor-pointer"
          >
            📄 View Created Jobs
          </Button>
        </Link>

        <Link href="/profile">
          <Button
            variant="ghost"
            className="w-full h-full text-lg py-6 cursor-pointer"
          >
            👤 Company Profile
          </Button>
        </Link>
      </div>
    </section>
  );
}
