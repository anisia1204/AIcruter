import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MainView from '@/components/templates/MainView';
import { apiGet } from '@/lib/api';
import { EmploymentType, JobLocationType } from '@/domain/VOandEnums';
import { Job } from '@/domain/classTypes';
import Toast from 'react-native-toast-message';
import { Loader } from '@/components/atoms/Loader';
import JobCard from '@/components/moleculas/JobCard';
import SearchBar from '@/components/atoms/SearchBar';
import FiltersBar from '@/components/moleculas/FiltersBar';
import Pagination from '@/components/atoms/Pagination';

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

export default function HomeScreen() {

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
      console.log("data", data)
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

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination]);


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
                createdAt={job.createdAt}
                status={job.status}
              />
            ))
          ) : (
            <Loader />
          )}
        </View>
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
