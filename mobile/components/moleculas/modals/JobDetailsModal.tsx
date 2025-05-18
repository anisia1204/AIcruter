import { Job } from '@/domain/classTypes';
import { formatEnum } from '@/lib/utils';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { JobStatus } from '@/domain/VOandEnums';

type Props = {
  job: Job | null;
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  isJobAppliedTo: boolean;
};

const JobDetailsModal = ({ job, visible, onClose, onApply, isJobAppliedTo }: Props) => {

  if (!job) return null;

  console.log("isJobAppliedTo", isJobAppliedTo)
  const buttonText = (jobStatus: JobStatus) => {
    return isJobAppliedTo
      ? 'Already applied'
      : jobStatus === JobStatus.CLOSED
        ? 'Closed application'
        : 'Apply here';
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <View style={styles.backField}>
              <Ionicons name="arrow-back" size={16} color="black" />
              <Text style={styles.closeText}>Back</Text>
            </View>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.companyName}</Text>

            <View style={styles.tags}>
              <Text style={styles.tag}>{formatEnum(job.locationType)}</Text>
              <Text style={styles.tag}>{formatEnum(job.employmentType)}</Text>
              <Text style={styles.tag}>{job.city}, {job.state}</Text>
            </View>

            <Text style={styles.description}>{job.description}</Text>
            <TouchableOpacity
              onPress={onApply}
              style={[
                styles.applyButton,
                job.status === JobStatus.CLOSED && styles.disabledButton,
                isJobAppliedTo && styles.alreadyApplied,
              ]}
              disabled={job.status === JobStatus.CLOSED || isJobAppliedTo}
            >
              <Text style={styles.applyText}>
                {buttonText(job.status)}
              </Text>
            </TouchableOpacity>


          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default JobDetailsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  closeButton: {
    alignSelf: 'flex-start',
  },
  closeText: {
    fontSize: 16,
    color: '#555',
  },
  content: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    fontSize: 12,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  applyButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#bbb',
  },
  alreadyApplied: {
    backgroundColor: '#3F51B5'
  },
  backField: {
    flexDirection: 'row',
    gap: 3,
    alignItems: "center",
  }
});
