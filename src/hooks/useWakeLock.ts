import * as React from 'react'

const isWakeLockSupported = () => "wakeLock" in navigator;

function useWakeLock() {
    const [wakeLock, setWakeLock] = React.useState<WakeLockSentinel| null>(null)
    const requestWakeLock = async () => {
      try {
        const lock = await navigator.wakeLock.request('screen')

        lock.addEventListener('release', () => {
          setWakeLock(null)
        });
        setWakeLock(lock)
      } catch (err) {
        console.error(`${(err as Error).name}, ${(err as Error).message}`);
      }
    }

    React.useEffect(() => {
      isWakeLockSupported() && requestWakeLock()
    }, [])
}

export default useWakeLock