import { useEffect } from 'react'
import { baseURL } from '../App'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { getAllDaily } from '../redux/dailyStockSlice'
import { getOrders } from '../redux/saleOrderSlice'
import { onLoaded } from '../redux/liveSlice'

import {
  getCommentsGraphAPI,
  getLiveVideos,
  getPSID,
  sendMessageToPSID,
} from '../services/fb'

//TODO: Main Component
const GetComments = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user) // Long-lived user access token
  const liveVideoId = localStorage.getItem('liveVideoId')

  // let liveVideoId = ''
  useEffect(() => {
    const fetchLiveVideos = async () => {
      let liveVdo = await getLiveVideos(user.userAccessToken)
      console.log('Live Video: ', liveVdo)

      if (liveVdo && liveVdo.status == 'LIVE') {
        let embed_html = liveVdo.embed_html
        let videoIdMatch = embed_html.match(/videos%2F(\d+)/)

        if (videoIdMatch) {
          let videoId = videoIdMatch[1]
          liveVideoId = videoId
          toast.success(`Title: ${liveVdo.title}, Video ID: ${videoId}`)
        } else {
          toast.error('ไม่พบ video ID ใน embed_html')
        }
      } else {
        toast.warning('กรุณาเปิดการถ่ายทอดสดที่ Facebook')
      }
    }

    fetchLiveVideos()
  }, [])

  useEffect(() => {
    let firstRound = true
    let tempComment = []

    const realTime = setInterval(async () => {
      try {
        const newComment = await getCommentsGraphAPI(
          liveVideoId,
          user.userAccessToken
        )
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
        toast.warning('ID ไลฟ์สด Facebook ไม่ถูกต้อง')

        toast('ปิด : ระบบดูด comments')
        dispatch(onLoaded())
        localStorage.removeItem('liveVideoId')
        clearInterval(realTime) // Stop the interval on error
      }
    }, 5000) // milliseconds

    return () => clearInterval(realTime)
  }, [])

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
      const vendorId = localStorage.getItem('vendorId')
      let commentFb = comment.message.trim().toLowerCase() // นำ message ที่มาช่องว่างมา trim แล้วเปลี่ยนเป็น lowercase กรณีเจออักษรพิมพ์ใหญ่
      let idFb = comment.from.id
      let nameFb = comment.from.name

      // check Confirm (cf)
      if (commentFb && commentFb.includes('=')) {
        let parts = commentFb.split('=') // split "t2=5" into an array["t2", "5"]
        let code = parts[0] // รหัสสินค้า
        let quantity = parseInt(parts[1]) // จำนวนสินค้า

        //? อ่านข้อมูล "รายการขายสินค้ารายวัน" โดยอ่านข้อมูลเฉพาะสถานะ "new" ของวันล่าสุด
        let response = await fetch(`${baseURL}/api/daily/new-status`)
        let data = await response.json()
        let dailyStock = data

        dailyStock.products.forEach((p) => {
          if (code === p.code.toLowerCase()) {
            toast(`คุณ ${nameFb} สั่งซื้อ ${p.name} จำนวนที่สั่ง ${quantity}`)

            if (quantity <= p.remaining_cf) {
              // จำนวนสินค้าที่สั่งเข้ามา น้อยกว่า สินค้าคงเหลือ
              p.cf = p.cf + quantity
              p.remaining_cf = p.remaining_cf - quantity
            }
            // จำนวนสินค้าที่สั่งเข้ามา มากกว่า สินค้าคงเหลือ จะสั่งได้ แต่ต้องไม่เกิน limit ที่กำหนดเอาไว้
            else if (quantity > p.remaining_cf && p.limit > 0) {
              let newRemainingCf = p.remaining_cf - quantity

              // ถ้า (สินค้าคงเหลือ - จำนวนลูกค้าสั่งมาลบ) >= -(limit + สินค้าคงเหลือ) สมมุติ : 10 >= -(10 + 10)
              if (newRemainingCf >= -(p.limit + p.stock_quantity)) {
                p.cf = p.cf + quantity
                p.remaining_cf = p.remaining_cf - quantity
              }
            }

            // จัดรูปข้อมูลสำหรับการส่ง API
            let orderData = {
              idFb: idFb,
              nameFb: nameFb,
              orders: [
                {
                  id: p._id,
                  name: p.name,
                  quantity: quantity,
                  price: p.price,
                },
              ],
              vendorId: vendorId || '65feb6291f7e46ed630b4e20',
              date_added: new Date().toISOString(),
            }
            // สร้างรายการออเดอร์ และเรียก getOrders เพื่ออัปเดต Redux state
            fetch(`${baseURL}/api/sale-order`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderData),
            })
              .then((resp) => dispatch(getOrders()))
              .catch((err) => console.log(err))

            //! PSID ยังใช้งานจริงไม่ได้อยู่ในระหว่างรอการพัฒนา...
            // const psid = await getPSID(idFb, pageAccessToken) // ใช้ userAccessToken สำหรับ getPSID
            // if (psid) {
            //   await sendMessageToPSID(
            //     psid,
            //     `นี่คือลิงก์ออเดอร์ของคุณ: https://weliveapp.netlify.app/order/${data._id}`,
            //     pageAccessToken // ใช้ pageAccessToken สำหรับการส่งข้อความ
            //   )
            // }
          }
        })

        //? อัปเดต dailyStock ในฐานข้อมูล และเรียก getAllDaily เพื่ออัปเดต Redux state
        fetch(`${baseURL}/api/daily/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dailyStock),
        })
          .then((resp) => dispatch(getAllDaily()))
          .catch((err) => toast.warning('อัปเดตรายการสินค้าไม่สำเร็จ'))
      }

      //TODO: Check Cancel - ลูกค้าคอมเม้นท์ "cc" หรือ "CC" ยกเลิกออเดอร์
      if (commentFb && commentFb.startsWith('CC')) {
        let parts = commentFb.split(' ') // split "CC" into an array ["cc"]
        console.log('Have message "cc or CC" :', commentFb)

        let orderData = {
          idFb: idFb,
          isPayment: false,
          isDelete: true,
        }

        fetch(`${baseURL}/api/sale-order/cc`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        })
          .then((resp) => dispatch(getOrders()))
          .catch((err) => console.log(err))
      }
    } catch (e) {
      console.log('checked message code error :', e)
    }
  }
}

export default GetComments
