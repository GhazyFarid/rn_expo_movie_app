import {
    CheckIsMaintenance,
    ListenIsMaintenance,
} from "@/src/helpers/firebase/maintenance";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { Alert, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider as StoreProvider } from "react-redux";
import store from "../src/store/store";

export default function RootLayout() {

    useEffect(() => {
        CheckIsMaintenance().then((isMaintenance) => {
            if (isMaintenance) {
                // Show maintenance screen
                router.replace("/(other-pages)/maintenance");
            }
        });
        ListenIsMaintenance(
            () => {
                router.replace("/(other-pages)/maintenance");
            },
            () => {
                // Show home screen
                router.replace("/(tabs)");
            }
        );
    }, []);

    return (
        <StoreProvider store={store}>
            <SafeAreaProvider>
                <SafeAreaView className="bg-primary flex-1">
                    <StatusBar hidden={true} />
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="movies/[id]"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(auth)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(other-pages)"
                            options={{ headerShown: false }}
                        />
                    </Stack>
                </SafeAreaView>
            </SafeAreaProvider>
        </StoreProvider>
    );
}
