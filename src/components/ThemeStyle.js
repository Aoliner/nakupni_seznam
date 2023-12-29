import React from 'react'
import { useTranslation } from "react-i18next";

export default function ThemeStyle({ changeThemeTiles ,changeThemeList}) {
  const {  t } = useTranslation(["home"]);
  return (
    <div className="dropdown">
    <div className='themeStyleButton button icon'></div>
    <div className="dropdown-content">
    <p onClick={()=>{ changeThemeList() }}>{t("List")}</p>
    <p onClick={()=>{ changeThemeTiles() }} >{t("Tiles")}</p>
    </div>
  </div>
  )
}
