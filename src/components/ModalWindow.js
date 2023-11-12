import React from 'react'

export default function ModalWindow({addButton, inputValue,handleInputChange,textForPlaceHolder,closeWindow,promptText}) {
  return (
    <div>
        <dialog className='popupDialogue' >
           <div className="deleteButton button closeButton"onClick={closeWindow}></div>
           <div className='promptText'>{promptText}</div>
            <input 
            type="text"
            placeholder={textForPlaceHolder}
            className='popupDialogueInput'
            onChange={handleInputChange}
            defaultValue={inputValue}/>
                <form method="dialog">
                {addButton}
                </form>
        </dialog>
  </div>
  )
}
