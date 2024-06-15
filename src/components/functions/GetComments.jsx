import { useEffect } from 'react'
import axios from 'axios'
import { baseURL } from '../../App'
import { useContext } from 'react'
import { firstLoadContext } from '../../routes/AdminRoute'
import { toast } from 'react-toastify'

//! ต้องมีสิทธ์การอนุญาต publish_video
// ฟังก์ชัน เปิด Live Video บน User
function openLiveVideo() {
  return axios
    .post('https://graph.facebook.com/v20.0/me/live_video', {
      params: {
        status: 'LIVE_NOW',
        title: "Today's Live Video",
        description: 'This is the live video for today',
        access_token: import.meta.env.VITE_ACCESS_TOKEN,
      },
    })
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err))
}

// (1) Comments from Graph API
async function getCommentsGraphAPI(liveVideoId) {
  const url = `https://graph.facebook.com/v19.0/${liveVideoId}/comments`
  const params = {
    access_token: import.meta.env.VITE_ACCESS_TOKEN,
  }
  try {
    const response = await axios(url, { params })
    // console.log(response.data.data)
    return response.data.data
  } catch (err) {
    throw new Error('Error fetching comments from Graph API') // Throw the error to stop further execution
  }
}

// (2) ฟังก์ชันอ่านเฉพาะ comment ใหม่
/*
  วนลูป newComment แต่ละแถว แล้วตรวจสอบ oldComment มันมี
  id ตรงกับ id ของ newComment ของแถวนี้ไหม
  ถ้ามี id: '514878379814006_514885169813327' มันจะไม่ 'undefined'
  ถ้ามี 'undefined' คือไม่มี ก็คือ newComment ใหม่
*/
function latestComment(oldComment, newComment) {
  return new Promise((resolve) => {
    newComment.forEach((comment) => {
      if (oldComment.find((cm) => cm.id === comment.id) === undefined) {
        console.log('New comment :', comment)
        // function check message code
        checkMessageCode(comment)
      }
    })
    resolve(newComment)
  })
}

// (3) Check Message Code
async function checkMessageCode(comment) {
  try {
    let thisComment = comment.message.trim().toLowerCase() // นำ message ที่มาช่องว่างมา trim แล้วเปลี่ยนเป็น lowercase กรณีเจออักษรพิมพ์ใหญ่

    if (thisComment && thisComment.includes('=')) {
      let parts = thisComment.split('=') // split "t1=5" into an array["t1", "5"]

      console.log('Have message code :', parts) // ข้อความทั้งหมดที่อยู่ใน parts
      let code = parts[0] // รหัสสินค้า
      let quantity = parseInt(parts[1]) // จำนวนสินค้า

      let dailyStock = await axios.get(`${baseURL}/api/daily/new-status`)

      dailyStock.data.products.forEach((p) => {
        if (code === p.code.toLowerCase()) {
          console.log('ชื่อสินค้า :', p.name)
          console.log('จำนวนที่สั่ง :', quantity)
          p.cf = p.cf + quantity
          p.remaining_cf = p.remaining_cf - p.cf
        }
      })

      // อัปเดต dailyStock ในฐานข้อมูล
      await axios
        .put(`${baseURL}/api/daily/update`, dailyStock.data)
        .then((resp) => console.log('Document daily stock updated'))
        .catch((err) => console.log(err))
    }

    // if (thisComment && thisComment.startsWith('CF')) {
    //   let parts = thisComment.split(' ') // split "cf a2=2" into an array ["cf","a2=2"]
    //   console.log('Have message "CF" :', parts)
    // }

    // if (thisComment && thisComment.startsWith('CC')) {
    //   let parts = thisComment.split(' ')
    //   console.log('Have message "CC" :', thisComment)
    // }
  } catch (e) {
    console.log('checked message code error :', e)
  }
}

// Main Component
const GetComments = () => {
  let [firstLoad, setFirstLoad] = useContext(firstLoadContext)
  useEffect(() => {
    let firstRound = true
    let tempComment = []
    let liveVideoId = localStorage.getItem('liveVideoId')

    const realTime = setInterval(async () => {
      try {
        const newComment = await getCommentsGraphAPI(liveVideoId)
        if (firstRound) {
          console.log('Initial comments', newComment)
          tempComment = newComment
          tempComment.map((cm, index) => checkMessageCode(cm))
          firstRound = false
        } else {
          //TODO: New comments
          tempComment = await latestComment(tempComment, newComment)
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล comments:', error)
        toast.warning('ID ไลฟ์สด Facebook ไม่ถูกต้อง')

        console.log('ปิด : ระบบดูด comments')
        toast('ปิด : ระบบดูด comments')
        setFirstLoad(false)
        localStorage.removeItem('liveVideoId')
        clearInterval(realTime) // Stop the interval on error
      }
    }, 5000) // milliseconds

    return () => clearInterval(realTime)
  }, [])
}

export default GetComments
