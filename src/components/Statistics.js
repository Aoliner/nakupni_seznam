import React from 'react'
import { useTranslation } from "react-i18next";

export default function Statistics({ toggleStatistics }) {
    const { t } = useTranslation(["list"])
    return (
        <div className='statistics button icon'
            title={t('Show/Hide Statistics')}
            onClick={() => { toggleStatistics() }}
        ></div>
    )
}
