import React from 'react'
import { useTranslation } from "react-i18next";

export default function Filter({showArchivedResolved,showUnarchivedUnresolved,showAll, text1, text2, text3 }) {
  const { t } = useTranslation(["home"]);
  return (
    <div className="dropdown">
    <div className='filterButton button icon'></div>
    <div className="dropdown-content">
    <p onClick={showAll}>{text3}</p>
    <p onClick={showUnarchivedUnresolved}>{t("Show")} {text1}</p>
    <p onClick={showArchivedResolved}>{t("Show")} {text2}</p>
    </div>
  </div>
  )
}
