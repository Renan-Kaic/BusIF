'use client'

import { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    useColorScheme,
    Animated,
    FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Calendar,
    Filter,
    Search,
    X,
    ChevronDown,
    ChevronUp,
} from 'lucide-react-native'

import { Colors } from '@/constants/Colors'

// Tipos
type TransactionType = 'entrada' | 'saida'

interface Transaction {
    id: string
    type: TransactionType
    description: string
    amount: number
    date: string
    category?: string
}

interface GroupedTransactions {
    title: string
    data: Transaction[]
}

// Dados de exemplo
const mockTransactions: Transaction[] = [
    {
        id: '1',
        type: 'saida',
        description: 'Passagem de Ônibus - Linha 123',
        amount: 4.5,
        date: '2024-03-20T10:30:00',
        category: 'Transporte',
    },
    {
        id: '2',
        type: 'entrada',
        description: 'Recarga de Créditos',
        amount: 50.0,
        date: '2024-03-19T15:45:00',
        category: 'Recarga',
    },
    {
        id: '3',
        type: 'saida',
        description: 'Passagem de Ônibus - Linha 456',
        amount: 4.5,
        date: '2024-03-19T08:15:00',
        category: 'Transporte',
    },
    {
        id: '4',
        type: 'saida',
        description: 'Passagem de Ônibus - Linha 789',
        amount: 4.5,
        date: '2024-03-18T17:30:00',
        category: 'Transporte',
    },
    {
        id: '5',
        type: 'entrada',
        description: 'Recarga de Créditos',
        amount: 30.0,
        date: '2024-03-15T12:20:00',
        category: 'Recarga',
    },
    {
        id: '6',
        type: 'saida',
        description: 'Passagem de Ônibus - Linha 123',
        amount: 4.5,
        date: '2024-03-15T08:10:00',
        category: 'Transporte',
    },
    {
        id: '7',
        type: 'saida',
        description: 'Passagem de Ônibus - Linha 456',
        amount: 4.5,
        date: '2024-03-10T18:45:00',
        category: 'Transporte',
    },
    {
        id: '8',
        type: 'entrada',
        description: 'Recarga de Créditos',
        amount: 100.0,
        date: '2024-03-05T14:30:00',
        category: 'Recarga',
    },
]

// Filtros
type FilterOption = 'all' | 'entrada' | 'saida' | 'recarga' | 'transporte'

export default function HistoryScreen() {
    const colorScheme = useColorScheme()
    const themeColors = Colors[colorScheme ?? 'light']
    const styles = createStyles(themeColors)

    // Estados
    const [searchQuery, setSearchQuery] = useState('')
    const [isFilterVisible, setIsFilterVisible] = useState(false)
    const [activeFilter, setActiveFilter] = useState<FilterOption>('all')
    const [groupedTransactions, setGroupedTransactions] = useState<
        GroupedTransactions[]
    >([])
    const [expandedGroups, setExpandedGroups] = useState<
        Record<string, boolean>
    >({})

    const filterHeight = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(filterHeight, {
            toValue: isFilterVisible ? 180 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start()
    }, [isFilterVisible, filterHeight])

    useEffect(() => {
        const filtered = mockTransactions.filter((transaction) => {
            const matchesSearch =
                searchQuery === '' ||
                transaction.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                transaction.category
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())

            const matchesType =
                activeFilter === 'all' ||
                (activeFilter === 'entrada' &&
                    transaction.type === 'entrada') ||
                (activeFilter === 'saida' && transaction.type === 'saida') ||
                (activeFilter === 'recarga' &&
                    transaction.category === 'Recarga') ||
                (activeFilter === 'transporte' &&
                    transaction.category === 'Transporte')

            return matchesSearch && matchesType
        })

        const grouped: Record<string, Transaction[]> = {}
        filtered.forEach((transaction) => {
            const date = new Date(transaction.date)
            const today = new Date()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            let groupTitle: string

            if (date.toDateString() === today.toDateString()) {
                groupTitle = 'Hoje'
            } else if (date.toDateString() === yesterday.toDateString()) {
                groupTitle = 'Ontem'
            } else {
                groupTitle = date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })
            }

            if (!grouped[groupTitle]) {
                grouped[groupTitle] = []
            }
            grouped[groupTitle].push(transaction)
        })

        const result = Object.entries(grouped)
            .map(([title, data]) => ({ title, data }))
            .sort((a, b) => {
                // Ordenar com "Hoje" e "Ontem" primeiro, depois por data decrescente
                if (a.title === 'Hoje') return -1
                if (b.title === 'Hoje') return 1
                if (a.title === 'Ontem') return -1
                if (b.title === 'Ontem') return 1

                // Converter datas no formato DD/MM/YYYY para objetos Date para comparação
                const [dayA, monthA, yearA] = a.title.split('/').map(Number)
                const [dayB, monthB, yearB] = b.title.split('/').map(Number)
                const dateA = new Date(yearA, monthA - 1, dayA)
                const dateB = new Date(yearB, monthB - 1, dayB)

                return dateB.getTime() - dateA.getTime()
            })

        setGroupedTransactions(result)

        const initialExpandedState: Record<string, boolean> = {}
        result.forEach((group) => {
            initialExpandedState[group.title] = true
        })
        setExpandedGroups(initialExpandedState)
    }, [searchQuery, activeFilter])

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })
    }

    const toggleGroupExpansion = (groupTitle: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupTitle]: !prev[groupTitle],
        }))
    }

    const clearSearch = () => {
        setSearchQuery('')
    }

    const applyFilter = (filter: FilterOption) => {
        setActiveFilter(filter)
        setIsFilterVisible(false)
    }

    const renderTransactionItem = (transaction: Transaction) => (
        <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
            <View
                style={[
                    styles.transactionIcon,
                    transaction.type === 'entrada'
                        ? styles.positiveIcon
                        : styles.negativeIcon,
                ]}
            >
                {transaction.type === 'entrada' ? (
                    <ArrowDownCircle size={24} color="#34C759" />
                ) : (
                    <ArrowUpCircle size={24} color="#FF3B30" />
                )}
            </View>
            <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>
                    {transaction.description}
                </Text>
                <Text style={styles.transactionCategory}>
                    {transaction.category}
                </Text>
            </View>
            <Text
                style={[
                    styles.transactionAmount,
                    transaction.type === 'entrada'
                        ? styles.amountPositive
                        : styles.amountNegative,
                ]}
            >
                {transaction.type === 'entrada' ? '+' : '-'}{' '}
                {formatCurrency(transaction.amount)}
            </Text>
        </TouchableOpacity>
    )

    const renderGroupHeader = (title: string, count: number) => (
        <TouchableOpacity
            style={styles.groupHeader}
            onPress={() => toggleGroupExpansion(title)}
            activeOpacity={0.7}
        >
            <View style={styles.groupTitleContainer}>
                <Text style={styles.groupTitle}>{title}</Text>
                <Text style={styles.groupCount}>{count} transações</Text>
            </View>
            {expandedGroups[title] ? (
                <ChevronUp size={20} color={themeColors.textSecondary} />
            ) : (
                <ChevronDown size={20} color={themeColors.textSecondary} />
            )}
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Histórico</Text>
                <Text style={styles.subtitle}>Suas transações recentes</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Search
                        size={20}
                        color={themeColors.textSecondary}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar transações"
                        placeholderTextColor={themeColors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={clearSearch}
                            style={styles.clearButton}
                        >
                            <X size={16} color={themeColors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        isFilterVisible && styles.filterButtonActive,
                    ]}
                    onPress={() => setIsFilterVisible(!isFilterVisible)}
                >
                    <Filter
                        size={22}
                        color={
                            isFilterVisible
                                ? themeColors.card
                                : themeColors.tint
                        }
                    />
                </TouchableOpacity>
            </View>

            <Animated.View
                style={[styles.filterContainer, { height: filterHeight }]}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                >
                    <TouchableOpacity
                        style={[
                            styles.filterOption,
                            activeFilter === 'all' && styles.filterOptionActive,
                        ]}
                        onPress={() => applyFilter('all')}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === 'all' &&
                                    styles.filterTextActive,
                            ]}
                        >
                            Todos
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterOption,
                            activeFilter === 'entrada' &&
                                styles.filterOptionActive,
                        ]}
                        onPress={() => applyFilter('entrada')}
                    >
                        <ArrowDownCircle
                            size={16}
                            color={
                                activeFilter === 'entrada'
                                    ? themeColors.card
                                    : '#34C759'
                            }
                        />
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === 'entrada' &&
                                    styles.filterTextActive,
                            ]}
                        >
                            Entradas
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterOption,
                            activeFilter === 'saida' &&
                                styles.filterOptionActive,
                        ]}
                        onPress={() => applyFilter('saida')}
                    >
                        <ArrowUpCircle
                            size={16}
                            color={
                                activeFilter === 'saida'
                                    ? themeColors.card
                                    : '#FF3B30'
                            }
                        />
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === 'saida' &&
                                    styles.filterTextActive,
                            ]}
                        >
                            Saídas
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterOption,
                            activeFilter === 'recarga' &&
                                styles.filterOptionActive,
                        ]}
                        onPress={() => applyFilter('recarga')}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === 'recarga' &&
                                    styles.filterTextActive,
                            ]}
                        >
                            Recargas
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterOption,
                            activeFilter === 'transporte' &&
                                styles.filterOptionActive,
                        ]}
                        onPress={() => applyFilter('transporte')}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === 'transporte' &&
                                    styles.filterTextActive,
                            ]}
                        >
                            Transportes
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                <View style={styles.dateFilterContainer}>
                    <TouchableOpacity style={styles.dateFilterButton}>
                        <Calendar size={16} color={themeColors.tint} />
                        <Text style={styles.dateFilterText}>
                            Filtrar por período
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {groupedTransactions.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateTitle}>
                        Nenhuma transação encontrada
                    </Text>
                    <Text style={styles.emptyStateText}>
                        Tente ajustar seus filtros ou realizar uma nova pesquisa
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={groupedTransactions}
                    keyExtractor={(item) => item.title}
                    renderItem={({ item }) => (
                        <View style={styles.transactionGroup}>
                            {renderGroupHeader(item.title, item.data.length)}
                            {expandedGroups[item.title] && (
                                <View style={styles.transactionList}>
                                    {item.data.map(renderTransactionItem)}
                                </View>
                            )}
                        </View>
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            )}
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
            padding: 20,
            paddingBottom: 10,
        },
        title: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 28,
            color: theme.text,
        },
        subtitle: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.textSecondary,
            marginTop: 4,
        },
        searchContainer: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 12,
            marginBottom: 12,
        },
        searchInputContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 48,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.text,
            height: '100%',
        },
        clearButton: {
            padding: 6,
        },
        filterButton: {
            width: 48,
            height: 48,
            backgroundColor: theme.card,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        filterButtonActive: {
            backgroundColor: theme.tint,
        },
        filterContainer: {
            marginHorizontal: 20,
            marginBottom: 12,
            borderRadius: 12,
            overflow: 'hidden',
        },
        filterScroll: {
            backgroundColor: theme.card,
            paddingVertical: 16,
            paddingHorizontal: 12,
        },
        filterOption: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 8,
            backgroundColor: theme.iconBackground,
            gap: 6,
        },
        filterOptionActive: {
            backgroundColor: theme.tint,
        },
        filterText: {
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            color: theme.text,
        },
        filterTextActive: {
            color: theme.card,
        },
        dateFilterContainer: {
            backgroundColor: theme.card,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: theme.iconBackground,
        },
        dateFilterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 8,
        },
        dateFilterText: {
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            color: theme.tint,
        },
        listContainer: {
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        transactionGroup: {
            marginBottom: 16,
            backgroundColor: theme.card,
            borderRadius: 12,
            overflow: 'hidden',
        },
        groupHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: theme.iconBackground,
        },
        groupTitleContainer: {
            flex: 1,
        },
        groupTitle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: theme.text,
        },
        groupCount: {
            fontFamily: 'Inter-Regular',
            fontSize: 12,
            color: theme.textSecondary,
            marginTop: 2,
        },
        transactionList: {
            paddingTop: 8,
            paddingBottom: 8,
        },
        transactionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.iconBackground,
        },
        transactionIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        positiveIcon: {
            backgroundColor: 'rgba(52, 199, 89, 0.15)',
        },
        negativeIcon: {
            backgroundColor: 'rgba(255, 59, 48, 0.15)',
        },
        transactionInfo: {
            flex: 1,
        },
        transactionDescription: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 15,
            color: theme.text,
        },
        transactionCategory: {
            fontFamily: 'Inter-Regular',
            fontSize: 13,
            color: theme.textSecondary,
            marginTop: 2,
        },
        transactionAmount: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
        },
        amountPositive: {
            color: '#34C759',
        },
        amountNegative: {
            color: '#FF3B30',
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        emptyStateTitle: {
            fontFamily: 'Poppins-Medium',
            fontSize: 18,
            color: theme.text,
            marginBottom: 8,
            textAlign: 'center',
        },
        emptyStateText: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: theme.textSecondary,
            textAlign: 'center',
            maxWidth: 250,
        },
    })
