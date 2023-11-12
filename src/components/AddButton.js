import React from 'react'

export default function AddButton({addHandler, title}) {
  return (
    <div className='addButton button'  title={title} onClick={()=>{ addHandler() }}></div>
  )
}
