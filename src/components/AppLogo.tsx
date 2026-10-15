import React from 'react';
import { GENERATED_ASSETS } from '../data/masterSpecScript';
import { ResilientImage } from './ResilientImage';

export interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  imageClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText,
  className = '',
  imageClassName = '',
  onClick
}) => {
  const sizeConfig = {
    xs: 'h-6 sm:h-7 w-auto',
    sm: 'h-7 sm:h-8 w-auto',
    md: 'h-8 sm:h-9 md:h-10 w-auto',
    lg: 'h-11 sm:h-12 md:h-14 w-auto'
  };

  const heightClass = sizeConfig[size] || sizeConfig.md;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center shrink-0 select-none ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      } ${className}`}
    >
      <ResilientImage
        src={GENERATED_ASSETS.logo}
        fallbackSrc={GENERATED_ASSETS.logoFallback}
        alt="2PARAGLIDE"
        fallbackLabel="2PARAGLIDE"
        className={`${heightClass} object-contain ${imageClassName}`}
      />
    </div>
  );
};
