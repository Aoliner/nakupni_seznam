import React from 'react'

export default function Filter({showArchivedResolved,showUnarchivedUnresolved,showAll, text1, text2 }) {
  return (
    <div className="dropdown">
    <div className='filterButton button'></div>
    <div className="dropdown-content">
    <p onClick={showAll}>Show All</p>
    <p onClick={showUnarchivedUnresolved}>Show {text1}</p>
    <p onClick={showArchivedResolved}>Show {text2}</p>
    </div>
  </div>
  )
}
