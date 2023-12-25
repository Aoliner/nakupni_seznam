import React from 'react'

export default function ModalYesNo({closeWindow,promptText, cancel, confrim}) {
  return (
    <div>        
    <dialog className='dialogueYesNo' >
    <div className="deleteButton button closeButton"onClick={closeWindow}></div>
    <div className='promptText'>Are you sure you want to {promptText} this list?</div>
    <div className=' button centerText' onClick={()=>{ confrim() }} >Yes</div>
    <div className=' button centerText'   onClick={()=>{ cancel() }} >No</div>
    </dialog>
    </div>
  )
}
