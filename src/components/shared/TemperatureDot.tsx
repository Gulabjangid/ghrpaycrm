import React from 'react';
import type { LeadTemperature } from '@/types/lead';
import { TEMPERATURE_CONFIG } from '@/types/lead';

interface Props {
  temperature: LeadTemperature;
  size?: number;
  pulse?: boolean;
}

export const TemperatureDot: React.FC<Props> = ({ temperature, size = 8, pulse = true }) => {
  const config = TEMPERATURE_CONFIG[temperature];
  return (
    <span
      title={config.label}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: config.color,
        boxShadow: `0 0 6px ${config.color}60`,
        animation: pulse && temperature === 'hot' ? 'pulse-dot 2s ease-in-out infinite' : undefined,
        flexShrink: 0,
      }}
    />
  );
};
