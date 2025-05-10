import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

const MainView = ({children}: any) => {
    const { colors } = useTheme();
    return (
        <SafeAreaView style={[styles.main, { backgroundColor: colors.background }]}>
            <Animated.ScrollView>
                {children}
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1, 
        marginHorizontal: 15,
        marginVertical: 10,
    }
});

export default MainView;
