import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DeleteButton from './DeleteButton'
import ModalWindow from './ModalWindow'
import AddButton from './AddButton'
import { useNavigate } from "react-router-dom"
import ModalYesNo from './ModalYesNo'
import { getListById, getUserInfo, deleteUserFromList, addNewUserToList, changeListName, userLeaveList, updateUserAfterLeavingList, deleteListById, archiveListById } from '../ajaxController'

export default function Settings({ listId }) {
    const navigate = useNavigate()
    const [shoppingList, setShoppingList] = useState(null)
    const [newText, setNewText] = useState('')
    const [promptText, setPromptText] = useState("")
    const [userList, setUserList] = useState(null)



    useEffect(() => {
        getUserInfo()
            .then(userInfoData => {
                setUserList(userInfoData)
            })
            .catch(error => {
                console.error('Error fetching user info:', error)
            })
    }, [])

    useEffect(() => {
        getListById(listId)
            .then(fetchedList => {
                setShoppingList(fetchedList)
            })
            .catch(error => {
                console.error('Error fetching list:', error)
            })
    }, [listId])



    function deleteUser(id) {
        deleteUserFromList(listId, id)
            .then((updatedList) => {
                setShoppingList(updatedList)
            })
            .catch(error => {
                console.error('Error deleting user:', error)
            })
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
        addNewUserToList(listId, newText)
            .then((updatedList) => {
                setShoppingList(updatedList)
                closeModal("popupDialogue")
            })
            .catch((error) => {
                setPromptText(error.message)
            })
    }



    function editListName() {
        if (newText) {
            changeListName(listId, newText)
                .then((updatedList) => {
                    setShoppingList(updatedList)
                })
                .catch((error) => {
                    setPromptText(error.message)
                })
            closeModal("dialogChangeName")
        } else {
            setPromptText('Please write something!')
        }

    }


    function closeModal(modalName) {
        setPromptText("")
        setNewText('')
        document.querySelector('.disableWhileModalWindow').classList.remove('disabled')
        const modalNameWindow = document.querySelector(`.${modalName}`)
        const modalNameInput = document.querySelector(`.${modalName}Input`)
        modalNameWindow.close()
        if (modalNameInput != null) {
            modalNameInput.value = ""
        }
    }


    function leaveList() {
        userLeaveList(listId, userList)
            .then(() => {
                updateUserAfterLeavingList(listId, userList)
                    .then(() => {
                        navigate('/')
                    })
                    .catch((error) => {
                        console.error('Error updating user information after leaving the list:', error)
                    })
            })
            .catch((error) => {
                console.error('Error leaving the list:', error)
            })
    }

    function deleteList(listId) {
        deleteListById(listId, userList)
            .then(() => {
                navigate('/')
            })
            .catch((error) => {
                console.error('Error deleting list:', error)
            })
    }
    function archiveList(listId) {

        archiveListById(listId)
            .then((updatedList) => {
                setShoppingList(updatedList)
                navigate('/')
            })
            .catch((error) => {
                console.error('Error archiving list:', error)
            })
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
                promptText="delete"
                cancel={() => closeModal("dialogueYesNo")}
                confrim={() => deleteList(listId)}
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
                                    {userList?.UserName === shoppingList.users.owner.UserName && (
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
                {shoppingList && userList?.UserName === shoppingList.users.owner.UserName ? (
                    <div className='administratorMenu'>
                        <div className='button' onClick={() => showModal("popupDialogue")}>Add User</div>
                        <div className='button' onClick={() => showModal("dialogChangeName")}>Edit Title</div>
                        <div className='button' onClick={() => showModal("dialogueYesNo")}>Delete List</div>
                        <div className='button' onClick={() => archiveList(listId)}> Archive List</div>
                    </div>)
                    : (<div className="leaveButton button" onClick={leaveList}>Leave List</div>)}
            </div>
        </div>
    )
}
