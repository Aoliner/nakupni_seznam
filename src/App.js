
import './App.css';
import ListMenu from './components/ListMenu';
import React from 'react';
import {Routes,Route} from "react-router-dom";
import listsData from './lists';
import ListsMenu from './components/ListsMenu';
import Settings from './components/Settings';
import { useState, useEffect } from 'react';
import { getListById } from './ajaxController';
function App() {
  const [lists, setLists] = useState(null);

  const updateListsData = (updateListsData) => {
    setLists(updateListsData);
  };

  useEffect(() => {
    getListById("")
      .then((fetchedLists) => {
        setLists(fetchedLists); 
      })
      .catch((error) => {
        console.error('Error fetching list:', error);
      });
  },[] );

  
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<ListsMenu lists={lists}  updateListsData={updateListsData} />} />

        {lists && lists.map(list => (
          <Route
            key={list.listId}
            path={`/list/${list.listId}`}
            element={<ListMenu  listId={list.listId} />}
          />
        ))}

        {lists && lists.map(list => (
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
