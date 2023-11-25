import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Item from './Item'
import DeleteButton from './DeleteButton'
import lists from '../lists' 
import AddButton from './AddButton';
import ModalWindow from './ModalWindow'
import { nanoid } from 'nanoid'
import Filter from './Filter'
export default function ListMenu({ listId }) {
    const [shoppingItems, setShoppingItems] = useState(null);
    const [newItemText, setNewItemText] = useState('');
    const [promptText, setPromptText] = useState("")
    let popupDialogueInput;
    let popupDialogue;
  
    useEffect(() => {
        const fetchedList = lists.find(list => list.listId === (listId))
        setShoppingItems(fetchedList)
        console.log(fetchedList)
    
      }, [listId])
    
    
    function generateId() {
      return nanoid()
    }
    function updateLists(updatedLists){
      lists.splice(0, lists.length, ...updatedLists);
    }
  
    function deleteItem(id) {
      let updatedItems = shoppingItems.items.filter(item => item.itemId !== id)
      setShoppingItems(prevValue => ({ ...prevValue, items: updatedItems }))

      ///
      const updatedLists = lists.map(list =>
        list.listId ===(listId) ? { ...list, items: updatedItems } : list)
        updateLists(updatedLists)
    }
  
    function showModal() {
      popupDialogue = document.querySelector('.popupDialogue')
      popupDialogue.show()
      document.querySelector('.disableWhileModalWindow').classList.add('disabled')
    }
  
    function handleInputChange(event) {
      setNewItemText(event.target.value);
    }

    
    function addItem() {
      if (newItemText) {
        const newItem = {
          "itemId": generateId(),
          "content": newItemText,
          "isDone": false,
          "isShown": true
        };
        setShoppingItems(prevValue => ({ ...prevValue, items: [...prevValue.items, newItem] }))
        closeModaWindow()
        ///
        const updatedLists = lists.map(list =>
            list.listId === (listId) ? { ...list, items: [...list.items, newItem] } : list
          )
          updateLists(updatedLists)
      }
      else setPromptText("Please write something!")
    }
  



    function showOrHideItems(type) {
      const updatedItems = shoppingItems.items.map(item => ({
        ...item,
        isShown: (type === "resolved" && item.isDone === true)
          || (type === "unresolved" && item.isDone === false)
          || (type === "all" ? true : false)
      }));
      const updatedList = { ...shoppingItems, items: updatedItems }
      setShoppingItems(updatedList)
    }
  



    function updateIsResolved(id) {
      const updatedItems = shoppingItems.items.map(item => (item.itemId === id ? { ...item, isDone: !item.isDone } : { ...item }))
      const updatedList = { ...shoppingItems, items: updatedItems }
      setShoppingItems(updatedList)
      ///
      const updatedLists = lists.map(list =>
        list.listId === (listId) ? { ...list, items: updatedItems } : list)
        updateLists(updatedLists)

    }



    function closeModaWindow(){
        setPromptText("")
        popupDialogue = document.querySelector('.popupDialogue');
        popupDialogueInput = document.querySelector('.popupDialogueInput');
        popupDialogue.close();
        document.querySelector('.disableWhileModalWindow').classList.remove('disabled');
        setNewItemText('');
        popupDialogueInput.value = '';
    }

  
    return (
      <div className='listMenu'>
        <ModalWindow
          addButton={<AddButton
            addHandler={addItem}
            title="Add New Item"
          />}
          promptText = {promptText}
          closeWindow={()=>closeModaWindow()}
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
          { shoppingItems?.items.length === 0 ? (
          <div style={{ textAlign: 'center'}}>You don't have any items yet</div>
        ): (
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
    );
}
