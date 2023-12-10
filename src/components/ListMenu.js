import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Item from './Item'
import DeleteButton from './DeleteButton'
import AddButton from './AddButton'
import ModalWindow from './ModalWindow'
import { nanoid } from 'nanoid'
import Filter from './Filter'
import { getListById, deleteItemById, addNewItemToList, toggleItemStatus } from '../ajaxController'

export default function ListMenu({ listId }) {
  const [shoppingItems, setShoppingItems] = useState(null)
  const [newItemText, setNewItemText] = useState('')
  const [promptText, setPromptText] = useState("")
  let popupDialogueInput
  let popupDialogue

  useEffect(() => {
    getListById(listId)
      .then((fetchedList) => {
        setShoppingItems(fetchedList)
      })
      .catch((error) => {
        console.error('Error fetching list:', error)
      })
  }, [listId])

  function generateId() {
    return nanoid()
  }

  function deleteItem(id) {
    deleteItemById(listId, id)
      .then(updatedList => {
        setShoppingItems(updatedList)
      })
      .catch(error => {
        console.error('Error deleting item:', error)
      })

    let updatedItems = shoppingItems?.items.filter(item => item.itemId !== id)
    setShoppingItems(prevValue => ({ ...prevValue, items: updatedItems }))
  }

  function showModal() {
    popupDialogue = document.querySelector('.popupDialogue')
    popupDialogue.show()
    document.querySelector('.disableWhileModalWindow').classList.add('disabled')
  }

  function handleInputChange(event) {
    setNewItemText(event.target.value)
  }


  function addItem() {
    if (newItemText) {
      const newItem = {
        "itemId": generateId(),
        "content": newItemText,
        "isDone": false,
        "isShown": true
      }
      setShoppingItems(prevValue => ({ ...prevValue, items: [...prevValue.items, newItem] }))
      addNewItemToList(listId, newItem)
        .then(updatedList => {
          setShoppingItems(updatedList)
        })
        .catch(error => {
          console.error('Error adding new item:', error)
        })
      closeModaWindow()
    }
    else setPromptText("Please write something!")
  }


  function showOrHideItems(type) {
    const updatedItems = shoppingItems.items.map(item => ({
      ...item,
      isShown: (type === "resolved" && item.isDone === true)
        || (type === "unresolved" && item.isDone === false)
        || (type === "all" ? true : false)
    }))
    const updatedList = { ...shoppingItems, items: updatedItems }
    setShoppingItems(updatedList)
  }


  function updateIsResolved(id) {
    toggleItemStatus(listId, id)
      .then(updatedList => {
        setShoppingItems(updatedList)
      })
      .catch(error => {
        console.error('Error toggling item status:', error)
      })

  }


  function closeModaWindow() {
    setPromptText("")
    popupDialogue = document.querySelector('.popupDialogue')
    popupDialogueInput = document.querySelector('.popupDialogueInput')
    popupDialogue.close()
    document.querySelector('.disableWhileModalWindow').classList.remove('disabled')
    setNewItemText('')
    popupDialogueInput.value = ''
  }


  return (
    <div className='listMenu'>
      <ModalWindow
        addButton={<AddButton
          addHandler={addItem}
          title="Add New Item"
        />}
        promptText={promptText}
        closeWindow={() => closeModaWindow()}
        textForPlaceHolder="type new item here..."
        handleInputChange={handleInputChange}
        inputValue={newItemText}
      />
      <div className='disableWhileModalWindow'>
        <div className="listMenuHeader">
          <Link to="/"><div className="listMenuBackButton button" title="To Lists" ></div></Link>
          <div className='listMenuListName'>{shoppingItems?.listName}</div>
        </div>
        <div className='listMenuOptions'>
          <Filter
            showArchivedResolved={() => showOrHideItems("resolved")}
            showUnarchivedUnresolved={() => showOrHideItems("unresolved")}
            showAll={() => showOrHideItems("all")}
            text1="Unresolved"
            text2="Resolved"
          />
          <div className='listMenuNewItem'>
            <AddButton title="Add New Item"
              addHandler={showModal} />
          </div>
        </div>
        <div className='listMenuItems listsStyle'>
          {shoppingItems?.items.length === 0 ? (
            <div style={{ textAlign: 'center' }}>You don't have any items yet</div>
          ) : (
            shoppingItems?.items.map(item => (
              <Item
                updateIsResolved={updateIsResolved}
                isShown={item.isShown}
                key={item.itemId}
                id={item.itemId}
                isResolved={item.isDone}
                content={item.content}
                deleteButton={<DeleteButton
                  deleteHandler={deleteItem}
                  id={item.itemId}
                  title="Delete Item" />}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
