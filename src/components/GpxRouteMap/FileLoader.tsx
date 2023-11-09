import * as React from 'react'
import * as L from 'leaflet'

interface FileLoaderProps {
    onFileLoaded: Function
}

function  FileLoader({ onFileLoaded }: FileLoaderProps) {
    const fileSelect = document.getElementById('fileSelect')
    const fileElem = document.getElementById('fileElem')

    fileSelect?.addEventListener('click', () => {
        fileElem?.click();
    }, false);

    fileElem?.addEventListener('change', (e: Event) => {
        const file = (e?.target as HTMLInputElement).files?.[0]
        const fr = new FileReader()

        fr.onload = () => {
          onFileLoaded(fr.result?.toString() || '')
        }
        file && fr.readAsText(file)
    })

    return <>
        <input type="file"
        id="fileElem"
        multiple
        accept=".gpx"
        style={{
            display: 'none'
        }} />
        <button id="fileSelect" type="button">Select some files</button>
    </>
}

export default FileLoader