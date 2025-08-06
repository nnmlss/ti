import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AddSitePage } from './pages/AddSitePage';
import { EditSitePage } from './pages/EditSitePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/add-site' element={<AddSitePage />} />
        <Route path='/edit-site/:id' element={<EditSitePage />} />
      </Routes>
    </Router>
  );
}

export default App;
