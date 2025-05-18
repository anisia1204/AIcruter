import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MainView from '@/components/templates/MainView';
import { apiGet, apiPost } from '@/lib/api';
import { EmploymentType, JobLocationType } from '@/domain/VOandEnums';
import { Job, JobApplication } from '@/domain/classTypes';
import Toast from 'react-native-toast-message';
import { Loader } from '@/components/atoms/Loader';
import SearchBar from '@/components/atoms/SearchBar';
import Pagination from '@/components/atoms/Pagination';
import JobDetailsModal from '@/components/moleculas/modals/JobDetailsModal';
import FiltersBar from '@/components/moleculas/filters/FiltersBar';
import JobCard from '@/components/moleculas/cards/JobCard';

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

const JobsScreen = () => {

  const [jobApplications, setJobApplications] = useState<JobApplication[] | null>(null);
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [filters, setFilters] = useState<Filters>({
    title: '',
    state: '',
    locationType: undefined,
    employmentType: undefined,
  });
  const [totalPages, setTotalPages] = useState(0);

  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 3,
    sortField: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchJobs = async () => {
    const query = new URLSearchParams();
    if (filters.title) query.append('title', filters.title);
    if (filters.state) query.append('state', filters.state);
    if (filters.locationType) query.append('locationType', filters.locationType);
    if (filters.employmentType) query.append('employmentType', filters.employmentType);

    query.append('page', pagination.page.toString());
    query.append('size', pagination.size.toString());
    query.append('sortField', pagination.sortField);
    query.append('sortOrder', pagination.sortOrder);

    try {
      const data = await apiGet(`/api/job?${query.toString()}`);
      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Server error',
      });
      console.error('Failed to fetch jobs', err);
    }
  };


  const getJobApplications = async () => {
    try {
      const jobApps = await apiGet('/api/job-application');
      setJobApplications(jobApps.content);
    } catch (err) {
      console.error('Job app error', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to get job applications',
      });
    }
  };


  useEffect(() => {
    fetchJobs();
    getJobApplications();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination]);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  const handleApply = async () => {
    if (!selectedJob) return;

    try {
      const payload = {
        jobId: selectedJob.id,
      };
      await apiPost('/api/job-application', payload);

      Toast.show({
        type: 'success',
        text1: 'Application submitted!',
      });

      handleCloseModal();
    } catch (err) {
      console.error('Apply error', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to apply',
      });
    }
  };

  return (
    <MainView>
      <View style={styles.container}>
        <SearchBar
          value={filters.title}
          onChange={(text) => setFilters({ ...filters, title: text })}
          placeholder="Search job title..."
        />
        <FiltersBar
          filters={filters}
          setFilters={setFilters}
        />
        <View>
          {jobs ? (
            jobs.map((job, index) => (
              <JobCard
                key={job.id ?? `job-${index}`}
                jobTitle={job.title}
                companyName={job.companyName}
                employmentType={job.employmentType}
                locationType={job.locationType}
                state={job.state}
                city={job.city}
                createdOrAppliedAt={job.createdAt}
                status={job.status}
                onPress={() => handleCardPress(job)}
              />
            ))

          ) : (
            <Loader />
          )}
        </View>
        <JobDetailsModal
          job={selectedJob}
          visible={modalVisible}
          onClose={handleCloseModal}
          onApply={handleApply}
          isJobAppliedTo={jobApplications?.some(app => app.jobId === selectedJob?.id) ?? false}
        />
        {jobs && jobs.length > 0 && (
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

export default JobsScreen;