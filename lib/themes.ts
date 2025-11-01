import { Theme } from '@/types';

export const themes: Record<string, Theme> = {
  // BARBERSHOP THEMES (Maskulin)
  'barbershop-theme-1': {
    name: 'barbershop-theme-1',
    category: 'barbershop',
    headerGradient: 'from-slate-800 to-slate-950',
    avatarGradient: 'from-slate-700 to-amber-600',
    accentColor: 'amber',
    buttonGradient: 'from-slate-700 to-amber-600',
    buttonHover: 'from-slate-800 to-amber-700',
    borderRadius: 'sharp',
    fontWeight: 'bold',
    infoBoxStyle: {
      gradient: 'from-slate-800/10 to-amber-600/10',
      borderColor: 'amber-600',
      iconColor: 'amber-600',
    },
  },
  'barbershop-theme-2': {
    name: 'barbershop-theme-2',
    category: 'barbershop',
    headerGradient: 'from-blue-900 to-blue-950',
    avatarGradient: 'from-blue-800 to-yellow-600',
    accentColor: 'yellow',
    buttonGradient: 'from-blue-800 to-yellow-600',
    buttonHover: 'from-blue-900 to-yellow-700',
    borderRadius: 'rounded',
    fontWeight: 'semibold',
    infoBoxStyle: {
      gradient: 'from-blue-900/10 to-yellow-600/10',
      borderColor: 'yellow-600',
      iconColor: 'yellow-600',
    },
  },
  'barbershop-theme-3': {
    name: 'barbershop-theme-3',
    category: 'barbershop',
    headerGradient: 'from-zinc-800 to-red-700',
    avatarGradient: 'from-zinc-700 to-red-600',
    accentColor: 'red',
    buttonGradient: 'from-zinc-700 to-red-600',
    buttonHover: 'from-zinc-800 to-red-700',
    borderRadius: 'sharp',
    fontWeight: 'bold',
    infoBoxStyle: {
      gradient: 'from-zinc-800/10 to-red-700/10',
      borderColor: 'red-600',
      iconColor: 'red-600',
    },
  },

  // SALON WANITA THEMES (Feminin)
  'salon-wanita-theme-1': {
    name: 'salon-wanita-theme-1',
    category: 'salon-wanita',
    headerGradient: 'from-pink-400 to-purple-500',
    avatarGradient: 'from-pink-400 to-purple-500',
    accentColor: 'pink',
    buttonGradient: 'from-pink-500 to-purple-600',
    buttonHover: 'from-pink-600 to-purple-700',
    borderRadius: 'soft',
    fontWeight: 'normal',
    infoBoxStyle: {
      gradient: 'from-pink-400/10 to-purple-500/10',
      borderColor: 'pink-400',
      iconColor: 'pink-600',
    },
  },
  'salon-wanita-theme-2': {
    name: 'salon-wanita-theme-2',
    category: 'salon-wanita',
    headerGradient: 'from-rose-400 to-orange-300',
    avatarGradient: 'from-rose-400 to-orange-300',
    accentColor: 'rose',
    buttonGradient: 'from-rose-500 to-orange-400',
    buttonHover: 'from-rose-600 to-orange-500',
    borderRadius: 'soft',
    fontWeight: 'light',
    infoBoxStyle: {
      gradient: 'from-rose-400/10 to-orange-300/10',
      borderColor: 'rose-400',
      iconColor: 'rose-600',
    },
  },
  'salon-wanita-theme-3': {
    name: 'salon-wanita-theme-3',
    category: 'salon-wanita',
    headerGradient: 'from-purple-300 to-emerald-300',
    avatarGradient: 'from-purple-300 to-emerald-300',
    accentColor: 'purple',
    buttonGradient: 'from-purple-400 to-emerald-400',
    buttonHover: 'from-purple-500 to-emerald-500',
    borderRadius: 'soft',
    fontWeight: 'normal',
    infoBoxStyle: {
      gradient: 'from-purple-300/10 to-emerald-300/10',
      borderColor: 'purple-400',
      iconColor: 'purple-600',
    },
  },

  // NAIL ART THEMES (Feminin - existing JenaNail)
  'nail-art-theme-1': {
    name: 'nail-art-theme-1',
    category: 'nail-art',
    headerGradient: 'from-pink-400 to-purple-500',
    avatarGradient: 'from-pink-400 to-purple-500',
    accentColor: 'pink',
    buttonGradient: 'from-pink-500 to-purple-600',
    buttonHover: 'from-pink-600 to-purple-700',
    borderRadius: 'soft',
    fontWeight: 'normal',
    infoBoxStyle: {
      gradient: 'from-pink-400/10 to-purple-500/10',
      borderColor: 'pink-400',
      iconColor: 'pink-600',
    },
  },

  // SPA THEMES (Calming)
  'spa-theme-1': {
    name: 'spa-theme-1',
    category: 'spa',
    headerGradient: 'from-teal-400 to-cyan-500',
    avatarGradient: 'from-teal-400 to-cyan-500',
    accentColor: 'teal',
    buttonGradient: 'from-teal-500 to-cyan-600',
    buttonHover: 'from-teal-600 to-cyan-700',
    borderRadius: 'soft',
    fontWeight: 'light',
    infoBoxStyle: {
      gradient: 'from-teal-400/10 to-cyan-500/10',
      borderColor: 'teal-400',
      iconColor: 'teal-600',
    },
  },
  'spa-theme-2': {
    name: 'spa-theme-2',
    category: 'spa',
    headerGradient: 'from-amber-700 to-stone-600',
    avatarGradient: 'from-amber-700 to-stone-600',
    accentColor: 'amber',
    buttonGradient: 'from-amber-700 to-stone-700',
    buttonHover: 'from-amber-800 to-stone-800',
    borderRadius: 'rounded',
    fontWeight: 'normal',
    infoBoxStyle: {
      gradient: 'from-amber-700/10 to-stone-600/10',
      borderColor: 'amber-600',
      iconColor: 'amber-700',
    },
  },

  // CAFE THEMES (Warm & Cozy)
  'cafe-theme-1': {
    name: 'cafe-theme-1',
    category: 'cafe',
    headerGradient: 'from-orange-600 to-amber-700',
    avatarGradient: 'from-orange-600 to-amber-700',
    accentColor: 'orange',
    buttonGradient: 'from-orange-600 to-amber-700',
    buttonHover: 'from-orange-700 to-amber-800',
    borderRadius: 'rounded',
    fontWeight: 'semibold',
    infoBoxStyle: {
      gradient: 'from-orange-600/10 to-amber-700/10',
      borderColor: 'orange-500',
      iconColor: 'orange-600',
    },
  },
  'cafe-theme-2': {
    name: 'cafe-theme-2',
    category: 'cafe',
    headerGradient: 'from-zinc-900 to-zinc-800',
    avatarGradient: 'from-zinc-900 to-zinc-800',
    accentColor: 'zinc',
    buttonGradient: 'from-zinc-800 to-zinc-700',
    buttonHover: 'from-zinc-900 to-zinc-800',
    borderRadius: 'sharp',
    fontWeight: 'semibold',
    infoBoxStyle: {
      gradient: 'from-zinc-900/10 to-zinc-800/10',
      borderColor: 'zinc-700',
      iconColor: 'zinc-900',
    },
  },

  // PHOTOBOOTH THEMES (Vibrant & Playful)
  'photobooth-theme-1': {
    name: 'photobooth-theme-1',
    category: 'photobooth',
    headerGradient: 'from-orange-400 to-teal-500',
    avatarGradient: 'from-orange-400 to-teal-500',
    accentColor: 'orange',
    buttonGradient: 'from-orange-500 to-teal-600',
    buttonHover: 'from-orange-600 to-teal-700',
    borderRadius: 'rounded',
    fontWeight: 'semibold',
    infoBoxStyle: {
      gradient: 'from-orange-400/10 to-teal-500/10',
      borderColor: 'orange-400',
      iconColor: 'orange-600',
    },
  },
  'photobooth-theme-2': {
    name: 'photobooth-theme-2',
    category: 'photobooth',
    headerGradient: 'from-fuchsia-500 to-cyan-500',
    avatarGradient: 'from-fuchsia-500 to-cyan-500',
    accentColor: 'fuchsia',
    buttonGradient: 'from-fuchsia-600 to-cyan-600',
    buttonHover: 'from-fuchsia-700 to-cyan-700',
    borderRadius: 'rounded',
    fontWeight: 'bold',
    infoBoxStyle: {
      gradient: 'from-fuchsia-500/10 to-cyan-500/10',
      borderColor: 'fuchsia-500',
      iconColor: 'fuchsia-600',
    },
  },

  // DEFAULT THEME
  default: {
    name: 'default',
    category: 'default',
    headerGradient: 'from-blue-600 to-purple-600',
    avatarGradient: 'from-blue-600 to-purple-600',
    accentColor: 'blue',
    buttonGradient: 'from-blue-600 to-purple-600',
    buttonHover: 'from-blue-700 to-purple-700',
    borderRadius: 'rounded',
    fontWeight: 'normal',
    infoBoxStyle: {
      gradient: 'from-blue-600/10 to-purple-600/10',
      borderColor: 'blue-500',
      iconColor: 'blue-600',
    },
  },
};

export function getTheme(slug: string): Theme {
  return themes[slug] || themes.default;
}

export function getThemeByName(themeName: string): Theme {
  return themes[themeName] || themes.default;
}

// Get all themes as array
export function getAllThemes(): Theme[] {
  return Object.values(themes);
}

// Get themes by category
export function getThemesByCategory(category: string): Theme[] {
  return Object.values(themes).filter(theme => theme.category === category);
}
