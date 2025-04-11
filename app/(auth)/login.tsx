import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    useColorScheme,
    Platform,
} from 'react-native'
import { router } from 'expo-router'
import { Eye, EyeOff, Lock, Mail, Github, Twitter } from 'lucide-react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'

export default function Login() {
    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async () => {
        setError(null)
        setIsLoading(true)

        // Simulated login delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (!email || !password) {
            setError('Por favor, preencha todos os campos')
            setIsLoading(false)
            return
        }

        // TODO: Implement actual authentication
        router.replace('/(tabs)')
    }

    const styles = createStyles(isDark)

    return (
        <View style={styles.container}>
            <Animated.View
                entering={FadeInDown.delay(200)}
                style={styles.logoContainer}
            >
                <Image
                    source={{
                        uri: 'https://images.unsplash.com/photo-1564694202883-46e7448c1b26?w=800',
                    }}
                    style={styles.logoImage}
                />
                <Text style={styles.logoText}>BusPass</Text>
            </Animated.View>

            <Animated.View
                entering={FadeInUp.delay(400)}
                style={styles.formContainer}
            >
                <Text style={styles.title}>Bem-vindo de volta</Text>
                <Text style={styles.subtitle}>Faça login para continuar</Text>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <Mail
                        size={20}
                        color={isDark ? '#999' : '#666'}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={isDark ? '#999' : '#666'}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Lock
                        size={20}
                        color={isDark ? '#999' : '#666'}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor={isDark ? '#999' : '#666'}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff
                                size={20}
                                color={isDark ? '#999' : '#666'}
                            />
                        ) : (
                            <Eye size={20} color={isDark ? '#999' : '#666'} />
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotPassword} onPress={()=> {
                  router.push('/forgot-password')
                }}>
                    <Text style={styles.forgotPasswordText}>
                        Esqueceu sua senha?
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.loginButton,
                        isLoading && styles.loginButtonDisabled,
                    ]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.loginButtonText}>
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou continue com</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Github size={24} color={isDark ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Twitter size={24} color={isDark ? '#fff' : '#000'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Não tem uma conta?</Text>
                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={styles.signupLink}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    )
}

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000' : '#fff',
        },
        logoContainer: {
            alignItems: 'center',
            marginTop: Platform.OS === 'web' ? 60 : 80,
            marginBottom: 40,
        },
        logoImage: {
            width: 80,
            height: 80,
            borderRadius: 20,
        },
        logoText: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 24,
            color: isDark ? '#fff' : '#1a1a1a',
            marginTop: 12,
        },
        formContainer: {
            flex: 1,
            backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 32,
            ...Platform.select({
                web: {
                    maxWidth: 480,
                    margin: 'auto',
                    borderRadius: 30,
                    height: 'auto',
                    flex: undefined,
                    boxShadow: isDark
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
            }),
        },
        title: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 24,
            color: isDark ? '#fff' : '#1a1a1a',
            marginBottom: 8,
        },
        subtitle: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: isDark ? '#999' : '#666',
            marginBottom: 32,
        },
        errorContainer: {
            backgroundColor: isDark ? '#2c1515' : '#fff5f5',
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDark ? '#ff3b3b30' : '#ff3b3b20',
        },
        errorText: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: '#ff3b3b',
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#000' : '#fff',
            borderRadius: 12,
            marginBottom: 16,
            paddingHorizontal: 16,
            height: 56,
            ...Platform.select({
                web: {
                    boxShadow: isDark
                        ? '0 2px 4px rgba(0, 0, 0, 0.2)'
                        : '0 2px 4px rgba(0, 0, 0, 0.05)',
                },
                default: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.2 : 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                },
            }),
        },
        inputIcon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            color: isDark ? '#fff' : '#000',
        },
        passwordToggle: {
            padding: 8,
        },
        forgotPassword: {
            alignSelf: 'flex-end',
            marginBottom: 24,
        },
        forgotPasswordText: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: isDark ? '#999' : '#666',
        },
        loginButton: {
            backgroundColor: '#007AFF',
            borderRadius: 12,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
        },
        loginButtonDisabled: {
            opacity: 0.7,
        },
        loginButtonText: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: '#fff',
        },
        divider: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
        },
        dividerLine: {
            flex: 1,
            height: 1,
            backgroundColor: isDark ? '#333' : '#e1e1e1',
        },
        dividerText: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: isDark ? '#999' : '#666',
            marginHorizontal: 16,
        },
        socialButtons: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 32,
        },
        socialButton: {
            width: 56,
            height: 56,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? '#000' : '#fff',
            ...Platform.select({
                web: {
                    boxShadow: isDark
                        ? '0 2px 4px rgba(0, 0, 0, 0.2)'
                        : '0 2px 4px rgba(0, 0, 0, 0.05)',
                },
                default: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.2 : 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                },
            }),
        },
        signupContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
        },
        signupText: {
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: isDark ? '#999' : '#666',
        },
        signupLink: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 14,
            color: '#007AFF',
        },
    })
