import { Box, Button, Paper, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AirIcon from '@mui/icons-material/Air';
import { windDirections } from '@constants';
import { localizeWindDirection } from '@utils/windDirection';
import { LanguageSwitcher } from '@components/main/LanguageSwitcher';
import type { AppLanguage } from '@app-types';
import type { RootState } from '@store/store';
import { setWindDirectionFilter, clearFilters } from '@store/slices/filterSlice';
import type { WindDirectionFilterProps } from '@app-types';

export function WindDirectionFilter({ onClose }: WindDirectionFilterProps) {
  const { t, i18n } = useTranslation();
  const lang: AppLanguage = i18n.language === 'en' ? 'en' : 'bg';
  const dispatch = useDispatch();
  const selectedFilter = useSelector((state: RootState) => state.filter.windDirection);

  const handleFilterSelect = (direction: string) => {
    dispatch(setWindDirectionFilter(direction));
    onClose();
  };

  const handleClearFilter = () => {
    dispatch(clearFilters());
    onClose();
  };
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 65,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'clamp(360px, 100vw, 500px)',
        boxSizing: 'border-box',
        p: 1,
        zIndex: 1002,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1, mx: 0.5 }}>
        <Typography variant='subtitle2' sx={{ flex: 1, textAlign: 'left' }}>
          {t('windFilter.title')}
        </Typography>
        <LanguageSwitcher compact />
      </Box>

      {/* Reset button */}
      <Button
        onClick={handleClearFilter}
        variant={!selectedFilter ? 'contained' : 'outlined'}
        size='small'
        sx={{ mb: 2, width: '100%' }}
      >
        {t('windFilter.all')} <AirIcon sx={{ ml: 0.5 }} />
      </Button>

      {/* Wind direction buttons in a grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: 0.5,
        }}
      >
        {windDirections.map((direction) => (
          <Button
            key={direction}
            onClick={() => handleFilterSelect(direction)}
            variant={selectedFilter === direction ? 'contained' : 'outlined'}
            size='small'
            sx={{
              minWidth: 0,
              px: 0,
              fontSize: '13px',
              fontFamily: 'comfortaabold',
              fontWeight: 'normal',
              lineHeight: 1,
              py: 0.75,
              color: selectedFilter === direction ? 'white' : 'primary.main',
            }}
          >
            {localizeWindDirection(direction, lang)}
          </Button>
        ))}
      </Box>
    </Paper>
  );
}
