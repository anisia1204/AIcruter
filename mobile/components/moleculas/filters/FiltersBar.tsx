import { Filters } from '@/app/(tabs)';
import { apiGet } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    FlatList,
    Dimensions,
    Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';

type FiltersBarProps = {
    filters: Filters;
    setFilters: (filters: Filters) => void;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const locationOptions = [
        { label: 'On Site', value: 'ON_SITE' },
        { label: 'Hybrid', value: 'HYBRID' },
        { label: 'Remote', value: 'REMOTE' }];

const employmentOptions = [
        { label: 'Part Time', value: 'PART_TIME' },
        { label: 'Full Time', value: 'FULL_TIME' }];

const FiltersBar = ({ filters, setFilters }: FiltersBarProps) => {

    const [stateOptions, setStateOptions] = useState<{label: string, value: string}[]>();

    const getStatesFromCompanies = async () => {
        try {
            const data = await apiGet(`/api/job/states`);
            const stateOptions = data.map((d: string) => ({
                label: d,
                value: d,
            }));
            setStateOptions(stateOptions);
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Server error',
            });
            console.error('Failed to fetch jobs', err);
        }
    };

    useEffect(() => {
        getStatesFromCompanies();
    }, []);

    const [openDropdown, setOpenDropdown] = useState<'none' | 'state' | 'locationType' | 'employmentType'>('none');
    const closeDropdown = () => setOpenDropdown('none');

    const applyFilter = (filterName: string, value: string | undefined) => {
        setFilters({ ...filters, [filterName]: value });
        setOpenDropdown('none');
    };

    const isSelected = (filterName: string) => {
        if (filterName === 'all') {
            return (
                !filters.state &&
                !filters.locationType &&
                !filters.employmentType &&
                !filters.title
            );
        }
        return !!filters[filterName as keyof typeof filters];
    };

    const renderDropdown = (
        options: { label: string; value: string | undefined }[],
        filterName: string
    ) => {
        return (
            <Modal transparent visible={openDropdown === filterName} animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeDropdown}
                >
                    <View style={styles.dropdown}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value || 'all'}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        filters[filterName as keyof typeof filters] === item.value && styles.dropdownItemSelected,
                                    ]}
                                    onPress={() => applyFilter(filterName, item.value)}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownItemText,
                                            filters[filterName as keyof typeof filters] === item.value && styles.dropdownItemTextSelected,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <TouchableOpacity
                    onPress={() => {
                        setFilters({
                            title: '',
                            state: '',
                            locationType: undefined,
                            employmentType: undefined,
                        });
                        setOpenDropdown('none');
                    }}
                    style={[styles.filterButton, isSelected('all') && styles.filterButtonSelected]}
                >
                    <Text style={[styles.filterButtonText, isSelected('all') && styles.filterButtonTextSelected]}>
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setOpenDropdown(openDropdown === 'state' ? 'none' : 'state')}
                    style={[styles.filterButton, isSelected('state') && styles.filterButtonSelected]}
                >
                    <Text
                        style={[
                            styles.filterButtonText,
                            isSelected('state') && styles.filterButtonTextSelected,
                        ]}
                    >
                        {filters.state ? `State | ${filters.state}` : 'State'}
                    </Text>
                </TouchableOpacity>
                {renderDropdown([{ label: 'All', value: '' }, ...stateOptions ?? []], 'state')}

                <TouchableOpacity
                    onPress={() => setOpenDropdown(openDropdown === 'locationType' ? 'none' : 'locationType')}
                    style={[
                        styles.filterButton,
                        isSelected('locationType') && styles.filterButtonSelected,
                    ]}
                >
                    <Text
                        style={[
                            styles.filterButtonText,
                            isSelected('locationType') && styles.filterButtonTextSelected,
                        ]}
                    >
                        {filters.locationType ? `Location Type | ${filters.locationType.replace('_', ' ')}` : 'Location Type'}
                    </Text>
                </TouchableOpacity>
                {renderDropdown([{ label: 'All', value: undefined }, ...locationOptions], 'locationType')}

                <TouchableOpacity
                    onPress={() => setOpenDropdown(openDropdown === 'employmentType' ? 'none' : 'employmentType')}
                    style={[
                        styles.filterButton,
                        isSelected('employmentType') && styles.filterButtonSelected,
                    ]}
                >
                    <Text
                        style={[
                            styles.filterButtonText,
                            isSelected('employmentType') && styles.filterButtonTextSelected,
                        ]}
                    >
                        {filters.employmentType ? `Employment | ${filters.employmentType.replace('_', ' ')}` : 'Employment'}
                    </Text>
                </TouchableOpacity>
                {renderDropdown([{ label: 'All', value: undefined }, ...employmentOptions], 'employmentType')}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 10,
    },
    filterButtonSelected: {
        backgroundColor: "#3F51B5",
    },
    filterButtonText: {
        color: '#555',
    },
    filterButtonTextSelected: {
        color: 'white',
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        width: SCREEN_WIDTH * 0.7,
        maxHeight: 250,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    dropdownItemSelected: {
        backgroundColor: "#3F51B5",
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#555',
    },
    dropdownItemTextSelected: {
        color: 'white',
        fontWeight: '700',
    },
});

export default FiltersBar;
