import { Box, Button, Paper, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import AirIcon from '@mui/icons-material/Air';
import { windDirections } from '@constants';
import type { RootState } from '@store/store';
import { setWindDirectionFilter, clearFilters } from '@store/slices/filterSlice';

interface WindDirectionFilterProps {
  onClose: () => void;
}

export function WindDirectionFilter({ onClose }: WindDirectionFilterProps) {
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
        left: 0,
        p: 1,
        width: '100vw',
        zIndex: 1002,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      <Typography variant='subtitle2' sx={{ mb: 1, textAlign: 'center' }}>
        Филтрирай по посока на вятъра
      </Typography>

      {/* Reset button */}
      <Button
        onClick={handleClearFilter}
        variant={!selectedFilter ? 'contained' : 'outlined'}
        size='small'
        sx={{ mb: 2, width: '100%' }}
      >
        Всички <AirIcon sx={{ ml: 0.5 }} />
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
              minWidth: 40,
              fontSize: '0.75rem',
              py: 0.5,
              color: selectedFilter === direction ? 'white' : 'primary.main',
            }}
          >
            {direction}
          </Button>
        ))}
      </Box>
    </Paper>
  );
}
