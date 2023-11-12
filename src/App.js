
import './App.css';
import ListMenu from './components/ListMenu';
import React from 'react';
import {Routes,Route} from "react-router-dom";
import lists from './lists';
import ListsMenu from './components/ListsMenu';
import Settings from './components/Settings';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<ListsMenu lists={lists} />} />

        {lists.map(list => (
          <Route
            key={list.listId}
            path={`/list/${list.listId}`}
            element={<ListMenu listId={list.listId} />}
          />
        ))}

        {lists.map(list => (
          <Route
            key={list.listId}
            path={`/list/settings/${list.listId}`}
            element={<Settings listId={list.listId} />}
          />
        ))}

      </Routes>
    </div>
  );
}

export default App;
