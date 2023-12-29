import React from 'react'

export default function Item({ isResolved, deleteButton, id, content, isShown, updateIsResolved }) {
  return (<>
    {isShown && <div className="listMenuItem">
      <div id={`${id}`} className='item listStyle'>{content}</div>
      <div className='itemOptions'>
      <input className='isResolvedBox' type="checkbox" onClick={() => { updateIsResolved(id) }} defaultChecked={isResolved} />
      {deleteButton}</div>

    </div>}
  </>
  )
}
