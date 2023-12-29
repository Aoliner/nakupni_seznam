import React from 'react'

export default function AddButton({addHandler, title}) {
  return (
    <div className='addButton button icon'  title={title} onClick={()=>{ addHandler() }}></div>
  )
}
