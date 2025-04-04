import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
    CreditCard,
    History,
    Map,
    User,
    WalletMinimal,
} from 'lucide-react-native';

import { Colors } from '@/constants/Colors'; 

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: themeColors.card,
                    borderTopWidth: 1,
                    borderTopColor: themeColors.iconBackground,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 4,
                },
                tabBarActiveTintColor: themeColors.tint,
                tabBarInactiveTintColor: themeColors.textSecondary,
                tabBarLabelStyle: {
                    fontFamily: 'Inter-Regular',
                    fontSize: 12,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color, size }) => (
                        <WalletMinimal size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="tickets"
                options={{
                    title: 'Bilhetes',
                    tabBarIcon: ({ color, size }) => (
                        <CreditCard size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Histórico',
                    tabBarIcon: ({ color, size }) => (
                        <History size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="routes"
                options={{
                    title: 'Rotas',
                    tabBarIcon: ({ color, size }) => (
                        <Map size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <User size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
