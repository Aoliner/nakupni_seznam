import React from 'react'

export default function ChangeLanguage({ changeThemeTiles ,changeThemeList}) {
  return (
    <div className="dropdown">
    <div className='changeLanguageButton button icon' ></div>
    <div className="dropdown-content">
    <p onClick={()=>{ changeThemeList() }}>List</p>
    <p onClick={()=>{ changeThemeTiles() }} >Tiles</p>
    </div>
  </div>
  )
}
