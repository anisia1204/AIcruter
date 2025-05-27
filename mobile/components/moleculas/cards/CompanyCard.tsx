import { Company } from "@/domain/classTypes";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet } from "react-native";

type CompanyCardProps = {
    company: Company;
};

const CompanyCard = ({ company }: CompanyCardProps) => {
    const initials = company.name
        .substring(0, 2)
        .toUpperCase();
    return (
        <View style={styles.companyCard}>
            <LinearGradient
                colors={["#3F51B5", "#5A6FF0"]}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
            <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{company.name}</Text>
                <Text style={styles.companyAddress}>
                    {company.legalAddressDTO.addressLine}
                </Text>
                <Text style={styles.companyDetails}>
                    {company.legalAddressDTO.city}, {company.legalAddressDTO.state}, {company.legalAddressDTO.country} {company.legalAddressDTO.postalCode}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

   companyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        marginVertical: 10,
        marginHorizontal: 2,
        shadowColor: '#3F51B5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.13,
        shadowRadius: 10,
        elevation: 5,
        minWidth: 320,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22,
        letterSpacing: 1,
    },
    companyInfo: {
        flex: 1,
        minWidth: 0,
    },
    companyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3F51B5',
        marginBottom: 2,
        flexWrap: 'wrap',
    },
    companyAddress: {
        fontSize: 15,
        color: '#444',
        flexWrap: 'wrap',
    },
    companyDetails: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
        flexWrap: 'wrap',
    },
});

export default CompanyCard;