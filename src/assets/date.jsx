import { useState, useEffect } from 'react'
import moment from 'moment'

function MyComponent() {
  const [currentDate, setCurrentDate] = useState(moment())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(moment())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div>
      <h5 className=" text-primary">
        วันที่และเวลาปัจจุบัน: {currentDate.format('YYYY-MM-DD HH:mm:ss')}
      </h5>
    </div>
  )
}

export default MyComponent
