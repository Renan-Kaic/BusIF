import { useState, useCallback, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    useColorScheme,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import {
    DollarSign,
    CreditCard,
    Zap,
    CheckCircle,
    ArrowLeft,
} from 'lucide-react-native'

import { Colors } from '@/constants/Colors'
import { Stack } from 'expo-router'

export default function RechargeScreen() {
    const colorScheme = useColorScheme()
    const themeColors = Colors[colorScheme ?? 'light']
    const styles = createStyles(themeColors)

    const [customAmountInput, setCustomAmountInput] = useState<string>('')
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<PaymentMethod | null>(null)

    const handleSelectPredefined = useCallback((amount: number) => {
        setCustomAmountInput('')
        setSelectedAmount(amount)
        Keyboard.dismiss()
    }, [])

    const handleCustomAmountSubmit = () => {
        const value = parseFloat(customAmountInput)
        if (!isNaN(value) && value >= 5) {
            setSelectedAmount(value)
        } else {
            setSelectedAmount(null)
        }
    }

    const handleAmountInputChange = (text: string) => {
        const cleanedText = text.replace(/[^0-9.,]/g, '').replace(',', '.')
        setCustomAmountInput(cleanedText)
        setSelectedAmount(null)
    }

    useEffect(() => {
        handleCustomAmountSubmit()
    }, [customAmountInput])

    const handleSelectPaymentMethod = useCallback((method: PaymentMethod) => {
        setSelectedPaymentMethod(method)
    }, [])

    const handleConfirmRecharge = () => {
        if (!selectedAmount || !selectedPaymentMethod) {
            Alert.alert('Erro', 'Selecione um valor e uma forma de pagamento.')
            return
        }
        Alert.alert(
            'Recarga Confirmada',
            `Valor: ${formatCurrencyBRL(selectedAmount)}\nMétodo: ${
                selectedPaymentMethod === 'pix' ? 'Pix' : 'Cartão de Crédito'
            }`,
        )
    }

    const handleGoBack = () => {
        router.back()
    }

    const isConfirmDisabled =
        !selectedAmount || !selectedPaymentMethod || selectedAmount <= 0

    const confirmButtonTextColor = isConfirmDisabled
        ? themeColors.textSecondary
        : themeColors === Colors.light
        ? Colors.light.card
        : Colors.dark.background

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <ScrollView
                    style={styles.contentScrollView}
                    contentContainerStyle={styles.contentContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        onPress={handleGoBack}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={24} color={themeColors.text} />
                    </TouchableOpacity>
                    <View style={styles.header}>
                        <Text style={styles.title}>Recarregar Saldo</Text>
                        <Text style={styles.subtitle}>
                            Selecione o valor desejado
                        </Text>
                    </View>

                    <View style={styles.valueGrid}>
                        <Text style={styles.sectionTitle}>Valores Rápidos</Text>
                        <View style={styles.amountOptionsContainer}>
                            {PREDEFINED_AMOUNTS.map((amount) => (
                                <TouchableOpacity
                                    key={amount}
                                    style={[
                                        styles.amountButton,
                                        selectedAmount === amount &&
                                            styles.amountButtonSelected,
                                    ]}
                                    onPress={() =>
                                        handleSelectPredefined(amount)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.amountButtonText,
                                            selectedAmount === amount &&
                                                styles.amountButtonTextSelected,
                                        ]}
                                    >
                                        {formatCurrencyBRL(amount)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Outro Valor</Text>
                        <Text style={styles.inputLabel}>
                            Digite o valor da recarga
                        </Text>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputCurrencySymbol}>R$</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0,00"
                                placeholderTextColor={themeColors.textSecondary}
                                keyboardType="numeric"
                                value={customAmountInput}
                                onChangeText={handleAmountInputChange}
                                onBlur={handleCustomAmountSubmit}
                                returnKeyType="done"
                            />
                        </View>
                        <Text style={styles.inputLabel}>Mínimo: R$ 5,00</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Forma de Pagamento
                        </Text>
                        <View style={styles.paymentMethodContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.paymentMethodOption,
                                    selectedPaymentMethod === 'credit_card' &&
                                        styles.paymentMethodOptionSelected,
                                ]}
                                onPress={() =>
                                    handleSelectPaymentMethod('credit_card')
                                }
                            >
                                <CreditCard
                                    size={24}
                                    color={themeColors.textSecondary}
                                    style={styles.paymentMethodIcon}
                                />
                                <Text style={styles.paymentMethodText}>
                                    Cartão de Crédito
                                </Text>
                                {selectedPaymentMethod === 'credit_card' && (
                                    <CheckCircle
                                        size={20}
                                        color={themeColors.tint}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.paymentMethodOption,
                                    selectedPaymentMethod === 'pix' &&
                                        styles.paymentMethodOptionSelected,
                                ]}
                                onPress={() => handleSelectPaymentMethod('pix')}
                            >
                                <Zap
                                    size={24}
                                    color={themeColors.textSecondary}
                                    style={styles.paymentMethodIcon}
                                />
                                <Text style={styles.paymentMethodText}>
                                    Pix
                                </Text>
                                {selectedPaymentMethod === 'pix' && (
                                    <CheckCircle
                                        size={20}
                                        color={themeColors.tint}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            isConfirmDisabled && styles.confirmButtonDisabled,
                        ]}
                        onPress={handleConfirmRecharge}
                        disabled={isConfirmDisabled}
                    >
                        <DollarSign size={20} color={confirmButtonTextColor} />
                        <Text
                            style={[
                                styles.confirmButtonText,
                                isConfirmDisabled &&
                                    styles.confirmButtonTextDisabled,
                            ]}
                        >
                            {selectedAmount && selectedAmount > 0
                                ? `Recarregar ${formatCurrencyBRL(
                                      selectedAmount,
                                  )}`
                                : 'Confirmar Recarga'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

const formatCurrencyBRL = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return 'R$ 0,00'
    }
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

const PREDEFINED_AMOUNTS = [5, 10, 25, 50, 100]
type PaymentMethod = 'credit_card' | 'pix'

const createStyles = (theme: typeof Colors.light | typeof Colors.dark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            paddingHorizontal: 0,
            paddingTop: 10,
            paddingBottom: 20,
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
            padding: 20,
        },
        section: {
            marginBottom: 30,
        },
        sectionTitle: {
            fontFamily: 'Poppins-Medium',
            fontSize: 18,
            color: theme.text,
            marginBottom: 16,
        },
        amountOptionsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
        },
        amountButton: {
            backgroundColor: theme.iconBackground,
            paddingVertical: 14,
            paddingHorizontal: 10,
            borderRadius: 12,
            minWidth: '22%',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'transparent',
        },
        amountButtonSelected: {
            backgroundColor:
                theme.tint === theme.card ? theme.iconBackground : theme.tint,
            borderColor: theme.tint,
            borderWidth: 1,
        },
        amountButtonText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: theme.text,
        },
        amountButtonTextSelected: {
            color:
                theme === Colors.light
                    ? Colors.light.card
                    : Colors.dark.background,
        },
        customAmountContainer: {
            marginTop: 20,
        },
        inputLabel: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: theme.textSecondary,
            marginBottom: 8,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.card,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.iconBackground,
            paddingHorizontal: 15,
            height: 58,
        },
        valueGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        inputCurrencySymbol: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 18,
            color: theme.textSecondary,
            marginRight: 8,
        },
        input: {
            flex: 1,
            fontFamily: 'Poppins-Medium',
            fontSize: 18,
            color: theme.text,
            height: '100%',
        },
        paymentMethodContainer: {
            gap: 12,
        },
        paymentMethodOption: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.iconBackground,
        },
        paymentMethodOptionSelected: {
            borderColor: theme.tint,
            backgroundColor:
                theme === Colors.light
                    ? Colors.light.background
                    : theme.iconBackground,
        },
        paymentMethodIcon: {
            marginRight: 12,
        },
        paymentMethodText: {
            fontFamily: 'Inter-Medium',
            fontSize: 16,
            color: theme.text,
            flex: 1,
        },
        confirmButton: {
            backgroundColor: theme.tint,
            height: 58,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
            marginTop: 30,
        },
        confirmButtonDisabled: {
            backgroundColor: theme.iconBackground,
            opacity: 0.7,
        },
        confirmButtonText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color:
                theme === Colors.light
                    ? Colors.light.card
                    : Colors.dark.background,
        },
        confirmButtonTextDisabled: {
            color: theme.textSecondary,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
    })
