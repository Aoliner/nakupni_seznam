import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";


export default function List({ listName, isShown, isArchived, listId, unarchive, tileView }) {
  const [lists, setLists] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const isUserOwner = userInfo?.UserId === lists?.find(list => list.listId === listId)?.users.owner.UserId
  const {  t } = useTranslation(["home"]);
  return (
    <>
      {isShown && (
        <div className={tileView ? 'list tilesStyleList' : "list"}>
          <Link className={`button listName ${isArchived ? 'disabled' : ""}`} to={`/list/${listId}`} >
            <div >{listName}</div></Link>
          {!isArchived ? (
            <Link to={`/list/settings/${listId}`}>
              <div title={t("Settings")} className='listSettings button icon'></div>
            </Link>
          ) : (
            isUserOwner && (
              <div
                title={t("Unarchive List")}
                onClick={() => {
                  unarchive(listId);
                }}
                className='listArchived icon button'
              ></div>
            )
          )}
        </div>
      )}
    </>
  );
}