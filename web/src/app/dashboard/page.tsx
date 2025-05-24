import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth/getUser";
import { getAllCompanyJobs } from "@/lib/api/jobs";
import { getAllJobApplicationsForJob } from "@/lib/api/jobApplications";
import { JOB_STATUS } from "@/types/job";
import { JOB_APPLICATION_STATUS } from "@/types/jobApplication";
import {
  PlusCircle,
  Briefcase,
  Building2,
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  totalApplications: number;
  pendingApplications: number;
  recentJobs: Array<{
    id: number;
    title: string;
    createdAt: string;
    applicationCount: number;
  }>;
}

async function getDashboardStats(token: string): Promise<DashboardStats> {
  const { data: jobs, error: jobsError } = await getAllCompanyJobs(token);

  if (jobsError || !jobs) {
    return {
      totalJobs: 0,
      activeJobs: 0,
      closedJobs: 0,
      totalApplications: 0,
      pendingApplications: 0,
      recentJobs: [],
    };
  }

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(
    (job) => job.status === JOB_STATUS.OPEN
  ).length;
  const closedJobs = jobs.filter(
    (job) => job.status === JOB_STATUS.CLOSED
  ).length;

  let totalApplications = 0;
  let pendingApplications = 0;
  const recentJobs = [];

  const sortedJobs = jobs
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  for (const job of sortedJobs) {
    const { data: applications } = await getAllJobApplicationsForJob(
      job.id.toString(),
      token
    );
    const applicationCount = applications?.length || 0;
    totalApplications += applicationCount;

    const jobPendingApps =
      applications?.filter(
        (app) =>
          app.status === JOB_APPLICATION_STATUS.NEW ||
          app.status === JOB_APPLICATION_STATUS.IN_REVIEW
      ).length || 0;
    pendingApplications += jobPendingApps;

    recentJobs.push({
      id: job.id,
      title: job.title,
      createdAt: job.createdAt,
      applicationCount,
    });
  }

  for (const job of jobs.filter(
    (j) => !sortedJobs.find((sj) => sj.id === j.id)
  )) {
    const { data: applications } = await getAllJobApplicationsForJob(
      job.id.toString(),
      token
    );
    totalApplications += applications?.length || 0;

    const jobPendingApps =
      applications?.filter(
        (app) =>
          app.status === JOB_APPLICATION_STATUS.NEW ||
          app.status === JOB_APPLICATION_STATUS.IN_REVIEW
      ).length || 0;
    pendingApplications += jobPendingApps;
  }

  return {
    totalJobs,
    activeJobs,
    closedJobs,
    totalApplications,
    pendingApplications,
    recentJobs,
  };
}

export default async function DashboardPage() {
  const { isAuthenticated, token } = await getUser();

  if (!isAuthenticated) redirect("/login");

  const stats = await getDashboardStats(token!);

  return (
    <section className="container mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">
          Recruiter Dashboard
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Welcome to your company portal. Manage your job postings, review
          applications, and track your recruitment progress all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalJobs}
            </div>
            <p className="text-xs text-gray-500">
              {stats.activeJobs} active, {stats.closedJobs} closed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Jobs
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.activeJobs}
            </div>
            <p className="text-xs text-gray-500">
              Currently accepting applications
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalApplications}
            </div>
            <p className="text-xs text-gray-500">Across all job postings</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Reviews
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.pendingApplications}
            </div>
            <p className="text-xs text-gray-500">Awaiting your review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link href="/create-job" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-200">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <PlusCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Create New Job
              </h3>
              <p className="text-gray-600 text-sm">
                Post a new job opening and start attracting qualified candidates
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/jobs" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-200">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                View Created Jobs
              </h3>
              <p className="text-gray-600 text-sm">
                Manage your existing job postings and track their performance
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profile" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-200">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Company Profile
              </h3>
              <p className="text-gray-600 text-sm">
                Update your company information and recruitment preferences
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Recent Job Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentJobs.length > 0 ? (
                stats.recentJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          index === 0
                            ? "text-green-600"
                            : index === 1
                            ? "text-blue-600"
                            : "text-purple-600"
                        }`}
                      >
                        {job.applicationCount} applications
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No jobs posted yet</p>
                  <p className="text-sm">
                    Create your first job to see performance data
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/jobs">
                  <Users className="w-4 h-4 mr-2" />
                  Review Pending Applications ({stats.pendingApplications})
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/create-job">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Post Another Job Opening
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/profile">
                  <Building2 className="w-4 h-4 mr-2" />
                  Update Company Information
                </Link>
              </Button>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Tips for Better Recruitment
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Update job descriptions regularly</li>
                  <li>• Respond to applications within 48 hours</li>
                  <li>• Keep your company profile current</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
