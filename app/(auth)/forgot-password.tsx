import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    useColorScheme,
    Image,
} from 'react-native'
import { router } from 'expo-router'
import {
    ArrowLeft,
    Mail,
    CircleAlert as AlertCircle,
} from 'lucide-react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Colors } from '@/constants/Colors'

export default function ForgotPassword() {
    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'
    const colors = isDark ? Colors.dark : Colors.light

    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleSubmit = async () => {
        setError(null)
        if (!email) {
            setError('Por favor, insira seu email')
            return
        }
        if (!validateEmail(email)) {
            setError('Por favor, insira um email válido')
            return
        }
        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setSuccess(true)
        } catch (error) {
            setError(
                'Ocorreu um erro ao enviar o email. Por favor, tente novamente.',
            )
        } finally {
            setIsLoading(false)
        }
    }

    const styles = createStyles(isDark, colors)

    if (success) {
        return (
            <View style={styles.container}>
                <Animated.View
                    entering={FadeInDown.delay(200)}
                    style={styles.successContainer}
                >
                    <Image
                        source={{
                            uri: 'https://images.unsplash.com/photo-1526554850534-7c78330d5f90?w=800',
                        }}
                        style={styles.successImage}
                    />
                    <Text style={styles.successTitle}>Email Enviado!</Text>
                    <Text style={styles.successText}>
                        Enviamos as instruções de recuperação de senha para o
                        seu email. Por favor, verifique sua caixa de entrada.
                    </Text>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.submitButtonText}>
                            Voltar para o Login
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Animated.View
                entering={FadeInDown.delay(200)}
                style={styles.formContainer}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={colors.tint} />
                </TouchableOpacity>

                <Text style={styles.title}>Esqueceu sua senha?</Text>
                <Text style={styles.subtitle}>
                    Digite seu email abaixo e enviaremos instruções para
                    redefinir sua senha.
                </Text>

                {error && (
                    <View style={styles.errorContainer}>
                        <AlertCircle
                            size={20}
                            color={colors.error}
                            style={styles.errorIcon}
                        />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View
                        style={[
                            styles.inputContainer,
                            error && styles.inputError,
                        ]}
                    >
                        <Mail
                            size={20}
                            color={colors.icon}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="seu.email@exemplo.com"
                            placeholderTextColor={colors.textSecondary}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text)
                                if (error) setError(null)
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            selectionColor={colors.tint}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        isLoading && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    <Text style={styles.submitButtonText}>
                        {isLoading ? 'Enviando...' : 'Enviar Instruções'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => router.push('/login')}
                >
                    <Text style={styles.loginLinkText}>
                        Voltar para o Login
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

const createStyles = (
    isDark: boolean,
    colors: typeof Colors.light | typeof Colors.dark,
) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        formContainer: {
            flex: 1,
            padding: 32,
            ...Platform.select({
                web: {
                    maxWidth: 480,
                    margin: 'auto',
                    marginTop: 40,
                },
            }),
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.iconBackground,
            marginBottom: 24,
        },
        title: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 28,
            color: colors.text,
            marginBottom: 12,
        },
        subtitle: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 32,
            lineHeight: 24,
        },
        errorContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.errorBackground,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.errorContainerBorder,
        },
        errorIcon: {
            marginRight: 8,
        },
        errorText: {
            flex: 1,
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: colors.error,
        },
        inputGroup: {
            marginBottom: 24,
        },
        label: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 14,
            color: colors.text,
            marginBottom: 8,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 12,
            paddingHorizontal: 16,
            height: 56,
            ...Platform.select({
                web: {
                    boxShadow: `0 2px 4px rgba(${isDark ? '0,0,0' : '0,0,0'}, ${
                        isDark ? 0.2 : 0.05
                    })`,
                },
                default: {
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.2 : 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                },
            }),
        },
        inputError: {
            borderWidth: 1,
            borderColor: colors.errorBorder,
        },
        inputIcon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: colors.text,
        },
        submitButton: {
            backgroundColor: colors.tint,
            borderRadius: 12,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
        },
        submitButtonDisabled: {
            opacity: 0.7,
        },
        submitButtonText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: isDark ? Colors.dark.card : Colors.light.card,
        },
        loginLink: {
            alignItems: 'center',
        },
        loginLinkText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 14,
            color: colors.tint,
        },
        successContainer: {
            flex: 1,
            padding: 32,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
                web: {
                    maxWidth: 480,
                    margin: 'auto',
                },
            }),
        },
        successImage: {
            width: 200,
            height: 200,
            borderRadius: 100,
            marginBottom: 32,
        },
        successTitle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 24,
            color: colors.text,
            marginBottom: 16,
            textAlign: 'center',
        },
        successText: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 24,
        },
    })
