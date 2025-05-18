import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MainView from '@/components/templates/MainView';
import { apiGet } from '@/lib/api';
import { EmploymentType, JobApplicationStatus, JobLocationType } from '@/domain/VOandEnums';
import { JobApplication } from '@/domain/classTypes';
import Toast from 'react-native-toast-message';
import { Loader } from '@/components/atoms/Loader';
import JobCard from '@/components/moleculas/cards/JobCard';
import Pagination from '@/components/atoms/Pagination';
import JobAppStatusFilter from '@/components/moleculas/filters/JobAppStatusFilter';

export type Filters = {
  title: string;
  state: string;
  locationType: JobLocationType | undefined;
  employmentType: EmploymentType | undefined;
};

type Pagination = {
  page: number;
  size: number;
  sortField: string;
  sortOrder: string;
};

const ApplicationsScreen = () => {

  const [jobApplications, setJobApplications] = useState<JobApplication[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<JobApplicationStatus | undefined>(undefined);
  const [totalPages, setTotalPages] = useState(0);

  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 3,
    sortField: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchJobApplications = async () => {
    const query = new URLSearchParams();
    if (statusFilter) query.append('status', statusFilter);

    query.append('page', pagination.page.toString());
    query.append('size', pagination.size.toString());
    query.append('sortField', pagination.sortField);
    query.append('sortOrder', pagination.sortOrder);

    try {
      const data = await apiGet(`/api/job-application?${query.toString()}`);
      setJobApplications(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Server error',
      });
      console.error('Failed to fetch job applications', err);
    }
  };

  useEffect(() => {
    fetchJobApplications();
  }, []);

  useEffect(() => {
    fetchJobApplications();
  }, [statusFilter, pagination]);

  return (
    <MainView>
      <View style={styles.container}>
        <JobAppStatusFilter
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <View>
          {jobApplications ? (
            jobApplications.map((jobApplication, index) => (
              <JobCard
                key={jobApplication.id ?? `job-${index}`}
                jobTitle={jobApplication.title}
                companyName={jobApplication.companyName}
                employmentType={jobApplication.employmentType}
                locationType={jobApplication.jobLocationType}
                state={jobApplication.state}
                city={jobApplication.city}
                createdOrAppliedAt={jobApplication.createdAt}
                status={jobApplication.status}
                country={jobApplication.country}
                isJobApplicationCard={true}
              />
            ))
          ) : (
            <Loader />
          )}
        </View>
        {jobApplications && jobApplications.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setPagination(prev => ({ ...prev, page: newPage }));
            }}
          />
        )}

      </View>
    </MainView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10
  },
});

export default ApplicationsScreen;