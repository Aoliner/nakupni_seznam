
function handleResponse(response) {
  if (response.ok) {
    return response.json()
      .then((responseJson) => {
        return responseJson
      })
  }
  throw new Error('Something went wrong')
}


export function getListById(listId) {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`
  return fetch(url)
    .then(handleResponse)
}

export function getUserInfo() {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/userInfo/54535435`
  return fetch(url)
    .then(handleResponse)
}



export function unarchiveList(data, listId) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }
  console.log(requestOptions)
  fetch(`https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`, requestOptions)
    .then(handleResponse)
}



export function addNewList(data) {
  return fetch('https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(handleResponse)
}

export function changeListName(listId, newListName) {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`



  return getUserInfo()
    .then((userInfo) => {
      const updatedUserLists = userInfo.userLists.map((userList) =>
        userList.listId === listId ? { ...userList, listName: newListName } : userList
      )
      const updatedUserInfo = { ...userInfo, userLists: updatedUserLists }

      const userInfoUrl = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/userInfo/${userInfo.UserId}`

      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserInfo),
      }
      return fetch(userInfoUrl, requestOptions)
        .then(handleResponse)
        .then(() => {
          return fetch(url)
            .then(handleResponse)
            .then((fetchedList) => {
              const updatedList = { ...fetchedList, listName: newListName }
              const listRequestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedList),
              }
              return fetch(url, listRequestOptions)
                .then(handleResponse)
                .then((responseJson) => {
                  return responseJson
                })
            })
        })
    })
}

export function userLeaveList(listId, userInfoData) {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`

  return fetch(url)
    .then(handleResponse)
    .then((fetchedList) => {
      const updatedGuests = fetchedList.users.guests.filter(
        (guest) => guest.UserName !== userInfoData.UserName
      )

      const updatedList = { ...fetchedList, users: { ...fetchedList.users, guests: updatedGuests } }
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      }

      return fetch(url, requestOptions)
        .then(handleResponse)
        .then((responseJson) => {
          return responseJson
        })
    })
}

export function updateUserAfterLeavingList(listId, userInfoData) {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/userInfo/${userInfoData.UserId}`

  return fetch(url)
    .then(handleResponse)
    .then((userInfo) => {
      const updatedUserLists = userInfo.userLists.filter(
        (userList) => userList.listId !== listId
      )

      const updatedUserInfo = {
        ...userInfo,
        userLists: updatedUserLists,
      }
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserInfo),
      }

      return fetch(url, requestOptions)
        .then(handleResponse)
        .then((responseJson) => {
          return responseJson
        })
    })
}


export function deleteListById(listId, userInfoData) {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`

  return fetch(url)
    .then(handleResponse)
    .then(() => {
      const updatedUserLists = userInfoData.userLists.filter(
        (userList) => userList.listId !== listId
      )
      const updatedUserInfo = {
        ...userInfoData,
        userLists: updatedUserLists,
      }

      const userRequestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserInfo),
      }

      return Promise.all([
        fetch(url, { method: 'DELETE' }),
        fetch(`https://6565b8daeb8bb4b70ef23961.mockapi.io/api/userInfo/${userInfoData.UserId}`, userRequestOptions),
      ])
      .then(([listResponse, userResponse]) => {
        if (listResponse.ok && userResponse.ok) {
          return listResponse.json()
        } else {
          throw new Error('Error deleting list or updating user information.')
        }
      })
    })
}

export function archiveListById(listId) {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`

  return fetch(url)
    .then(handleResponse)
    .then((fetchedList) => {
      const updatedList = { ...fetchedList, isArchived: true }
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      }

      return fetch(url, requestOptions)
        .then(handleResponse)
        .then((responseJson) => {
          return responseJson
        })
    })
}

export function updateUserLists(data, userInfoData) {
  const updatedUserLists = [...userInfoData.userLists, data]
  return {
    ...userInfoData,
    userLists: updatedUserLists,
  }
}

export function updateUserInfo(data) {
  getUserInfo()
    .then((userInfoData) => {
      const updatedUserInfo = updateUserLists(data, userInfoData)
      const updateRequestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUserInfo)
      }

      fetch('https://6565b8daeb8bb4b70ef23961.mockapi.io/api/userInfo/54535435', updateRequestOptions)
        .then(handleResponse)
    })
}

export function deleteItemById(listId, itemId) {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`

  return fetch(url)
    .then(handleResponse)
    .then((fetchedList) => {
      const updatedItems = fetchedList.items.filter(item => item.itemId !== itemId)
      const updatedList = { ...fetchedList, items: updatedItems }
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      }

      return fetch(url, requestOptions)
        .then(handleResponse)
        .then((responseJson) => {
          return responseJson
        })
    })
}


export function addNewItemToList(listId, newItem) {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`
  return fetch(url)
    .then(handleResponse)
    .then((fetchedList) => {
      const updatedItems = [...fetchedList.items, newItem]
      const updatedList = { ...fetchedList, items: updatedItems }
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      }

      return fetch(url, requestOptions)
        .then(handleResponse)
        .then((responseJson) => {
          return responseJson
        })
    })
}

export function toggleItemStatus(listId, itemId) {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`

  return fetch(url)
    .then(handleResponse)
    .then((fetchedList) => {
      const updatedItems = fetchedList.items.map(item =>
        item.itemId === itemId ? { ...item, isDone: !item.isDone } : item
      )

      const updatedList = { ...fetchedList, items: updatedItems }

      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      }

      return fetch(url, requestOptions)
        .then(handleResponse)
        .then((responseJson) => {
          return responseJson
        })
    })
}

export function deleteUserFromList(listId, userId) {
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`

  return fetch(url)
    .then(handleResponse)
    .then((fetchedList) => {
      const updatedGuests = fetchedList.users.guests.filter(guest => guest.UserId !== userId)
      const updatedList = { ...fetchedList, users: { ...fetchedList.users, guests: updatedGuests } }
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      }

      return fetch(url, requestOptions)
        .then(handleResponse)
        .then((responseJson) => {
          return responseJson
        })
    })
}

export function getUsers(){
  const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/users`
  return fetch(url)
  .then(handleResponse)
}

  export function addNewUserToList(listId, userName) {
    return getUsers()
      .then((users) => {
        const existingUser = users.find((user) => user.UserName === userName)
        if (existingUser) {
          const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`
  
          return fetch(url)
            .then(handleResponse)
            .then((fetchedList) => {
              if (
                !fetchedList.users.guests.some(
                  (guest) => guest.UserName === userName
                ) &&
                fetchedList.users.owner.UserName !== userName
              ) {
                const updatedGuests = [...fetchedList.users.guests, existingUser]
                const updatedList = {
                  ...fetchedList,
                  users: { ...fetchedList.users, guests: updatedGuests },
                }
  
                const requestOptions = {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedList),
                }
  
                return fetch(url, requestOptions).then(handleResponse)
              } else {
                throw new Error('User already exists in the list.')
              }
            })
        } else {
          throw new Error('User does not exist.')
        }
      })
  }


  export function isUserListOwner(listId, userId) {
    const url = `https://6565b8daeb8bb4b70ef23961.mockapi.io/api/shoppingListGetOne/${listId}`
  
    return fetch(url)
      .then(handleResponse)
      .then((fetchedList) => {
        return fetchedList.users.owner.UserId === userId
      })
  }
  