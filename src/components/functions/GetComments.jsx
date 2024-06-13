import { useEffect } from 'react'
import axios from 'axios'
import { baseURL } from '../../App'
import { useContext } from 'react'
import { firstLoadContext } from '../../routes/AdminRoute'
import { toast } from 'react-toastify'

//! ต้องมีสิทธ์การอนุญาต publish_video
//ฟังก์ชัน เปิด Live Video บน User
export async function openLiveVideo() {
  return await axios
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

//TODO: Comments from Graph API
export async function getCommentsGraphAPI(liveVideoId) {
  // const liveVideoId = import.meta.env.VITE_LIVE_VIDEO_ID // v1
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

//TODO: ฟังก์ชันอ่านเฉพาะ comment ใหม่
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

// Check Message Code
function checkMessageCode(comment) {
  let thisComment = comment.message

  if (thisComment && thisComment.includes('=')) {
    let parts = thisComment.split('=') // ตัดข้อความก่อนและหลังเครื่องหมาย =
    console.log('Have message code :', parts) // ข้อความทั้งหมดที่อยู่ใน parts

    return axios(`${baseURL}/api/daily/new-status`)
      .then((result) => {
        result.data.products.map((p) => {
          if (parts[0].toLowerCase() == p.code.toLowerCase()) {
            console.log('Facebook :', comment.from.name)
            console.log('Sale Order :', p.name)
            console.log('ราคา :', p.price)
            console.log('จำนวน :', parts[1])
            console.log('ยอดรวม :', p.price * parts[1])
          }
        })
      })
      .catch(() => console.log('check message code error :', err))
  }
}

// Main Component
const GetComments = () => {
  let [firstLoad, setFirstLoad] = useContext(firstLoadContext)
  useEffect(() => {
    let firstRound = true
    let comments = []
    const liveVideoId = localStorage.getItem('liveVideoId')

    const realTime = setInterval(async () => {
      try {
        const newComment = await getCommentsGraphAPI(liveVideoId)
        if (firstRound) {
          console.log('Initial comments', newComment)
          comments = newComment
          firstRound = false
        } else {
          //TODO: New comments
          comments = await latestComment(comments, newComment)
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
