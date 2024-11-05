import * as React from 'react'
import { useTranslation } from "react-i18next"

interface FileLoaderProps {
    onFileLoaded: Function
}

function  FileLoader({ onFileLoaded }: FileLoaderProps) {
    const { t } = useTranslation('gpxRouteMap')
    const fileSelectRef = React.useRef(null)
    const fileElemRef = React.useRef(null)

    React.useEffect(() => {
        fileSelectRef.current && (fileSelectRef.current as HTMLButtonElement).addEventListener('click', () => {
            fileElemRef.current && (fileElemRef.current as HTMLButtonElement  as HTMLButtonElement).click();
        }, false);

        fileElemRef.current && (fileElemRef.current as HTMLInputElement).addEventListener('change', (e: Event) => {
            const file = (e?.target as HTMLInputElement).files?.[0]
            const fr = new FileReader()

            fr.onload = () => {
              onFileLoaded(fr.result?.toString() || '')
            }
            file && fr.readAsText(file)
        })
    }, [])

    return <>
        <input ref={fileElemRef} title="inputFile" type="file" id="fileElem" multiple accept=".gpx" style={{ display: 'none' }} />
        <button ref={fileSelectRef} title="buttonInputFile"  id="fileSelect" type="button">{t('gpxupload')}</button>
    </>
}

export default FileLoader