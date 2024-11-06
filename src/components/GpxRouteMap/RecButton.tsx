import * as React from 'react'

import '../../css/RecButton.scss'

interface GpxRecorderProps {
    onStartStopRecord: React.MouseEventHandler<HTMLButtonElement>
    recordState: boolean
}

function RecButton({ onStartStopRecord, recordState}: GpxRecorderProps) {
    return <button id="recButton" className={`recButton ${recordState ? 'Rec' : 'notRec'}`} onClick={onStartStopRecord} />
}

export default RecButton