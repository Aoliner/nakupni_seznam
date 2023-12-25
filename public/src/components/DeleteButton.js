import React from 'react'

export default function DeleteButton({deleteHandler,id,title}) {
  return (
    <div className="deleteButton button" title={title} onClick={()=>{ deleteHandler(id) }}></div>
  )
}
