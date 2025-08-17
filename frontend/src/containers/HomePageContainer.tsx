import { HomePage } from '@components/pages/HomePage';
import { useHomePage } from '@hooks/pages/useHomePage';

export function HomePageContainer() {
  const {
    homeView,
    showWindFilter,
    onWindFilterClose,
  } = useHomePage();

  const isListView = homeView === 'list';

  return (
    <HomePage
      isListView={isListView}
      showWindFilter={showWindFilter}
      onWindFilterClose={onWindFilterClose}
    />
  );
}