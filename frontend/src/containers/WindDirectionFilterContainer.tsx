import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@store/store';
import { setWindDirectionFilter, clearFilters } from '@store/slices/filterSlice';
import { WindDirectionFilter } from '@components/main/WindDirectionFilter';
import type { WindDirectionFilterContainerProps } from '@types';

export function WindDirectionFilterContainer({ onClose }: WindDirectionFilterContainerProps) {
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
    <WindDirectionFilter
      selectedFilter={selectedFilter}
      onFilterSelect={handleFilterSelect}
      onClearFilter={handleClearFilter}
    />
  );
}