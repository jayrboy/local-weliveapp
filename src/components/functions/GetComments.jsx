import { useEffect, useState } from 'react'
import axios from 'axios'
import { baseURL } from '../../App'

async function getLiveVideoID() {
  let liveVideoID
  const url = `http://graph.facebook.com/v19.0/me/live_videos`
  const params = {
    fields: 'status,permalink_url',
    access_token: import.meta.env.VITE_ACCESS_TOKEN,
  }

  const response = await axios(url, { params })
  let liveVideo = response.data.data[0]

  if (liveVideo.status === 'LIVE') {
    let video_url = liveVideo.permalink_url.split('/')
    liveVideoID = video_url[video_url.length - 1]
  }

  return liveVideoID
}

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
    alert(err)
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
        console.log('Got message :', comment.message)
        let thisComment = comment.message

        //เช็คเครื่องหมาย
        if (thisComment.includes('=')) {
          console.log('Have :', thisComment)
          let parts = thisComment.split('=') // ตัดข้อความก่อนและหลังเครื่องหมาย =
          console.log('Text after :', parts) // ข้อความทั้งหมดที่อยู่ใน parts
          console.log('first index :', parts[0]) // ข้อความตัวแรก
          console.log('seconde index :', parts[1]) // ข้อความตัวสอง
          axios(`${baseURL}/api/daily/new-status`)
            .then((result) => {
              result.data.products.map((p) => {
                console.log('this console before x value :', parts[0] == p.code)
                let x = parts[0] == p.code
                console.log('This X value :', x)
                if (x == true) {
                  console.log('We in if true condition\n')
                } else {
                  console.log('We in else condition\n')
                }
              })
            })
            .catch(() => {
              console.log('This Catch\n')
            })
        } else {
          console.log("Don't have :", thisComment)
        }
      }
    })
    resolve(newComment)
  })
}

//TODO: Main
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
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }, 5000)

    return () => clearInterval(realTime)
  }, [])
}

export default GetComments
