import { useId } from 'react';
import { Box, useTheme } from '@mui/material';
import type { WindDirection, WindDirectionCompassProps } from '@app-types';

const WIND_DIRECTION_ANGLES: Record<WindDirection, number> = {
  N: 0,
  NNE: 22.5,
  NE: 45,
  ENE: 67.5,
  E: 90,
  ESE: 112.5,
  SE: 135,
  SSE: 157.5,
  S: 180,
  SSW: 202.5,
  SW: 225,
  WSW: 247.5,
  W: 270,
  WNW: 292.5,
  NW: 315,
  NNW: 337.5,
};

const CARDINAL_DIRECTIONS = [
  { label: 'N', angle: 0 },
  { label: 'E', angle: 90 },
  { label: 'S', angle: 180 },
  { label: 'W', angle: 270 },
];

export function WindDirectionCompass({
  windDirections = [],
  size = 120,
}: WindDirectionCompassProps) {
  const theme = useTheme();
  const radius = size / 2;
  const innerRadius = radius - 4; // Smaller inner radius for filled segments
  const centerX = (size + 30) / 2;
  const centerY = (size + 30) / 2;

  // Unique IDs for ARIA
  const titleId = useId();
  const descId = useId();

  const accessibleDescription = `Suitable wind directions are: ${
    windDirections?.join(', ') || 'None specified'
  }.`;

  // Create filled segments for each wind direction
  const segments = (windDirections || []).map((direction, index) => {
    const angle = WIND_DIRECTION_ANGLES[direction];
    const startAngle = angle - 11.25; // 22.5° / 2 = 11.25° for each direction
    const endAngle = angle + 11.25;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    // Create pie slice path using centered coordinates
    const x1 = centerX + innerRadius * Math.cos(startRad);
    const y1 = centerY + innerRadius * Math.sin(startRad);
    const x2 = centerX + innerRadius * Math.cos(endRad);
    const y2 = centerY + innerRadius * Math.sin(endRad);

    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return (
      <path
        key={`${direction}-${index}`}
        d={pathData}
        fill={theme.palette.primary.main}
        stroke='none'
      />
    );
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative', width: size + 30, height: size + 30 }}>
        <svg
          width={size + 30}
          height={size + 30}
          style={{ position: 'absolute', top: 0, left: 0 }}
          role='img'
          aria-labelledby={`${titleId} ${descId}`}
        >
          <title id={titleId}>Wind Direction Compass</title>
          <desc id={descId}>{accessibleDescription}</desc>
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - 2}
            fill={theme.palette.grey[100]}
            stroke={theme.palette.grey[300]}
            strokeWidth={1}
          />

          {/* Cardinal direction labels outside circle */}
          {CARDINAL_DIRECTIONS.map(({ label, angle }) => {
            const rad = (angle - 90) * (Math.PI / 180);
            const x = centerX + (radius + 10) * Math.cos(rad);
            const y = centerY + (radius + 10) * Math.sin(rad);

            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor='middle'
                dominantBaseline='middle'
                fontSize='12'
                fill={theme.palette.text.secondary}
                fontWeight='bold'
              >
                {label}
              </text>
            );
          })}

          {/* Wind direction segments */}
          {segments}
        </svg>
      </Box>
    </Box>
  );
}
