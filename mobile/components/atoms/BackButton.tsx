import { Ionicons } from "@expo/vector-icons";
import { RelativePathString, useRouter } from "expo-router";
import { Pressable } from "react-native";

type BackIconProps = {
    backPage?: string;
}
const BackIcon = ({ backPage = '' }: BackIconProps) => {
    const router = useRouter();
    return (
        <>
            <Pressable>
                {({ pressed }) => (
                    <Ionicons name="chevron-back" onPress={() => router.replace(backPage as RelativePathString)} size={25} style={{ marginLeft: 8, opacity: pressed ? 0.5 : 1 }} />
                )}
            </Pressable>
        </>
    );
};

export default BackIcon;
