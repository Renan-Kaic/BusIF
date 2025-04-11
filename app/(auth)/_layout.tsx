import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'

import { Colors } from '@/constants/Colors'

export default function Layout() {
    const colorScheme = useColorScheme()
    const themeColors = Colors[colorScheme ?? 'light']

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: themeColors.background,
                },
            }}
        >
            <Stack.Screen
                name="login"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="forgot-password"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    )
}
