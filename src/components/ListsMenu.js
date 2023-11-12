import React, { useState } from 'react'
import AddButton from './AddButton'
import ThemeStyle from './ThemeStyle'
import Filter from './Filter'
import lists from '../lists'
import List from './List'
import { Link } from 'react-router-dom';
import userInfo from '../userInfo'
export default function ListsMenu() {

  const [shoppingLists, setShoppingLists] = useState(lists)
  const filteredLists = shoppingLists.filter(list =>
    userInfo.userLists.some(userList => userList.listId === list.listId)
  )

  return (
    <>
      <div className='listsMenuOptions'>
        <Filter
         text1="Unarchived"
         text2="Archived"
        />
        <ThemeStyle
        />
        <div className='changeLanguageButton button'></div>
        <div className='darkThemeButton button'></div>
        <AddButton />
      </div>
      <div className='listOfLists'>
        {filteredLists.map(list => (
          <div className={`listInfo ${list.isArchived ? 'disabled' : ''}`}  key={list.listId} >
            <Link to={`/list/${list.listId}`} >
              <List
                key={list.listId}
                listName={list.listName}
                isArchived={list.isArchived}
              /></Link> 
              {!list.isArchived?
              <Link to={`/list/settings/${list.listId}` }><div className='listSettings button'></div></Link> :
              <div className='listArchived button'></div> }
            
          </div>)
        )
        }
      </div>
    </>
  )
}
