import React from 'react'
import lists from '../lists'
import { useState, useEffect } from 'react';
import { Link,  } from 'react-router-dom';
import userInfo from '../userInfo';
import DeleteButton from './DeleteButton';
import ModalWindow from './ModalWindow';
import AddButton from './AddButton';
import users from '../users';
import { useNavigate } from "react-router-dom";
import ModalYesNo from './ModalYesNo';

export default function Settings({ listId }) {
    const navigate = useNavigate();

    const [shoppingList, setShoppingList] = useState(null);
    const [newText, setNewText] = useState('');
    const [promptText, setPromptText] = useState("")

    useEffect(() => {
        const fetchedList = lists.find(list => list.listId === (listId));
        setShoppingList(fetchedList);

    }, [listId]);

  function updateLists(updatedLists){
    lists.splice(0, lists.length, ...updatedLists);
  }

    function deleteUser(id) {
        const updatedGuests = shoppingList.users.guests.filter(guest => guest.UserId !== id)
        setShoppingList(prevValue => ({ ...prevValue, users: { ...shoppingList.users, guests: updatedGuests } }))
        ///
        const updatedLists = lists.map(list =>
            list.listId === (listId) ? { ...list, users: { ...list.users, guests: updatedGuests } } : list
          );
          updateLists(updatedLists)
    }

    function showModal(modalName) {
        setNewText('')
        const modalNameWindow = document.querySelector(`.${modalName}`)
        modalNameWindow.show()
        document.querySelector('.disableWhileModalWindow').classList.add('disabled')

    }

    function handleInputChange(event) {
        setNewText(event.target.value)
    }


    function addUser() {
        const existingUser = users.find(user => user.UserName === newText);
        if (existingUser && !shoppingList.users.guests.some(guest => guest.UserName === newText)
            && shoppingList.users.owner.UserName !== newText) {
            const updatedGuests = [...shoppingList.users.guests, existingUser];
            setShoppingList(prevValue => ({ ...prevValue, users: { ...shoppingList.users, guests: updatedGuests } }))
            closeModal("popupDialogue")
            ///
            const updatedLists = lists.map(list =>
                list.listId === (listId) ? { ...list, users: { ...list.users, guests: updatedGuests } } : list
              )
              updateLists(updatedLists)
        }
        else {
            setPromptText("User doesn't exist or is in list")
        }
    }



    function editListName() {
        if (newText) {
            setShoppingList(prevValue => ({ ...prevValue, listName:newText }))
            closeModal("dialogChangeName")
            ///
            const updatedLists = lists.map(list =>
                list.listId === (listId) ? { ...list, listName: newText } : list
            )
            updateLists(updatedLists)
        }
        else setPromptText("Please write something!")

    }



    function closeModal(modalName) {
        setPromptText("")
        setNewText('');
        document.querySelector('.disableWhileModalWindow').classList.remove('disabled');
        const modalNameWindow = document.querySelector(`.${modalName}`)
        const modalNameInput = document.querySelector(`.${modalName}Input`)
        modalNameWindow.close()
        if(modalNameInput != null){
        modalNameInput.value = ""}
    }


    function leaveList() {
        const updatedUserLists = userInfo.userLists.filter(
            userList => userList.listId !== (listId)
          );
          userInfo.userLists = updatedUserLists
      

        setShoppingList((prevValue) => ({
            ...prevValue,
            users: {
              ...prevValue.users,
              guests: prevValue.users.guests.filter((guest) => guest.UserName !== userInfo.UserName)
            }
          }));
          navigate("/")
    }

    function deleteList(listId){
        const updatedUserLists = userInfo.userLists.filter(
            userList => userList.listId !== (listId)
        );
        userInfo.userLists = updatedUserLists;
    
        const updatedLists = lists.filter(
            list => list.listId !== (listId)
        );
        updateLists(updatedLists)
        console.log(lists)
    
        navigate("/");

    }
    function archiveList(listId){
        
        setShoppingList((prevValue) => ({
            ...prevValue,
            isArchived: true
          }));
        ///
          const updatedLists = lists.map(list =>
          list.listId === (listId) ? { ...list, isArchived: true } : list)
          updateLists(updatedLists)

        navigate("/")
    }     
    return (
        <div>
            <ModalWindow
                addButton={<AddButton
                    addHandler={addUser}
                    title="Add New User"

                />}
                promptText={promptText}
                closeWindow={() => closeModal("popupDialogue")}
                textForPlaceHolder="type user's name here..."
                handleInputChange={handleInputChange}
                inputValue={newText}
            />
            <ModalYesNo
               closeWindow={() => closeModal("dialogueYesNo")}
                promptText ="delete"
                cancel={() => closeModal("dialogueYesNo")}
                confrim ={()=>deleteList(listId)}
                />


            <dialog className='dialogChangeName' >
                <div className="deleteButton button closeButton" onClick={() => closeModal("dialogChangeName")}></div>
                <div className='promptText'>{promptText}</div>
                <input
                    type="text"
                    placeholder="type new name here..."
                    className='dialogChangeNameInput'
                    onChange={handleInputChange}
                    value={newText} />
                <form method="dialog">
                    <div className='editListNameButton button' onClick={editListName}>change</div>  
                </form>
            </dialog>

            <div className='disableWhileModalWindow'>
                <div className="listMenuHeader">
                    <Link to="/"><div className="listMenuBackButton button" title="To Lists" ></div></Link>
                    <div className='listMenuListName'>{shoppingList?.listName}</div></div>
                <div className='listOfUsers'><div className='listOfUsersTitle'>List of users:</div>
                    {shoppingList && (
                        <>
                            <div className='administratorUser'>
                                <div >{shoppingList.users.owner.UserName}</div><div className='administatorBadge' title="Administrator"></div></div>
                            {shoppingList.users.guests.map(guest => (
                                <div className='userSettingsDelete' key={guest.UserId}>
                                    {guest.UserName}
                                    {userInfo.UserName === shoppingList.users.owner.UserName && (
                                        <DeleteButton
                                            deleteHandler={deleteUser}
                                            id={guest.UserId}
                                            title={'Delete User'}
                                        />
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
                {shoppingList && userInfo.UserName === shoppingList.users.owner.UserName ? (
                    <div className='administratorMenu'>
                        <div className='button' onClick={() => showModal("popupDialogue")}>Add User</div>
                        <div className='button' onClick={() => showModal("dialogChangeName")}>Edit Title</div>
                        <div className='button' onClick={() => showModal("dialogueYesNo")}>Delete List</div>
                        <div className='button' onClick={() => archiveList(listId)}> Archive List</div>
                    </div>)
                    : (<div  className="leaveButton button" onClick={leaveList}>Leave List</div>)}
            </div>
        </div>
    )
}
