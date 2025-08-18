import { HomePage } from '@components/pages/HomePage';
import { useHomePage } from '@hooks/pages/useHomePage';

export function HomePageContainer() {
  const {
    homeView,
    filter,
    showWindFilter,
    isAuthenticated,
    onViewToggle,
    onWindFilterToggle,
    onWindFilterClose,
  } = useHomePage();

  const isListView = homeView === 'list';

  return (
    <HomePage
      homeView={homeView}
      filter={filter}
      isListView={isListView}
      showWindFilter={showWindFilter}
      isAuthenticated={isAuthenticated}
      onViewToggle={onViewToggle}
      onWindFilterToggle={onWindFilterToggle}
      onWindFilterClose={onWindFilterClose}
    />
  );
}