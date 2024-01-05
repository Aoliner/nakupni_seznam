import React, { useState, useEffect, useContext } from 'react'
import AddButton from './AddButton'
import ThemeStyle from './ThemeStyle'
import Filter from './Filter'
import List from './List'
import userInfo from '../userInfo'
import ModalWindow from './ModalWindow'
import { addNewList, unarchiveList, getListById, getUserInfo, updateUserInfo } from '../ajaxController'
import { ThemeContext } from '../App';
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import '../styles/listsMenu.css'
import BarChart from './BarChart'
import Statistics from './Statistics'
export default function ListsMenu({ updateListsData }) {
  const [shoppingLists, setShoppingLists] = useState(null)
  const [tileView, setTileView] = useState(false)
  const [newListText, setNewListText] = useState("")
  const [promptText, setPromptText] = useState("")
  const [userLists, setUserLists] = useState(null)
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showStatistics, setShowStatistics] = useState(true)
  function toggleStatistics() {
    setShowStatistics((prevShowStatistics) => !prevShowStatistics);
  }
  const { i18n, t } = useTranslation(["home"]);

  const handleLanguageChange = (languageId) => {
    console.log(languageId)
    i18n.changeLanguage(languageId);
  };
  useEffect(() => {
    if (localStorage.getItem("i18nextLng")?.length > 2) {
      i18next.changeLanguage("en");
    }
  }, []);

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
    else setPromptText(t("Please write something!"))

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
          title={t("Add New List")}
        />}
        promptText={promptText}
        closeWindow={() => closeModaWindow()}
        textForPlaceHolder={t("type new list here...")}
        handleInputChange={handleInputChange}
        inputValue={newListText}
      />
      <div className='disableWhileModalWindow'>
        <div className='listsMenuOptions'>
          <Filter
            showArchivedResolved={() => showOrHideItems("archived")}
            showUnarchivedUnresolved={() => showOrHideItems("unarchived")}
            showAll={() => showOrHideItems("all")}
            text1={t("Unarchived")}
            text2={t("Archived")}
            text3={t("Show All")}
          />
          <ThemeStyle
            changeThemeList={changeThemeList}
            changeThemeTiles={changeThemeTiles}
          />

          <Statistics
            toggleStatistics={toggleStatistics} />
          <div className="dropdown changeLanguage">
            <div className='changeLanguageButton button icon' ></div>
            <div className="dropdown-content">
              <p id="en" onClick={() => handleLanguageChange("en")}>English</p>
              <p id="cz" onClick={() => handleLanguageChange("cz")} >Čeština</p>
            </div>
          </div>
          <div className='darkThemeButton button' title={t("Change Theme")} onClick={toggleTheme}></div>
          <AddButton
            addHandler={showModal}
            title={t("Add New List")}
          />
        </div>
        <div className={tileView ? 'listOfLists tilesStyle' : 'listOfLists'}>
          {filteredLists && filteredLists.length === 0 ? (
            <div className='centerText'>{t("You don't have any lists yet")}</div>
          ) : (
            filteredLists
              ?.filter(list => list.isShown)
              .map(list => (
                <div className={tileView ? 'listInfo tilesStyleListBox' : 'listInfo'} key={list.listId}>
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
        {showStatistics && <BarChart filteredLists={filteredLists} />}
      </div>
    </>
  )
}