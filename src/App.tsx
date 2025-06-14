import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ManagingUI from './exercises/01.managing-ui-state'
import SideEffects from './exercises/02.side-effects'
import LiftingState from './exercises/03.lifting-state'
import Dom from './exercises/04.dom'
import TicTacTes from './exercises/05.tic-tac-toe'

const routes = [
  { path: "/managing-ui-state/usestate", element: <ManagingUI /> },
  { path: "/effect/use-effect", element: <SideEffects /> },
  { path: "/lifting-state/lift-state", element: <LiftingState /> },
  { path: "/dom-effect/refs", element: <Dom /> },
  { path: "/tictactos/setstate", element: <TicTacTes /> },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex">
        <div style={{ display: sidebarOpen ? 'none' : 'block' }} >
          <Sidebar />
        </div>
        <main className={`p-6 flex-1 ${sidebarOpen ? 'ml-0' : 'ml-64'} transition-all duration-300 ease-in-out`}>
          <button
            className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
