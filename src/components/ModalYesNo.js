import React from 'react'
import { useTranslation } from "react-i18next";
export default function ModalYesNo({closeWindow,promptText, cancel, confrim}) {
  const { t } = useTranslation(["settings"]);
  return (
    <div>        
    <dialog className='dialogueYesNo' >
    <div className="deleteButton button closeButton"onClick={closeWindow}></div>
    <div className='promptText'>{t("Are you sure you want to")} {promptText} {t("this list?")}</div>
<div className='modalYesNo'>
    <div className=' button centerText modalYes' onClick={()=>{ confrim() }} >{t("Yes")}</div>
    <div className=' button centerText modalNo'   onClick={()=>{ cancel() }} >{t("No")}</div>
    </div>
    </dialog>
    </div>
  )
}
