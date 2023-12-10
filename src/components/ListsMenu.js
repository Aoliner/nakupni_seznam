import React, { useState, useEffect } from 'react'
import AddButton from './AddButton'
import ThemeStyle from './ThemeStyle'
import Filter from './Filter'
import List from './List'
import userInfo from '../userInfo'
import ModalWindow from './ModalWindow'
import { addNewList, unarchiveList, getListById, getUserInfo, updateUserInfo } from '../ajaxController'

export default function ListsMenu({ updateListsData }) {
  const [shoppingLists, setShoppingLists] = useState(null)
  const [tileView, setTileView] = useState(false)
  const [newListText, setNewListText] = useState("")
  const [promptText, setPromptText] = useState("")
  const [userLists, setUserLists] = useState(null)


  useEffect(() => {
    getUserInfo()
      .then(userInfoData => {
        setUserLists(userInfoData.userLists)
      })
      .catch(error => {
        console.error('Error fetching user info:', error)
      })
  }, [])

  useEffect(() => {
    getListById("")
      .then((fetchedLists) => {
        setShoppingLists(fetchedLists)
      })
      .catch((error) => {
        console.error('Error fetching list:', error)
      })
  }, [])

  let popupDialogueInput
  let popupDialogue


  const filteredLists = shoppingLists?.filter(list =>
    userLists?.some(userList => userList.listId === list.listId))


  function handleInputChange(event) {
    setNewListText(event.target.value)
  }

  function showOrHideItems(type) {
    const updatedLists = filteredLists.map(list => ({
      ...list,
      isShown: (type === "archived" && list.isArchived === true)
        || (type === "unarchived" && list.isArchived === false)
        || (type === "all" ? true : false)
    }))

    setShoppingLists(updatedLists)
  }

  function unarchive(listId) {
    unarchiveList({ "isArchived": false }, listId)
    const updatedListsArchived = filteredLists.map(list => (list.listId === listId ? { ...list, isArchived: false } : { ...list }))
    setShoppingLists(updatedListsArchived)

  }

  function changeThemeList() {
    setTileView(false)
    document.querySelector(".listsMenuOptions").setAttribute("style", "margin-bottom:0px")
  }

  function changeThemeTiles() {
    setTileView(true)
    document.querySelector(".listsMenuOptions").setAttribute("style", "margin-bottom:5px")
  }


  function addList() {
    if (newListText) {
      const newList = {
        "listId": "",
        "listName": newListText,
        "isArchived": false,
        "isShown": true,
        "users":
        {
          "owner": {
            "UserId": userInfo.UserId,
            "UserName": userInfo.UserName
          },
          "guests": []
        },
        "items": []
      }

      closeModaWindow()
      addNewList(newList)
        .then((addedList) => {
          setShoppingLists((prevLists) => [...prevLists, addedList])
          setUserLists((prevUserLists) => [...prevUserLists, addedList])
          return getListById("")
        })
        .then((fetchedLists) => {
          updateListsData(fetchedLists)
          return updateUserInfo({
            "listId": fetchedLists[fetchedLists.length - 1].listId,
            "listName": fetchedLists[fetchedLists.length - 1].listName
          })
        })
        .catch((error) => {
          console.error('Error adding list:', error)
        })
    }
    else setPromptText("Please write something!")

  }

  function closeModaWindow() {
    setPromptText("")
    popupDialogue = document.querySelector('.popupDialogue')
    popupDialogueInput = document.querySelector('.popupDialogueInput')
    popupDialogue.close()
    document.querySelector('.disableWhileModalWindow').classList.remove('disabled')
    setNewListText('')
    popupDialogueInput.value = ''
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
        promptText={promptText}
        closeWindow={() => closeModaWindow()}
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
          {filteredLists && filteredLists.length === 0 ? (
            <div className='centerText'>You don't have any lists yet</div>
          ) : (
            filteredLists
              ?.filter(list => list.isShown)
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
  )
}