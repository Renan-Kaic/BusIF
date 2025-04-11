/**
 * Cores usadas no aplicativo, definidas para modo claro e escuro.
 * Inspirado na paleta 'Slate' (monocromática).
 */

// Definições da paleta Slate (aproximadas)
const slate = {
    50: '#f8fafc', // Fundo claro
    100: '#f1f5f9', // Fundo de ícone claro
    200: '#e2e8f0', // Texto primário escuro (light text on dark bg)
    400: '#94a3b8', // Texto secundário escuro (secondary light text), ícone padrão escuro
    500: '#64748b', // Texto secundário claro (secondary dark text), ícone padrão claro
    800: '#1e293b', // Fundo de ícone escuro
    900: '#0f172a', // Texto primário claro (dark text on light bg), Fundo de card escuro, Tint claro
    950: '#020617', // Fundo escuro
    white: '#ffffff',
    black: '#000000',
}

export const Colors = {
    light: {
        text: slate[900],
        textSecondary: slate[500],
        background: slate[50],
        card: slate.white,
        tint: slate[900],
        icon: slate[500],
        iconBackground: slate[100],
        tabIconDefault: slate[500],
        tabIconSelected: slate[900],
        negative: slate[900],
        shadow: slate.black,
        error: 'red',
        errorBackground: slate[50],
        errorBorder: slate[900],
        errorContainerBorder: '#ff3b3b20',
    },
    dark: {
        text: slate[200],
        textSecondary: slate[400],
        background: slate[950],
        card: slate[900],
        tint: slate.white,
        icon: slate[400],
        iconBackground: slate[800],
        tabIconDefault: slate[400],
        tabIconSelected: slate.white,
        negative: slate[200],
        shadow: slate.black,
        error: 'red',
        errorBackground: slate[900],
        errorBorder: slate[200],
        errorContainerBorder: '#ff3b3b20',
    },
}
