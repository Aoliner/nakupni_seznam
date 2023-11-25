import React, { useState, useEffect } from 'react'
import AddButton from './AddButton'
import ThemeStyle from './ThemeStyle'
import Filter from './Filter'
import lists from '../lists'
import List from './List'
import userInfo from '../userInfo'
import ModalWindow from './ModalWindow'
import { nanoid } from 'nanoid'

export default function ListsMenu({ updateListsData }) {

  const [shoppingLists, setShoppingLists] = useState(lists)
  const [tileView, setTileView] = useState(false)
  const [newListText, setNewListText] = useState("")
  const [promptText, setPromptText] = useState("")
  let popupDialogueInput;
  let popupDialogue;
  const filteredLists = shoppingLists.filter(list =>
    userInfo.userLists.some(userList => userList.listId === list.listId))
  
    function handleInputChange(event) {
      setNewListText(event.target.value);
    }
    function generateId() {
      return nanoid()
    }

  function updateLists(updatedLists) {
    lists.splice(0, lists.length, ...updatedLists);

  }

  function showOrHideItems(type) {
    const updatedLists = filteredLists.map(list => ({
      ...list,
      isShown: (type === "archived" && list.isArchived === true)
        || (type === "unarchived" && list.isArchived === false)
        || (type === "all" ? true : false)
    }));

    setShoppingLists(updatedLists)
  }

  function unarchive(listId) {
    const updatedListsArchived = filteredLists.map(list => (list.listId === listId ? { ...list, isArchived: false } : { ...list }))
    setShoppingLists(updatedListsArchived)
    const updatedLists = lists.map(list =>
      list.listId === (listId) ? { ...list, isArchived: false } : list)
    updateLists(updatedLists)

  }
  function changeThemeList() {
    setTileView(false);
    document.querySelector(".listsMenuOptions").setAttribute("style", "margin-bottom:0px")
  }

  function changeThemeTiles() {
    setTileView(true);
    document.querySelector(".listsMenuOptions").setAttribute("style", "margin-bottom:5px")
  }


function addList(){

  if (newListText) {
    const newList =    {
      "listId": generateId(),
      "listName": newListText ,
      "isArchived":false,
      "isShown": true,
      "users":
      {
       "owner":{
          "UserId":userInfo.UserId,
          "UserName":userInfo.UserName
       },
       "guests":[]
      },
      "items": []
    }

    closeModaWindow()
    ///
    const updatedLists = [...lists, newList];
    setShoppingLists(updatedLists)
    updateLists(updatedLists);
    updateListsData(updatedLists);
    console.log(lists)
    userInfo.userLists.push({"listId": newList.listId, "listName": newList.listName})
    console.log(userInfo.userLists)
  }
  else setPromptText("Please write something!")

}

function closeModaWindow(){
  setPromptText("")
  popupDialogue = document.querySelector('.popupDialogue');
  popupDialogueInput = document.querySelector('.popupDialogueInput');
  popupDialogue.close();
  document.querySelector('.disableWhileModalWindow').classList.remove('disabled');
  setNewListText('');
  popupDialogueInput.value = '';
}
  
function showModal() {
  popupDialogue = document.querySelector('.popupDialogue')
  popupDialogue.show()
  document.querySelector('.disableWhileModalWindow').classList.add('disabled')
}


  return (
    <>
        <ModalWindow
                addButton={<AddButton
                    addHandler={addList}
                    title="Add New List"
                  />}
                  promptText = {promptText}
                  closeWindow={()=>closeModaWindow()}
                  textForPlaceHolder="type new list here..."
                  handleInputChange={handleInputChange}
                  inputValue={newListText} 
        />
      <div className='disableWhileModalWindow'>
        <div className='listsMenuOptions'>
          <Filter
            showArchivedResolved={() => showOrHideItems("archived")}
            showUnarchivedUnresolved={() => showOrHideItems("unarchived")}
            showAll={() => showOrHideItems("all")}
            text1="Unarchived"
            text2="Archived"
          />
          <ThemeStyle
            changeThemeList={changeThemeList}
            changeThemeTiles={changeThemeTiles}
          />
          <div className='changeLanguageButton button'></div>
          <div className='darkThemeButton button'></div>
          <AddButton 
          addHandler={showModal}
          title="Add New List"
          />
        </div>
        <div className={tileView ? 'listOfLists tilesStyle' : 'listOfLists'}>
          {filteredLists.length === 0 ? (
            <div className='centerText'>You don't have any lists yet</div>
          ) : (
            filteredLists
              .filter(list => list.isShown)
              .map(list => (
                <div className={tileView ? 'listInfo titleStyleListBox' : 'listInfo'} key={list.listId}>
                  <List
                    tileView={tileView}
                    isArchived={list.isArchived}
                    listId={list.listId}
                    isShown={list.isShown}
                    key={list.listId}
                    listName={list.listName}
                    unarchive={unarchive}
                  />
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}