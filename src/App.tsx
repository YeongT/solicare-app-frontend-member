import React from 'react';
import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Start from './pages/Start';

function App() {
  const [route, setRoute] = React.useState(window.location.hash || '#/start');

  React.useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#/start');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const isAuthed = Boolean(typeof window !== 'undefined' && localStorage.getItem('auth_token'));

  const renderRoute = () => {
    switch (route) {
      case '#/start':
      case '#/':
        return <Start />;
      case '#/login':
        return <Login />;
      case '#/signup':
        return <Signup />;
      case '#/dashboard':
        return isAuthed ? <MainContent /> : <Login />;
      default:
        return <Start />;
    }
  };

  return (
    <div className="App">
      <Header />
      {renderRoute()}
    </div>
  );
}

export default App;
