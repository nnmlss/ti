import { Box } from '@mui/material';
import type { AccessOption } from '../types';

// Import all access icons
import access0Icon from '../assets/icons/access0.svg';
import access1Icon from '../assets/icons/access1.svg';
import access2Icon from '../assets/icons/access2.svg';
import access3Icon from '../assets/icons/access3.svg';
import access4Icon from '../assets/icons/access4.svg';

interface AccessOptionsViewProps {
  accessOptions: AccessOption[];
  size?: number;
}

// Map access option IDs to their corresponding icons
const accessIconMap: Record<number, string> = {
  0: access0Icon,
  1: access1Icon,
  2: access2Icon,
  3: access3Icon,
  4: access4Icon,
};

export function AccessOptionsView({ accessOptions, size = 24 }: AccessOptionsViewProps) {
  if (!accessOptions || accessOptions.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
      {accessOptions.map((option) => {
        const iconSrc = accessIconMap[option._id];
        if (!iconSrc) {
          return null; // Skip if no corresponding icon found
        }

        return (
          <img
            key={option._id}
            src={iconSrc}
            alt={`Access option ${option._id}`}
            style={{
              width: size,
              height: size,
              objectFit: 'contain',
            }}
            loading="lazy"
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
