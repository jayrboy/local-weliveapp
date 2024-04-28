import { useEffect } from 'react'
import axios from 'axios'
import { baseURL } from '../../App'

//TODO: Comments from Graph API
export async function getCommentsGraphAPI() {
  const liveVideoId = import.meta.env.VITE_LIVE_VIDEO_ID
  const url = `https://graph.facebook.com/v19.0/${liveVideoId}/comments`
  const params = {
    access_token: import.meta.env.VITE_ACCESS_TOKEN,
  }
  try {
    const response = await axios(url, { params })
    // console.log(response.data.data)
    return response.data.data
  } catch (err) {
    console.log(err)
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
    newComment.map((comment) => {
      if (oldComment.find((cm) => cm.id === comment.id) === undefined) {
        console.log('New comment :', comment)
        // function check message code
        checkMessageCode(comment)
      }
    })
    resolve(newComment)
  })
}

//TODO: Check Message Code
function checkMessageCode(comment) {
  let thisComment = comment.message

  if (thisComment && thisComment.includes('=')) {
    let parts = thisComment.split('=') // ตัดข้อความก่อนและหลังเครื่องหมาย =
    console.log('Have message code :', parts) // ข้อความทั้งหมดที่อยู่ใน parts

    axios(`${baseURL}/api/daily/new-status`)
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

//TODO: Main Component
const GetComments = () => {
  useEffect(() => {
    let firstLoad = true
    let comments = []

    const realTime = setInterval(async () => {
      try {
        let newComment = await getCommentsGraphAPI()
        if (firstLoad) {
          console.log('Initial comments', newComment)
          comments = newComment
          firstLoad = false
        } else {
          //TODO: New comments
          comments = await latestComment(comments, newComment)
          checkMessageCode(comments)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }, 5000)

    return () => clearInterval(realTime)
  }, [])
}

export default GetComments
