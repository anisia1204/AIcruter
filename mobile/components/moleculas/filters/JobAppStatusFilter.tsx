import { JobApplicationStatus } from '@/domain/VOandEnums';
import React from 'react';
import {
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';

type JobAppStatusFilterProps = {
    statusFilter: JobApplicationStatus | undefined;
    setStatusFilter: (status: JobApplicationStatus | undefined) => void;
};

const statusOptions = [
    { label: 'New', value: 'NEW' },
    { label: 'In Review', value: 'IN_REVIEW' },
    { label: 'Interview', value: 'INTERVIEW' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Rejected', value: 'REJECTED' },
];

const JobAppStatusFilter = ({ statusFilter, setStatusFilter }: JobAppStatusFilterProps) => {

    const isSelected = (status: string | undefined) => statusFilter === status;
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            <TouchableOpacity
                onPress={() => setStatusFilter(undefined)}
                style={[styles.filterButton, statusFilter === undefined && styles.filterButtonSelected]}
            >
                <Text
                    style={[
                        styles.filterButtonText,
                        statusFilter === undefined && styles.filterButtonTextSelected,
                    ]}
                >
                    All
                </Text>
            </TouchableOpacity>

            {statusOptions.map(({ label, value }) => (
                <TouchableOpacity
                    key={value}
                    onPress={() => setStatusFilter(value as JobApplicationStatus)}
                    style={[styles.filterButton, isSelected(value) && styles.filterButtonSelected]}
                >
                    <Text
                        style={[
                            styles.filterButtonText,
                            isSelected(value) && styles.filterButtonTextSelected,
                        ]}
                    >
                        {label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
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
});

export default JobAppStatusFilter;
