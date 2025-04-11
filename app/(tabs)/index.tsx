'use client'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    CreditCard,
    Plus,
    Ticket,
    ArrowRight,
    Clock,
    RefreshCw,
} from 'lucide-react-native'
import { useRouter } from 'expo-router'

import { Colors } from '@/constants/Colors'

export default function HomeScreen() {
    const router = useRouter()

    const colorScheme = useColorScheme()
    const themeColors = Colors[colorScheme ?? 'light']
    const styles = createStyles(themeColors)

    const handleRecharge = () => {
        router.push('/recharge')
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Bom dia,</Text>
                        <Text style={styles.name}>João Silva</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
                            }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <Text style={styles.balanceTitle}>Saldo Atual</Text>
                        <TouchableOpacity
                            style={styles.topUpButton}
                            onPress={handleRecharge}
                        >
                            <Plus size={18} color={themeColors.tint} />
                            <Text style={styles.topUpText}>Recarregar</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.balanceAmount}>R$ 47,50
                    </Text>
                    <View style={styles.balanceInfo}>
                        <View style={styles.infoItem}>
                            <Clock
                                size={16}
                                color={themeColors.textSecondary}
                            />
                            <Text style={styles.infoText}>
                                Última recarga: Ontem, 14:15
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Ações Rápidas</Text>
                </View>

                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            router.replace('/login')
                        }}
                    >
                        <View style={styles.actionIcon}>
                            <Ticket size={24} color={themeColors.tint} />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionText}>Ver Bilhete</Text>
                            <Text style={styles.actionDescription}>
                                Acesse seu bilhete
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleRecharge}
                    >
                        <View style={styles.actionIcon}>
                            <CreditCard size={24} color={themeColors.tint} />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionText}>Recarregar</Text>
                            <Text style={styles.actionDescription}>
                                Adicione créditos
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Atividade Recente</Text>
                    <TouchableOpacity style={styles.viewAllButton}>
                        <Text style={styles.viewAllText}>Ver tudo</Text>
                        <ArrowRight size={16} color={themeColors.tint} />
                    </TouchableOpacity>
                </View>

                <View style={styles.recentActivity}>
                    {[
                        {
                            id: 1,
                            type: 'viagem',
                            title: 'Viagem de Ônibus',
                            subtitle: 'Linha 123 - Centro',
                            time: 'Hoje, 9:30',
                            amount: '-R$ 2,50',
                            isNegative: true,
                        },
                        {
                            id: 2,
                            type: 'recarga',
                            title: 'Recarga',
                            subtitle: 'Via PIX',
                            time: 'Ontem, 14:15',
                            amount: '+R$ 50,00',
                            isNegative: false,
                        },
                        {
                            id: 3,
                            type: 'viagem',
                            title: 'Viagem de Ônibus',
                            subtitle: 'Linha 456 - Universidade',
                            time: 'Ontem, 8:45',
                            amount: '-R$ 2,50',
                            isNegative: true,
                        },
                    ].map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.activityItem}
                        >
                            <View
                                style={[
                                    styles.activityIconContainer,
                                    item.isNegative
                                        ? styles.negativeIconContainer
                                        : styles.positiveIconContainer,
                                ]}
                            >
                                {item.isNegative ? (
                                    <Ticket
                                        size={20}
                                        color={themeColors.tint}
                                    />
                                ) : (
                                    <RefreshCw size={20} color="#34C759" />
                                )}
                            </View>
                            <View style={styles.activityContent}>
                                <View>
                                    <Text style={styles.activityTitle}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.activitySubtitle}>
                                        {item.subtitle}
                                    </Text>
                                </View>
                                <View style={styles.activityRight}>
                                    <Text style={styles.activityTime}>
                                        {item.time}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.activityAmount,
                                            item.isNegative
                                                ? styles.negativeAmount
                                                : styles.positiveAmount,
                                        ]}
                                    >
                                        {item.amount}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.promoCard}>
                    <View style={styles.promoContent}>
                        <Text style={styles.promoTitle}>Passe Mensal</Text>
                        <Text style={styles.promoDescription}>
                            Economize até 30% com nosso passe mensal para
                            viagens ilimitadas
                        </Text>
                        <TouchableOpacity style={styles.promoButton}>
                            <Text style={styles.promoButtonText}>
                                Saiba mais
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.promoBadge}>
                        <Text style={styles.promoBadgeText}>30% OFF</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>BusIF v1.0.0</Text>
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 10,
        },
        greeting: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.textSecondary,
        },
        name: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 24,
            color: theme.text,
            marginTop: 4,
        },
        profileButton: {
            width: 48,
            height: 48,
            borderRadius: 24,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: theme.tint,
        },
        profileImage: {
            width: '100%',
            height: '100%',
        },
        balanceCard: {
            backgroundColor: theme.card,
            marginHorizontal: 20,
            marginTop: 10,
            marginBottom: 20,
            padding: 20,
            borderRadius: 16,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme === Colors.light ? 0.08 : 0.1,
            shadowRadius: 8,
            elevation: theme === Colors.light ? 3 : 0,
        },
        balanceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        balanceTitle: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.textSecondary,
        },
        topUpButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 8,
            backgroundColor: theme.iconBackground,
        },
        topUpText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 14,
            color: theme.tint,
        },
        balanceAmount: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 36,
            color: theme.text,
            marginTop: 8,
        },
        balanceInfo: {
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.iconBackground,
        },
        infoItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        infoText: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: theme.textSecondary,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 12,
            marginTop: 8,
        },
        sectionTitle: {
            fontFamily: 'Poppins-Medium',
            fontSize: 18,
            color: theme.text,
        },
        viewAllButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        viewAllText: {
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            color: theme.tint,
        },
        quickActions: {
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 24,
        },
        actionButton: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 12,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme === Colors.light ? 0.05 : 0,
            shadowRadius: 8,
            elevation: theme === Colors.light ? 3 : 0,
        },
        actionIcon: {
            backgroundColor: theme.iconBackground,
            padding: 12,
            borderRadius: 12,
            marginBottom: 12,
        },
        actionContent: {
            alignItems: 'center',
            width: '100%',
        },
        actionText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: theme.text,
            textAlign: 'center',
        },
        actionDescription: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: theme.textSecondary,
            marginTop: 2,
            textAlign: 'center',
        },
        recentActivity: {
            paddingHorizontal: 20,
            gap: 12,
            marginBottom: 24,
        },
        activityItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 12,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme === Colors.light ? 0.05 : 0,
            shadowRadius: 8,
            elevation: theme === Colors.light ? 2 : 0,
        },
        activityIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        negativeIconContainer: {
            backgroundColor: `${theme.tint}15`, // 15% opacity
        },
        positiveIconContainer: {
            backgroundColor: 'rgba(52, 199, 89, 0.15)', // 15% opacity green
        },
        activityContent: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        activityTitle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: theme.text,
        },
        activitySubtitle: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: theme.textSecondary,
            marginTop: 2,
        },
        activityRight: {
            alignItems: 'flex-end',
        },
        activityTime: {
            fontFamily: 'Inter-Regular',
            fontSize: 12,
            color: theme.textSecondary,
            marginBottom: 2,
        },
        activityAmount: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
        },
        negativeAmount: {
            color: '#FF3B30', // Vermelho
        },
        positiveAmount: {
            color: '#34C759', // Verde
        },
        promoCard: {
            backgroundColor: theme.tint,
            marginHorizontal: 20,
            marginBottom: 30,
            padding: 20,
            borderRadius: 16,
            flexDirection: 'row',
            position: 'relative',
            overflow: 'hidden',
        },
        promoContent: {
            flex: 1,
            paddingRight: 20,
        },
        promoTitle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 20,
            color:
                theme === Colors.light
                    ? Colors.light.card
                    : Colors.dark.background,
            marginBottom: 8,
        },
        promoDescription: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color:
                theme === Colors.light
                    ? Colors.light.card
                    : Colors.dark.background,
            opacity: 0.9,
            marginBottom: 16,
        },
        promoButton: {
            backgroundColor:
                theme === Colors.light
                    ? Colors.light.card
                    : Colors.dark.background,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignSelf: 'flex-start',
        },
        promoButtonText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 14,
            color: theme.tint,
        },
        promoBadge: {
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor:
                theme === Colors.light
                    ? Colors.light.card
                    : Colors.dark.background,
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 12,
        },
        promoBadgeText: {
            fontFamily: 'Inter-Bold',
            fontSize: 12,
            color: theme.tint,
        },
        footer: {
            alignItems: 'center',
            paddingBottom: 30,
        },
        footerText: {
            fontFamily: 'Inter-Regular',
            fontSize: 12,
            color: theme.textSecondary,
        },
    })
