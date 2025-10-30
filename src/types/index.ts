export interface TemplateData {
  title: string;
  description: string;
  heroImage?: string;
  aboutText: string;
  contactEmail: string;
  websiteUrl: string;
  companyName: string;
  inviteeName?: string;
  inviteeEmail?: string;
  presentationTitle?: string;
  callToAction?: string;
}

export interface AnimationConfig {
  type: 'slide-up' | 'fade-in' | 'scale-down' | 'parallax' | 'none';
  duration: number;
  easing: string;
  delay?: number;
}

export interface StyleConfig {
  theme: 'modern' | 'classic' | 'minimal' | 'creative';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface?: string;
    text?: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border?: string;
    shadow?: string;
  };
  typography: {
    fontFamily: string;
    headingSize: 'large' | 'medium' | 'small';
    fontWeights?: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    fontSizes?: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    lineHeights?: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  layout: {
    containerWidth: 'full' | 'wide' | 'narrow';
    spacing: 'tight' | 'normal' | 'loose';
  };
}

export interface SectionConfig {
  hero: {
    enabled: boolean;
    animation: AnimationConfig;
    style: StyleConfig;
  };
  about: {
    enabled: boolean;
    animation: AnimationConfig;
    style: StyleConfig;
  };
  contact: {
    enabled: boolean;
    animation: AnimationConfig;
    style: StyleConfig;
  };
  features: {
    enabled: boolean;
    animation: AnimationConfig;
    style: StyleConfig;
  };
}
