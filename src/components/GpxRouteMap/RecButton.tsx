import * as React from 'react'
import { useTranslation } from 'react-i18next'

import '../../css/RecButton.scss'

interface GpxRecorderProps {
    value: number
    onStartStopRecord: React.MouseEventHandler<HTMLButtonElement>
    recordState: boolean
    onPollingTimeChange: Function
}

function RecButton({ value, onStartStopRecord, recordState, onPollingTimeChange}: GpxRecorderProps) {
    const { t } = useTranslation('gpxRouteMap')
    const readOnlyStatus = recordState && { disabled: true }

    function onValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number((e.target as HTMLInputElement).value)

        onPollingTimeChange(value)
    }

    return <div className="recContainer">
        <button id="recButton" className={`recButton ${recordState ? 'Rec' : 'notRec'}`} onClick={onStartStopRecord} />
        <span className='marginAuto'>{ t('pollingTime') }</span>
        <input className='marginAuto' type="number" min="14" max="120" {...readOnlyStatus} value={value} onChange={onValueChange} />
        <span className='marginAuto'>secs</span>
    </div>
}

export default RecButton