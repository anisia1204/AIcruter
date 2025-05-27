import { Loader } from '@/components/atoms/Loader';
import SearchBar from '@/components/atoms/SearchBar';
import MainView from '@/components/templates/MainView';
import { Company } from '@/domain/classTypes';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/providers/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import Pagination from '@/components/atoms/Pagination';

import DropDownPicker from 'react-native-dropdown-picker';
import CompanyCard from '@/components/moleculas/cards/CompanyCard';
import useAuthTokenGuard from '@/lib/useAuthTokenGuard';

type Pagination = {
    page: number;
    size: number;
    sortField: string;
    sortOrder: string;
};

const CompaniesScreen = () => {
    useAuthTokenGuard();
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[] | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        page: 0,
        size: 4,
        sortField: 'name',
        sortOrder: 'asc',
    });
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ name: '', state: '', city: '' });
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [stateOptions, setStateOptions] = useState<{ label: string; value: string }[]>([]);
    const [selectedState, setSelectedState] = useState<string>('');
    const [showStateModal, setShowStateModal] = useState(false);

    useEffect(() => {
        const getStatesFromCompanies = async () => {
            try {
                const data = await apiGet(`/api/job/states`);
                const stateOptions = [
                    { label: 'All states', value: '' },
                    ...data.map((d: string) => ({
                        label: d,
                        value: d,
                    }))
                ];
                setStateOptions(stateOptions);
            } catch (err) {
                Toast.show({
                    type: 'error',
                    text1: 'Server error',
                });
                console.error('Failed to fetch jobs', err);
            }
        };
        getStatesFromCompanies();
    }, []);

    const handleSearch = (text: string) => {
        setSearch(text);
        setFilters((prev) => ({ ...prev, name: text }));
    };

    const handleStateChange = (value: string | null) => {
        setSelectedState(value ?? '');
        setFilters((prev) => ({ ...prev, state: value ?? '' }));
    };

    const fetchCompanies = async () => {
        setLoadingCompanies(true);
        const query = new URLSearchParams();
        if (filters.name) query.append('name', filters.name);
        if (filters.state) query.append('state', filters.state);
        if (filters.city) query.append('city', filters.city);
        query.append('page', pagination.page.toString());
        query.append('size', pagination.size.toString());
        query.append('sortField', pagination.sortField);
        query.append('sortOrder', pagination.sortOrder);
        try {
            const data = await apiGet(`/api/company/all?${query.toString()}`);
            setCompanies(data.content);
            setTotalPages(data.totalPages);
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Server error' });
            setCompanies(null);
            console.error('Failed to fetch companies', err);
        } finally {
            setLoadingCompanies(false);
        }
    };


    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/sign-in');
        }
    }, [loading, isAuthenticated]);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchCompanies();
        }
    }, [loading, isAuthenticated]);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchCompanies();
        }
    }, [filters, pagination, loading, isAuthenticated]);

    if (loading || !isAuthenticated) {
        return (
            <View style={styles.centeredContent}>
                <Loader />
            </View>
        );
    }

    return (
        <MainView style={{ flex: 1, backgroundColor: 'transparent' }}>
            <View style={styles.container}>
                <SearchBar
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search company name"
                />
                <DropDownPicker
                    open={showStateModal}
                    value={selectedState}
                    items={stateOptions}
                    setOpen={setShowStateModal}
                    setValue={setSelectedState}
                    setItems={setStateOptions}
                    placeholder="All states"
                    onChangeValue={handleStateChange}
                    listMode="SCROLLVIEW"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    modalProps={{ animationType: 'slide' }}
                    modalContentContainerStyle={{ padding: 16 }}
                    labelStyle={styles.dropdownLabel}
                    textStyle={styles.dropdownText}
                />

                {loadingCompanies ? (
                    <Loader />
                ) : companies && companies.length > 0 ? (
                    companies.map((company) => (
                        <TouchableOpacity
                            key={company.id}
                            onPress={() => router.push({ pathname: '/companies/companyDetails/[id]', params: { id: company.id.toString() } })}
                            activeOpacity={0.8}
                        >
                            <CompanyCard company={company} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noItemsText}>No companies found.</Text>
                )}
            </View>
            {companies && companies.length > 0 && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
                />
            )}
        </MainView>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 10
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
    dropdown: {
        backgroundColor: '#fff',
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop: 8,
        zIndex: 1000,
    },

    dropdownContainer: {
        backgroundColor: '#fff',
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 8,

    },

    dropdownLabel: {
        color: '#555',
        fontWeight: '500',
    },

    dropdownText: {
        fontSize: 16,
        color: '#333',
    }

});


export default CompaniesScreen;