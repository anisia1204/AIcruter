import { EmploymentType, JobApplicationStatus, JobLocationType, JobStatus } from "@/domain/VOandEnums";
import { formatEnum } from "@/lib/utils";
import moment from 'moment';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type JobCardProps = {
  jobTitle: string;
  companyName: string;
  employmentType: EmploymentType;
  locationType: JobLocationType;
  state: string;
  city: string;
  createdOrAppliedAt: string;
  status: JobStatus | JobApplicationStatus;
  onPress?: () => void;
  isJobApplicationCard?: boolean;
  country?: string;
};


const JobCard = ({ jobTitle, companyName, employmentType, locationType, state, city, createdOrAppliedAt, status, onPress, isJobApplicationCard = false, country = '' }: JobCardProps) => {

  const initials = companyName.slice(0, 2).toUpperCase();
  const createdDate = moment(createdOrAppliedAt).format('MMM D, YYYY')

  const dateText = isJobApplicationCard ? 'Applied on' : 'Posted on'

  const statusColor = {
      OPEN: '#4ade80', 
      CLOSED: '#f87171', 
      NEW: '#60a5fa', 
      IN_REVIEW: '#facc15',
      INTERVIEW: '#a78bfa',  
      ACCEPTED: '#34d399', 
      REJECTED: '#9ca3af',
  }[status];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>{initials}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.jobTitle}>{jobTitle}</Text>
        <Text style={styles.companyName}>{companyName}</Text>
        <Text style={styles.details}>
          {formatEnum(employmentType)} • {formatEnum(locationType)}
        </Text>
        <Text style={styles.details}>{city}, {state}</Text>
        {!!country && <Text style={styles.details}>{country}</Text>}
        <Text style={styles.date}>{dateText} {createdDate}</Text>
      </View>

      <View style={[styles.statusPill, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 12,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoText: {
    fontWeight: 'bold',
    color: '#3730a3',
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  details: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6,
  },
  statusPill: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});