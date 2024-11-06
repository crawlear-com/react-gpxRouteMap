import * as React from 'react'
import { ERR_WAKELOCK_NOT_AVAILABLE } from '../components/ErrorBox';

const isWakeLockSupported = () => "wakeLock" in navigator;

function useWakeLock(onError: Function): [Function, Function] {
    const [wakeLock, setWakeLock] = React.useState<WakeLockSentinel| null>(null)
    const requestWakeLock = async () => {
      try {
        const lock = await navigator.wakeLock.request('screen')

        lock.addEventListener('release', () => {
          setWakeLock(null)
        });
        setWakeLock(lock)
      } catch (err) {
        onError(ERR_WAKELOCK_NOT_AVAILABLE)
      }
    }

    function releaseWakeLock() {
      wakeLock && wakeLock.release().then(() => setWakeLock(null));
    }

    return [requestWakeLock, releaseWakeLock]
}

export default useWakeLock