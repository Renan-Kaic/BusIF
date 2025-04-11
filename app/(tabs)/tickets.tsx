import { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    useColorScheme,
    ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import QRCode from 'react-native-qrcode-svg'
import {
    Clock,
    Wallet,
    History,
    Ticket as TicketIcon,
} from 'lucide-react-native'
import { router } from 'expo-router'

import { Colors } from '@/constants/Colors'

export default function TicketsScreen() {
    const colorScheme = useColorScheme()
    const themeColors = Colors[colorScheme ?? 'light']
    const styles = createStyles(themeColors)

    const [activeTicket, setActiveTicket] = useState<ActiveTicket | null>(null)
    const [remainingTimeText, setRemainingTimeText] =
        useState<string>('00:00:00') // HH:MM:SS
    const [progressValue, setProgressValue] = useState<number>(0)

    const primaryButtonIconColor =
        themeColors === Colors.light
            ? Colors.light.card
            : Colors.dark.background
    const secondaryButtonIconColor = themeColors.text
    const disabledButtonIconColor = themeColors.textSecondary

    // Formata para HH:MM:SS
    const formatTimeHHMMSS = (milliseconds: number): string => {
        if (milliseconds <= 0) return '00:00:00'
        const totalSeconds = Math.floor(milliseconds / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    const updateRemainingTime = useCallback(() => {
        if (!activeTicket) return

        const now = new Date()
        const diff = activeTicket.expiresAt.getTime() - now.getTime()

        if (diff <= 0) {
            setActiveTicket(null)
            setRemainingTimeText('00:00:00')
            setProgressValue(0)
            return
        }

        const currentProgress = diff / TICKET_DURATION_MS
        setRemainingTimeText(formatTimeHHMMSS(diff)) // Usa formatação HH:MM:SS
        setProgressValue(currentProgress)
    }, [activeTicket])

    useEffect(() => {
        if (!activeTicket) {
            setProgressValue(0)
            setRemainingTimeText('00:00:00')
            return
        }
        updateRemainingTime()
        const interval = setInterval(updateRemainingTime, 1000)
        return () => clearInterval(interval)
    }, [activeTicket, updateRemainingTime])

    const generateTicket = () => {
        const now = new Date()
        const expiresAt = new Date(now.getTime() + TICKET_DURATION_MS)
        const newTicket: ActiveTicket = {
            id: `T${Date.now()}`,
            qrCode: `ticket-${Date.now()}-${Math.random()
                .toString(36)
                .substring(7)}`,
            expiresAt,
            createdAt: now,
        }
        setActiveTicket(newTicket)
    }

    const handleViewHistory = () => {
        router.push('/(tabs)/history')
    }

    const handleRecharge = () => {
        router.push('/recharge')
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bilhete Digital</Text>
                <Text style={styles.subtitle}>
                    {activeTicket
                        ? 'Seu bilhete ativo'
                        : 'Nenhum bilhete ativo'}
                </Text>
            </View>

            <ScrollView
                style={styles.contentScrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.topSection}>
                    {activeTicket ? (
                        <View style={styles.activeTicketContainer}>
                            <View style={styles.progressSection}>
                                <View style={styles.progressInfo}>
                                    <View style={styles.progressTimeContainer}>
                                        <Clock
                                            size={18}
                                            color={themeColors.text}
                                        />
                                        <Text style={styles.progressTimeText}>
                                            {remainingTimeText}
                                        </Text>
                                    </View>
                                    <Text style={styles.progressLabel}>
                                        Tempo Restante
                                    </Text>
                                </View>
                                <View style={styles.progressBarTrack}>
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            {
                                                width: `${
                                                    progressValue * 100
                                                }%`,
                                            },
                                        ]}
                                    />
                                </View>
                            </View>

                            <View style={styles.qrContainer}>
                                <QRCode
                                    value={activeTicket.qrCode}
                                    size={Platform.OS === 'web' ? 180 : 250}
                                    color={Colors.light.text}
                                    backgroundColor={Colors.light.card}
                                />
                            </View>

                            <Text style={styles.ticketId}>
                                ID: {activeTicket.id}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <TicketIcon
                                size={80}
                                color={themeColors.textSecondary}
                                strokeWidth={1.5}
                            />
                            <Text style={styles.placeholderTitle}>
                                Pronto para Viajar?
                            </Text>
                            <Text style={styles.placeholderText}>
                                Gere um novo bilhete digital aqui quando
                                precisar.
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={handleRecharge}
                    >
                        <Wallet size={22} color={primaryButtonIconColor} />
                        <Text style={styles.primaryButtonText}>Recarregar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={handleViewHistory}
                    >
                        <History size={22} color={secondaryButtonIconColor} />
                        <Text style={styles.secondaryButtonText}>
                            Ver Bilhetes Anteriores
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.primaryButton,
                            !!activeTicket && styles.disabledButton,
                        ]}
                        onPress={generateTicket}
                        disabled={!!activeTicket}
                    >
                        <TicketIcon
                            size={22}
                            color={
                                !!activeTicket
                                    ? disabledButtonIconColor
                                    : primaryButtonIconColor
                            }
                        />
                        <Text
                            style={[
                                styles.primaryButtonText,
                                !!activeTicket && styles.disabledButtonText,
                            ]}
                        >
                            Gerar Novo Bilhete
                        </Text>
                    </TouchableOpacity>
                </View>
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
            paddingBottom: 15,
        },
        title: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 30,
            color: theme.text,
        },
        subtitle: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.textSecondary,
            marginTop: 2,
        },
        contentScrollView: {
            flexGrow: 1,
        },
        contentContainer: {
            flexGrow: 1,
            justifyContent: 'space-between',
            padding: 20,
            paddingTop: 10,
        },
        topSection: {
            flex: 1,
            justifyContent: 'center',
            marginBottom: 30,
        },
        activeTicketContainer: {
            backgroundColor: theme.card,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: theme === Colors.light ? 0.08 : 0.1,
            shadowRadius: 12,
            elevation: theme === Colors.light ? 5 : 2,
            borderWidth: theme === Colors.light ? 1 : 0,
            borderColor: theme.iconBackground,
        },
        progressSection: {
            width: '100%',
            alignItems: 'center',
            marginBottom: 24,
        },
        progressInfo: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: 12,
        },
        progressTimeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        progressTimeText: {
            fontFamily: 'Poppins-Medium',
            fontSize: 16,
            color: theme.text,
        },
        progressLabel: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: theme.textSecondary,
        },
        progressBarTrack: {
            width: '100%',
            height: 8,
            backgroundColor: theme.iconBackground,
            borderRadius: 4,
            overflow: 'hidden',
        },
        progressBarFill: {
            height: '100%',
            backgroundColor: theme.tint,
            borderRadius: 4,
        },
        qrContainer: {
            padding: 16,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            shadowColor: Colors.light.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
            marginTop: 10,
        },
        ticketId: {
            fontFamily: 'Inter-Regular',
            fontSize: 13,
            color: theme.textSecondary,
            marginTop: 20,
        },
        placeholderContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            paddingBottom: 50,
        },
        placeholderTitle: {
            fontFamily: 'Poppins-Medium',
            fontSize: 18,
            color: theme.textSecondary,
            textAlign: 'center',
        },
        placeholderText: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.textSecondary,
            textAlign: 'center',
            maxWidth: 280,
            lineHeight: 22,
        },
        buttonContainer: {
            gap: 14,
            paddingTop: 10,
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 58,
            borderRadius: 16,
            gap: 12,
        },
        primaryButton: {
            backgroundColor: theme.tint,
        },
        primaryButtonText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color:
                theme === Colors.light
                    ? Colors.light.card
                    : Colors.dark.background,
        },
        secondaryButton: {
            backgroundColor: theme.iconBackground,
        },
        secondaryButtonText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: theme.text,
        },
        disabledButton: {
            backgroundColor: theme.iconBackground,
            opacity: 0.7,
        },
        disabledButtonText: {
            color: theme.textSecondary,
        },
    })
    
type ActiveTicket = {
    id: string
    qrCode: string
    expiresAt: Date
    createdAt: Date
}

const TICKET_DURATION_MS = 90 * 60 * 1000
