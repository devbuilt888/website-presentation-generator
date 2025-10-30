export type AnimationType = 
  | 'slide-up' 
  | 'fade-in' 
  | 'scale-down' 
  | 'parallax' 
  | 'slide-in-left'
  | 'slide-in-right'
  | 'bounce-in'
  | 'zoom-in'
  | 'none';

export interface AnimationConfig {
  type: AnimationType;
  duration: number;
  easing: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export interface ScrollAnimationConfig extends AnimationConfig {
  trigger: 'scroll' | 'hover' | 'click' | 'load';
  threshold?: number;
  once?: boolean;
}
