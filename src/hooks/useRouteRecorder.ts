import * as React from 'react'

const initialGpxDataString = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?><gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="murbit GPX Tracker"><trk><trkseg>`
const TIMER_FREQUENCY = 60 * 1000

interface useRouteRecorderProps {
    previousGpxData?: string
}

function useRouteRecorder(previousGpxData?: string): [string, React.MouseEventHandler<HTMLButtonElement>] {
    const [timer, setTimer] = React.useState(0)
    const [gpxDataString, setGpxDataString] = React.useState(previousGpxData?.replace('</trkseg></trk></gpx>','') || initialGpxDataString)

    function error() {
      console.log("ERROR!")
    }

    function success(position: GeolocationPosition) {
      setGpxDataString((previousData) => {
        return previousData.concat(`
          <trkpt lon="${position.coords.longitude}" lat="${position.coords.latitude}">
            <ele>${position.coords.altitude ? position.coords.altitude : 0}</ele>
            <time>${position.timestamp}</time>
            <speed>${position.coords.speed ? position.coords.speed : 0 }</speed></trkpt>`)
      })
    }

    function getGeolocationPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      }
    }

    function onStartStopClick() {
      if (timer) {
          window.clearInterval(timer)
          setTimer(0)
      } else {
        getGeolocationPosition()
          const newTimer = window.setInterval(() => {
            getGeolocationPosition()
          }, TIMER_FREQUENCY)
          setTimer(newTimer)
      }
    }

    return [gpxDataString.concat('</trkseg></trk></gpx>'), onStartStopClick]
}

export default useRouteRecorder