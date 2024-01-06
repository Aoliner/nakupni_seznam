import React from 'react'

export default function ThemeStyle({ changeThemeTiles ,changeThemeList}) {
  return (
    <div className="dropdown">
    <div className='themeStyleButton button'></div>
    <div className="dropdown-content">
    <p onClick={()=>{ changeThemeList() }}>List</p>
    <p onClick={()=>{ changeThemeTiles() }} >Tiles</p>
    </div>
  </div>
  )
}
