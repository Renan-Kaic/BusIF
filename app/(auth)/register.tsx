import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    useColorScheme,
    ActivityIndicator,
} from 'react-native'
import { router, Stack } from 'expo-router'
import {
    Calendar,
    Mail,
    User,
    Lock,
    CircleAlert as AlertCircle,
    Eye,
    EyeOff,
    ArrowLeft,
} from 'lucide-react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker'

import { Colors } from '@/constants/Colors'

export default function Register() {
    const colorScheme = useColorScheme() ?? 'light'
    const themeColors = Colors[colorScheme]
    const styles = createStyles(themeColors)

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        cpf: '',
        email: '',
        dateOfBirth: new Date(),
        password: '',
        confirmPassword: '',
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState(false)

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Nome é obrigatório'
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'Nome deve ter pelo menos 2 caracteres'
        } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.firstName.trim())) {
            newErrors.firstName = 'Nome inválido'
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Sobrenome é obrigatório'
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Sobrenome deve ter pelo menos 2 caracteres'
        } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.lastName.trim())) {
            newErrors.lastName = 'Sobrenome inválido'
        }

        if (!formData.cpf) {
            newErrors.cpf = 'CPF é obrigatório'
        } else if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(formData.cpf)) {
            newErrors.cpf = 'Formato de CPF inválido'
        }

        if (!formData.email) {
            newErrors.email = 'Email é obrigatório'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Formato de email inválido'
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Senha deve ter pelo menos 8 caracteres'
        } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                formData.password,
            )
        ) {
            newErrors.password =
                'Requer maiúscula, minúscula, número e símbolo (@$!%*?&)'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
        } else if (
            formData.password &&
            formData.confirmPassword !== formData.password
        ) {
            newErrors.confirmPassword = 'As senhas não coincidem'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsLoading(true)
        setErrors({})
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            router.replace('/(tabs)')
        } catch (error) {
            console.error('Erro no registro:', error)
            setErrors({
                general: 'Ocorreu um erro. Tente novamente.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
    }

    const handleDateChange = (
        event: DateTimePickerEvent,
        selectedDate?: Date,
    ) => {
        setShowDatePicker(Platform.OS === 'ios')
        if (selectedDate && event.type !== 'dismissed') {
            setFormData((prev) => ({
                ...prev,
                dateOfBirth: selectedDate,
            }))
        }
        if (Platform.OS !== 'ios' || event.type === 'set') {
            setShowDatePicker(false)
        }
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
        if (
            (field === 'password' || field === 'confirmPassword') &&
            errors.confirmPassword
        ) {
            setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
        }
        if (errors.general) {
            setErrors((prev) => ({ ...prev, general: undefined }))
        }
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <Stack.Screen options={{ headerShown: false }} />
            <Animated.View
                entering={FadeInDown.delay(100).duration(500)}
                style={styles.formContainer}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                        router.canGoBack() ? router.back() : router.replace('/')
                    }
                    activeOpacity={0.7}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <ArrowLeft
                        size={28}
                        color={themeColors.text}
                        style={styles.backButtonIcon}
                    />
                </TouchableOpacity>

                <Text style={styles.title}>Criar Conta</Text>
                <Text style={styles.subtitle}>
                    Preencha seus dados para começar
                </Text>

                {errors.general && (
                    <View style={styles.errorContainer}>
                        <AlertCircle
                            size={20}
                            color={themeColors.error}
                            style={styles.errorIcon}
                        />
                        <Text style={styles.errorText}>{errors.general}</Text>
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome *</Text>
                    <View
                        style={[
                            styles.inputContainer,
                            styles.inputContainerWithIcon,
                            errors.firstName && styles.inputError,
                        ]}
                    >
                        <User
                            size={20}
                            color={themeColors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu nome"
                            placeholderTextColor={themeColors.textSecondary}
                            value={formData.firstName}
                            onChangeText={(text) =>
                                handleInputChange('firstName', text)
                            }
                            autoCapitalize="words"
                            returnKeyType="next"
                        />
                    </View>
                    {errors.firstName && (
                        <Text style={styles.fieldError}>
                            {errors.firstName}
                        </Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Sobrenome *</Text>
                    <View
                        style={[
                            styles.inputContainer,
                            styles.inputContainerWithIcon,
                            errors.lastName && styles.inputError,
                        ]}
                    >
                        <User
                            size={20}
                            color={themeColors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu sobrenome"
                            placeholderTextColor={themeColors.textSecondary}
                            value={formData.lastName}
                            onChangeText={(text) =>
                                handleInputChange('lastName', text)
                            }
                            autoCapitalize="words"
                            returnKeyType="next"
                        />
                    </View>
                    {errors.lastName && (
                        <Text style={styles.fieldError}>{errors.lastName}</Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>CPF *</Text>
                    <View
                        style={[
                            styles.inputContainer,
                            styles.inputContainerWithoutIcon,
                            errors.cpf && styles.inputError,
                        ]}
                    >
                        <TextInput
                            style={styles.input}
                            placeholder="000.000.000-00"
                            placeholderTextColor={themeColors.textSecondary}
                            value={formData.cpf}
                            onChangeText={(text) =>
                                handleInputChange('cpf', formatCPF(text))
                            }
                            keyboardType="numeric"
                            maxLength={14}
                            returnKeyType="next"
                        />
                    </View>
                    {errors.cpf && (
                        <Text style={styles.fieldError}>{errors.cpf}</Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email *</Text>
                    <View
                        style={[
                            styles.inputContainer,
                            styles.inputContainerWithIcon,
                            errors.email && styles.inputError,
                        ]}
                    >
                        <Mail
                            size={20}
                            color={themeColors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="seu.email@exemplo.com"
                            placeholderTextColor={themeColors.textSecondary}
                            value={formData.email}
                            onChangeText={(text) =>
                                handleInputChange('email', text)
                            }
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                        />
                    </View>
                    {errors.email && (
                        <Text style={styles.fieldError}>{errors.email}</Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Data de Nascimento</Text>
                    <TouchableOpacity
                        style={[
                            styles.inputContainer,
                            styles.inputContainerWithIcon,
                        ]}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                    >
                        <Calendar
                            size={20}
                            color={themeColors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <Text style={[styles.input, styles.dateText]}>
                            {formData.dateOfBirth.toLocaleDateString('pt-BR')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Senha *</Text>
                    <View
                        style={[
                            styles.inputContainer,
                            styles.inputContainerWithIcon,
                            errors.password && styles.inputError,
                        ]}
                    >
                        <Lock
                            size={20}
                            color={themeColors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite sua senha"
                            placeholderTextColor={themeColors.textSecondary}
                            value={formData.password}
                            onChangeText={(text) =>
                                handleInputChange('password', text)
                            }
                            secureTextEntry={!isPasswordVisible}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                        />
                        <TouchableOpacity
                            style={styles.eyeIconContainer}
                            onPress={() =>
                                setIsPasswordVisible(!isPasswordVisible)
                            }
                            hitSlop={{
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10,
                            }}
                        >
                            {isPasswordVisible ? (
                                <EyeOff
                                    size={20}
                                    color={themeColors.textSecondary}
                                />
                            ) : (
                                <Eye
                                    size={20}
                                    color={themeColors.textSecondary}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    {errors.password && (
                        <Text style={styles.fieldError}>{errors.password}</Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirmar Senha *</Text>
                    <View
                        style={[
                            styles.inputContainer,
                            styles.inputContainerWithIcon,
                            errors.confirmPassword && styles.inputError,
                        ]}
                    >
                        <Lock
                            size={20}
                            color={themeColors.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite sua senha novamente"
                            placeholderTextColor={themeColors.textSecondary}
                            value={formData.confirmPassword}
                            onChangeText={(text) =>
                                handleInputChange('confirmPassword', text)
                            }
                            secureTextEntry={!isConfirmPasswordVisible}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="done"
                            onSubmitEditing={handleSubmit}
                        />
                        <TouchableOpacity
                            style={styles.eyeIconContainer}
                            onPress={() =>
                                setIsConfirmPasswordVisible(
                                    !isConfirmPasswordVisible,
                                )
                            }
                            hitSlop={{
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10,
                            }}
                        >
                            {isConfirmPasswordVisible ? (
                                <EyeOff
                                    size={20}
                                    color={themeColors.textSecondary}
                                />
                            ) : (
                                <Eye
                                    size={20}
                                    color={themeColors.textSecondary}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && (
                        <Text style={styles.fieldError}>
                            {errors.confirmPassword}
                        </Text>
                    )}
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={formData.dateOfBirth}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                        themeVariant={colorScheme}
                    />
                )}

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        isLoading && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator
                            size="small"
                            color={
                                themeColors === Colors.light
                                    ? Colors.light.card
                                    : Colors.dark.background
                            }
                        />
                    ) : (
                        <Text style={styles.submitButtonText}>Criar conta</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.termsText}>
                    Ao criar uma conta, você concorda com nossos{' '}
                    <Text
                        style={styles.termsLink}
                        onPress={() => console.log('Abrir Termos')}
                    >
                        Termos de Serviço
                    </Text>{' '}
                    e{' '}
                    <Text
                        style={styles.termsLink}
                        onPress={() => console.log('Abrir Privacidade')}
                    >
                        Política de Privacidade
                    </Text>
                </Text>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Já tem uma conta?</Text>
                    <TouchableOpacity
                        onPress={() => router.replace('/login')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.loginLink}>Faça login</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </ScrollView>
    )
}

type FormData = {
    firstName: string
    lastName: string
    cpf: string
    email: string
    dateOfBirth: Date
    password: string
    confirmPassword: string
}

type FormErrors = {
    [K in keyof Omit<FormData, 'confirmPassword'>]?: string
} & {
    general?: string
    confirmPassword?: string
}

const createStyles = (theme: typeof Colors.light | typeof Colors.dark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        contentContainer: {
            flexGrow: 1,
            justifyContent: 'center',
            paddingBottom: 40,
            paddingTop: Platform.OS === 'ios' ? 60 : 40,
        },
        formContainer: {
            paddingHorizontal: 32,
            position: 'relative',
            ...Platform.select({
                web: {
                    maxWidth: 480,
                    marginHorizontal: 'auto',
                },
            }),
        },
        backButton: {
            position: 'absolute',
            top: Platform.OS === 'ios' ? -40 : -20,
            left: -5,
            zIndex: 10,
            padding: 10,
        },
        backButtonIcon: {},
        title: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 30,
            color: theme.text,
            marginBottom: 8,
            textAlign: 'center',
            marginTop: 25,
        },
        subtitle: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.textSecondary,
            marginBottom: 32,
            textAlign: 'center',
        },
        errorContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.errorBackground,
            borderRadius: 12,
            padding: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme.errorBorder,
        },
        errorIcon: {
            marginRight: 10,
        },
        errorText: {
            flex: 1,
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: theme.error,
        },
        inputGroup: {
            marginBottom: 22,
        },
        label: {
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            color: theme.text,
            marginBottom: 8,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.card,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.iconBackground,
            height: 56,
        },
        inputContainerWithIcon: {
            paddingLeft: 16,
        },
        inputContainerWithoutIcon: {
            paddingHorizontal: 16,
        },
        inputError: {
            borderColor: theme.error,
        },
        inputIcon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: theme.text,
            height: '100%',
        },
        eyeIconContainer: {
            paddingHorizontal: 12,
            height: '100%',
            justifyContent: 'center',
        },
        dateText: {
            flex: 1,
            lineHeight: 56,
            color: theme.text,
        },
        fieldError: {
            fontFamily: 'Inter-Regular',
            fontSize: 12,
            color: theme.error,
            marginTop: 6,
            marginLeft: 4,
        },
        submitButton: {
            backgroundColor: theme.tint,
            borderRadius: 12,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 12,
            marginBottom: 24,
        },
        submitButtonDisabled: {
            opacity: 0.6,
        },
        submitButtonText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color:
                theme === Colors.light
                    ? Colors.light.card
                    : Colors.dark.background,
        },
        termsText: {
            fontFamily: 'Inter-Regular',
            fontSize: 13,
            color: theme.textSecondary,
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 18,
        },
        termsLink: {
            color: theme.tint,
            fontFamily: 'Inter-Medium',
        },
        loginContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
        },
        loginText: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: theme.textSecondary,
        },
        loginLink: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 14,
            color: theme.tint,
        },
    })
