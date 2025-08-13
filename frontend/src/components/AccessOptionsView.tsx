import { Box, Typography } from '@mui/material';
import type { AccessOptionId } from '../types';
import { accessOptions } from '../constants/accessOptions';

// Import all access icons
import access0Icon from '../assets/icons/access0.svg';
import access1Icon from '../assets/icons/access1.svg';
import access2Icon from '../assets/icons/access2.svg';
import access3Icon from '../assets/icons/access3.svg';
import access4Icon from '../assets/icons/access4.svg';

interface AccessOptionsViewProps {
  accessOptions: AccessOptionId[];
  size?: number;
  showLabels?: boolean;
}

// Map access option IDs to their corresponding icons
const accessIconMap: Record<number, string> = {
  0: access0Icon,
  1: access1Icon,
  2: access2Icon,
  3: access3Icon,
  4: access4Icon,
};

export function AccessOptionsView({
  accessOptions: accessOptionIds,
  size = 24,
  showLabels = false,
}: AccessOptionsViewProps) {
  if (!accessOptionIds || accessOptionIds.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: showLabels ? 2 : 1,
      }}
    >
      {accessOptionIds.map((id) => {
        const iconSrc = accessIconMap[id];
        const accessOption = accessOptions.find((option) => option._id === id);

        if (!iconSrc) {
          return null; // Skip if no corresponding icon found
        }

        if (showLabels) {
          return (
            <Box
              key={id}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
            >
              <img
                src={iconSrc}
                alt={accessOption?.bg || `Access option ${id}`}
                style={{
                  width: size,
                  height: size,
                  objectFit: 'contain',
                }}
                loading='lazy'
                onError={(e) => {
                  // Hide broken images gracefully
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              {accessOption?.bg && (
                <Typography variant='caption' sx={{ textAlign: 'center', fontSize: '0.75rem' }}>
                  {accessOption.bg}
                </Typography>
              )}
            </Box>
          );
        }

        return (
          <img
            key={id}
            src={iconSrc}
            alt={accessOption?.bg || `Access option ${id}`}
            style={{
              width: size,
              height: size,
              objectFit: 'contain',
            }}
            loading='lazy'
            onError={(e) => {
              // Hide broken images gracefully
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        );
      })}
    </Box>
  );
}
