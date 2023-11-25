
import './App.css';
import ListMenu from './components/ListMenu';
import React from 'react';
import {Routes,Route} from "react-router-dom";
import listsData from './lists';
import ListsMenu from './components/ListsMenu';
import Settings from './components/Settings';
import { useState } from 'react';
function App() {
  const [lists, setLists] = useState(listsData);

  const updateListsData = (updateListsData) => {
    setLists(updateListsData);
  };

  
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<ListsMenu lists={lists}  updateListsData={updateListsData} />} />

        {lists.map(list => (
          <Route
            key={list.listId}
            path={`/list/${list.listId}`}
            element={<ListMenu  listId={list.listId} />}
          />
        ))}

        {lists.map(list => (
          <Route
            key={list.listId}
            path={`/list/settings/${list.listId}`}
            element={<Settings listId={list.listId} updateListsData={updateListsData} />}
          />
        ))}


      </Routes>
    </div>
  );
}

export default App;
