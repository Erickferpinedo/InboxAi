import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Inbox from './Pages/Inbox.jsx';
import Drafts from './Pages/Drafts.jsx';
import Settings from './Pages/Settings.jsx';
import SmartReplies from './Pages/SmartReplies.jsx';
import QuickActions from './Pages/QuickActions.jsx';
import Tasks from './Pages/Tasks.jsx';
import Threads from './Pages/Threads.jsx';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inbox />} /> {/* default to Inbox */}
          <Route path="inbox" element={<Inbox />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="smartreplies" element={<SmartReplies />} />
          <Route path="quickactions" element={<QuickActions />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="threads" element={<Threads />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
