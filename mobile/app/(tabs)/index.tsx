import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import MainView from '@/components/templates/MainView';
import { apiGet } from '@/lib/api';
import { EmploymentType, JobLocationType } from '@/domain/VOandEnums';
import { Job } from '@/domain/classTypes';
import Toast from 'react-native-toast-message';

type Filters = {
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

  const [jobs, setJobs] = useState<Job|null>(null);
  const [filters, setFilters] = useState<Filters>({
    title: '',
    state: '',
    locationType: undefined,
    employmentType: undefined,
  });

  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 10,
    sortField: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchJobs = async () => {
    const query = new URLSearchParams();

    if (filters.state) query.append('title', filters.title);
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
    } catch(err) {
      Toast.show({
        type: 'error',
        text1: 'Sserver error',
      });
      console.error('Failed to fetch jobs', err);
    }
  };
  // useEffect(() => {
  //   fetchJobs();
  // }, [filters, pagination]);

  return (
    <MainView>
      
      <View>
      <Button title={"jobs"} onPress={fetchJobs}/>
      </View>

    </MainView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
