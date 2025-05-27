import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { Loader } from '@/components/atoms/Loader';
import SearchBar from '@/components/atoms/SearchBar';
import FiltersBar from '@/components/moleculas/filters/FiltersBar';
import JobCard from '@/components/moleculas/cards/JobCard';
import Pagination from '@/components/atoms/Pagination';
import { apiGet, apiPost } from '@/lib/api';
import { Job, Company } from '@/domain/classTypes';
import { EmploymentType, JobLocationType } from '@/domain/VOandEnums';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import JobDetailsModal from '@/components/moleculas/modals/JobDetailsModal';
import useAuthTokenGuard from '@/lib/useAuthTokenGuard';

const CompanyScreen = () => {
    useAuthTokenGuard();
    const { id } = useLocalSearchParams();
    const [company, setCompany] = useState<Company | null>(null);
    const [jobs, setJobs] = useState<Job[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [filters, setFilters] = useState({
        title: '',
        state: '',
        locationType: undefined as JobLocationType | undefined,
        employmentType: undefined as EmploymentType | undefined,
    });
    const [pagination, setPagination] = useState({
        page: 0,
        size: 3,
        sortField: 'createdAt',
        sortOrder: 'desc',
    });
    const [totalPages, setTotalPages] = useState(0);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchCompany = async () => {
            setLoading(true);
            try {
                const data = await apiGet(`/api/company/profile/${id}`);
                setCompany(data);
            } catch (err) {
                Toast.show({ type: 'error', text1: 'Failed to load company' });
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [id]);

    const fetchJobs = async () => {
        setLoadingJobs(true);
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
            const data = await apiGet(`/api/job/company/${id}?${query.toString()}`);
            setJobs(data.content);
            setTotalPages(data.totalPages);
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Failed to load jobs' });
            setJobs(null);
        } finally {
            setLoadingJobs(false);
        }
    };

    useEffect(() => {
        if (company) fetchJobs();
    }, [company, filters, pagination]);

    const handleCardPress = (job: Job) => {
        setSelectedJob(job);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedJob(null);
    };

    if (loading) {
        return <View style={styles.centeredContent}><Loader /></View>;
    }

    if (!company) {
        return <View style={styles.centeredContent}><Text>Company not found.</Text></View>;
    }

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

    const initials = company.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const address = company.legalAddressDTO
        ? `${company.legalAddressDTO.addressLine}, ${company.legalAddressDTO.city}, ${company.legalAddressDTO.state}, ${company.legalAddressDTO.country}`
        : '';

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f6fa' }} contentContainerStyle={{ paddingBottom: 32 }}>
            <View style={styles.headerBox}>
                <LinearGradient colors={["#3F51B5", "#5A6FF0"]} style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </LinearGradient>
                <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>{company.name}</Text>
                    <Text style={styles.companyAddress}>{address}</Text>
                </View>
            </View>
            <View style={styles.jobsSection}>
                <SearchBar
                    value={filters.title}
                    onChange={text => setFilters(f => ({ ...f, title: text }))}
                    placeholder="Search job title..."
                />
                <FiltersBar filters={filters} setFilters={setFilters} />
                <View style={styles.centeredContent}>
                    {loadingJobs ? (
                        <Loader />
                    ) : jobs && jobs.length > 0 ? (
                        jobs.map((job, idx) => (
                            <JobCard
                                key={job.id ?? `job-${idx}`}
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
                        <Text style={styles.noItemsText}>No jobs available.</Text>
                    )}
                </View>
                <JobDetailsModal
                    job={selectedJob}
                    visible={modalVisible}
                    onClose={handleCloseModal}
                    onApply={handleApply}
                    isJobAppliedTo={false}
                />
                {jobs && jobs.length > 0 && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={totalPages}
                        onPageChange={newPage => setPagination(prev => ({ ...prev, page: newPage }))}
                    />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    headerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        margin: 16,
        marginBottom: 8,
        shadowColor: '#3F51B5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 10,
        elevation: 4,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24,
        letterSpacing: 1,
    },
    companyInfo: {
        flex: 1,
    },
    companyName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3F51B5',
        marginBottom: 4,
    },
    companyAddress: {
        fontSize: 15,
        color: '#444',
    },
    jobsSection: {
        marginHorizontal: 10,
        marginTop: 8,
        gap: 20,
    },
    centeredContent: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        flex: 1,
    },
    noItemsText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 18,
        marginTop: 32,
    },
});

export default CompanyScreen;