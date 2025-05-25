"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getApplicantProfile } from "@/lib/api/applicant";
import { ApplicantProfile as ApplicantProfileType } from "@/types/applicant";
import { User, Mail, Phone, GraduationCap, FileText, Download } from "lucide-react";

interface ApplicantProfileProps {
  applicantId: string;
  token: string;
}

export default function ApplicantProfile({ applicantId, token }: ApplicantProfileProps) {
  const [profile, setProfile] = useState<ApplicantProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await getApplicantProfile(applicantId, token);
        if (error) {
          setError(error);
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError("Failed to load applicant profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [applicantId, token]);

  const handleDownloadResume = () => {
    if (profile?.resumeVO?.base64EncodedStringOfFileContent) {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${profile.resumeVO.base64EncodedStringOfFileContent}`;
      link.download = profile.resumeVO.name;
      link.click();
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-red-600">Failed to load applicant profile: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Applicant Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h3>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {profile.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {profile.telephone}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {profile.resumeVO && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadResume}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume ({profile.resumeVO.name})
              </Button>
            )}
          </div>
        </div>

        {profile.education && (
          <div>
            <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4" />
              Education
            </h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {profile.education}
            </p>
          </div>
        )}

        {profile.description && (
          <div>
            <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              Description
            </h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {profile.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
