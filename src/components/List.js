import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function List({ listName, isShown, isArchived, listId, unarchive, tileView }) {
  const [lists, setLists] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const isUserOwner = userInfo?.UserId === lists?.find(list => list.listId === listId)?.users.owner.UserId
  return (
    <>
      {isShown && (
        <div className={tileView ? 'list titleStyleList' : "list"}>
          <Link className={`button listName ${isArchived ? 'disabled' : ""}`} to={`/list/${listId}`} >
            <div >{listName}</div></Link>
          {!isArchived ? (
            <Link to={`/list/settings/${listId}`}>
              <div title="Settings" className='listSettings button'></div>
            </Link>
          ) : (
            isUserOwner && (
              <div
                title="Unarchive List"
                onClick={() => {
                  unarchive(listId);
                }}
                className='listArchived button'
              ></div>
            )
          )}
        </div>
      )}
    </>
  );
}