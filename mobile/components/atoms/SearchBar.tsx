import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';

type SearchBarProps = {
    value: string;
    onChange: (text: string) => void;
    placeholder: string;
};

const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => {

    return (
        <View style={styles.container}>
            <Feather name="search" size={20} color="#9ca3af" />
            <TextInput
                style={styles.input}
                placeholder={placeholder || 'Search jobs...'}
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#9ca3af"
            />
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 30,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3, // Android shadow
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#1f2937', // dark gray
    },
});
