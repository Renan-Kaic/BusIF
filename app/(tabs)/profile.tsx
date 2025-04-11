import { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Image,
    useColorScheme,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Camera,
    ChevronRight,
    CircleHelp as HelpCircle,
    LogOut,
    Moon,
    Bell,
    Lock,
    Globe,
    Wifi,
} from 'lucide-react-native'

import { Colors } from '@/constants/Colors'
import { DisableNetwork } from '@/config/firebase'

export default function ProfileScreen() {
    const colorScheme = useColorScheme()
    const themeColors = Colors[colorScheme ?? 'light']
    const styles = createStyles(themeColors)

    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [darkModeEnabled, setDarkModeEnabled] = useState(
        colorScheme === 'dark',
    )

    const [offline, setOffline] = useState(false)

    useEffect(() => {
        setDarkModeEnabled(colorScheme === 'dark')
    }, [colorScheme])

    const handleLogout = () => {
        console.log('Logout Pressionado')
    }

    const toggleDarkMode = (value: boolean) => {
        setDarkModeEnabled(value)
        console.log('Trocar para modo escuro:', value)
    }

    const toggleNetworkStatus = () => {
        setOffline(!offline)
    }

    useEffect(() =>{
      DisableNetwork(offline)
    }, [offline])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Perfil</Text>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
                            }}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity style={styles.cameraButton}>
                            <Camera size={18} color={themeColors.background} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.profileName}>João Silva</Text>
                    <Text style={styles.profileEmail}>
                        joao.silva@email.com
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Configurações do Aplicativo
                    </Text>

                    <View style={[styles.settingItem, styles.firstSettingItem]}>
                        <View style={styles.settingLeft}>
                            <Bell size={24} color={themeColors.textSecondary} />
                            <Text style={styles.settingText}>Notificações</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{
                                false: themeColors.iconBackground,
                                true: themeColors.tint,
                            }}
                            thumbColor={themeColors.card}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Moon size={24} color={themeColors.textSecondary} />
                            <Text style={styles.settingText}>Modo Escuro</Text>
                        </View>
                        <Switch
                            value={darkModeEnabled}
                            onValueChange={toggleDarkMode}
                            trackColor={{
                                false: themeColors.iconBackground,
                                true: themeColors.tint,
                            }}
                            thumbColor={themeColors.card}
                        />
                    </View>
                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Wifi size={24} color={themeColors.textSecondary} />
                            <Text style={styles.settingText}>Modo Offline</Text>
                        </View>
                        <Switch
                            value={offline}
                            onValueChange={toggleNetworkStatus}
                            trackColor={{
                                false: themeColors.iconBackground,
                                true: themeColors.tint,
                            }}
                            thumbColor={themeColors.card}
                        />
                    </View>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Lock size={24} color={themeColors.textSecondary} />
                            <Text style={styles.settingText}>Segurança</Text>
                        </View>
                        <ChevronRight
                            size={24}
                            color={themeColors.textSecondary}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Globe
                                size={24}
                                color={themeColors.textSecondary}
                            />
                            <Text style={styles.settingText}>Idioma</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>Português</Text>
                            <ChevronRight
                                size={24}
                                color={themeColors.textSecondary}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Suporte</Text>

                    <TouchableOpacity
                        style={[styles.settingItem, styles.firstSettingItem]}
                    >
                        <View style={styles.settingLeft}>
                            <HelpCircle
                                size={24}
                                color={themeColors.textSecondary}
                            />
                            <Text style={styles.settingText}>
                                Central de Ajuda
                            </Text>
                        </View>
                        <ChevronRight
                            size={24}
                            color={themeColors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <LogOut size={20} color="#FF3B30" />
                    <Text style={styles.logoutText}>Sair da Conta</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const createStyles = (theme: typeof Colors.light | typeof Colors.dark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 10,
        },
        title: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 28,
            color: theme.text,
        },
        profileSection: {
            alignItems: 'center',
            paddingVertical: 20,
        },
        profileImageContainer: {
            position: 'relative',
            marginBottom: 16,
        },
        profileImage: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: theme.iconBackground,
        },
        cameraButton: {
            position: 'absolute',
            right: 0,
            bottom: 0,
            backgroundColor: theme.tint,
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: theme.card,
        },
        profileName: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 24,
            color: theme.text,
            marginBottom: 4,
        },
        profileEmail: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.textSecondary,
        },
        section: {
            backgroundColor: theme.card,
            marginHorizontal: 20,
            marginVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 16,
        },
        sectionTitle: {
            fontFamily: 'Poppins-Medium',
            fontSize: 18,
            color: theme.text,
            paddingTop: 20,
            paddingBottom: 8,
        },
        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.iconBackground, // Subtle separator
        },
        firstSettingItem: {
            borderTopWidth: 0,
        },
        settingLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        settingRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        settingText: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.text,
        },
        settingValue: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.textSecondary,
        },
        logoutButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: theme.card,
            marginHorizontal: 20,
            marginVertical: 12,
            padding: 16,
            borderRadius: 12,
            marginBottom: 32,
        },
        logoutText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: '#FF3B30',
        },
    })
