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
        text: slate[900], // Texto principal (quase preto)
        textSecondary: slate[500], // Texto secundário (cinza médio)
        background: slate[50], // Fundo da tela (cinza muito claro)
        card: slate.white, // Fundo de cards/itens (branco)
        tint: slate[900], // Cor de destaque/seleção (igual ao texto primário)
        icon: slate[500], // Ícone padrão (cinza médio)
        iconBackground: slate[100], // Fundo para container de ícone (cinza claro)
        tabIconDefault: slate[500], // Ícone de tab não selecionado
        tabIconSelected: slate[900], // Ícone de tab selecionado (igual ao tint)
        negative: slate[900], // Cor para valores negativos (igual ao texto primário)
        shadow: slate.black, // Cor da sombra
    },
    dark: {
        text: slate[200], // Texto principal (cinza muito claro)
        textSecondary: slate[400], // Texto secundário (cinza claro)
        background: slate[950], // Fundo da tela (quase preto)
        card: slate[900], // Fundo de cards/itens (cinza bem escuro)
        tint: slate.white, // Cor de destaque/seleção (branco)
        icon: slate[400], // Ícone padrão (cinza claro)
        iconBackground: slate[800], // Fundo para container de ícone (cinza escuro)
        tabIconDefault: slate[400], // Ícone de tab não selecionado
        tabIconSelected: slate.white, // Ícone de tab selecionado (igual ao tint)
        negative: slate[200], // Cor para valores negativos (igual ao texto primário dark)
        shadow: slate.black, // Cor da sombra (menos relevante no dark mode)
    },
}
