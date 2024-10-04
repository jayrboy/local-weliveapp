import React, { useState, useEffect } from 'react'
import moment from 'moment'

import { Typography } from '@mui/material'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

const OrderHeader = (props) => {
  const { id, bankAccount, order } = props

  let [currentTime, setCurrentTime] = useState('')
  let createdAt = order?.createdAt // เวลาที่ได้จาก Redux (createdAt)
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000 // 3 วันในหน่วยมิลลิวินาที

  useEffect(() => {
    if (createdAt) {
      const startDate = moment(createdAt) // แปลง createdAt เป็น moment object

      const intervalId = setInterval(() => {
        const now = moment()
        setCurrentTime(now.format('D MMMM YYYY, h:mm:ss a'))

        //TODO: ตรวจสอบว่าเวลาปัจจุบันเลย 3 วันหรือยัง
        // if (now.diff(startDate) >= threeDaysInMs) {
        //   handleThreeDaysPassed()
        //   clearInterval(intervalId) // หยุดการทำงานเมื่อครบ 3 วัน
        // }
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [createdAt])

  const handleThreeDaysPassed = () => {
    toast.error('ออเดอร์นี้ไม่ชำระเงินภายใน 3 วัน!')
    console.log('ออเดอร์นี้ไม่ชำระเงินภายใน 3 วัน')
    // ใส่ฟังก์ชันที่คุณต้องการเรียกเมื่อครบ 3 วัน
  }

  return (
    <>
      <Typography variant="h4">
        <span className="text-success ms-2 text-center">
          รายการสั่งซื้อของคุณ {order.name}
          {order.complete && (
            <>
              <span className="mt-3 text-success">
                &nbsp;
                <CreditScoreIcon /> ชำระเงินแล้ว
              </span>
              {order.sended && (
                <>
                  <span className="mt-3 text-warning">
                    &nbsp;
                    <LocalShippingIcon /> จัดส่งแล้ว
                  </span>
                </>
              )}
            </>
          )}
        </span>
      </Typography>

      <div className="card shadow">
        <div className="text-center">
          <br />
          <p>
            <code>**</code>โปรดชำระเงินภายใน 3 วัน หรือ 72 ชั่วโมง
            <code>**</code>
            <br />
            เนื่องจากจำนวนออเดอร์ที่สั่งเข้ามามีจำนวนมาก อาจทำให้สินค้าหมด
            สามารถแนปสลิปสั่งซื้อ Pre-Order จะได้สินค้าล่าช้าประมาณ 7 - 14 วัน
          </p>
          <p>{currentTime}</p>
          Order :
          <span className="text-danger">
            <strong>#{id}</strong>
          </span>
          <br />
          {bankAccount &&
            bankAccount.map((b) => (
              <React.Fragment key={b.id}>
                --------------------------------------------
                <br />
                ธนาคาร {b.bank} เลขบัญชี {b.bankID}
                <br />
                ชื่อบัญชี {b.bankName}
                <br />
                <br />
                {b.qrCode ? (
                  <div className="text-center">
                    <img
                      src={b.qrCode}
                      alt="PromptPay"
                      style={{
                        height: '300px', // ความสูงปรับตามสัดส่วน
                        objectFit: 'cover', // ปรับการแสดงผลของรูปภาพ
                      }}
                    />
                  </div>
                ) : (
                  `พร้อมเพย์ ${b.promptPay}`
                )}
                --------------------------------------------
              </React.Fragment>
            ))}
          <br />
          🙏 รบกวนขอความกรุณาลูกค้า 💢 โอนยอดบิลต่อบิลนะคะ
          แล้วค่อยเอฟใหม่ได้คะ💢
          <br /> 💢หากมียอดค้างหักลบยอดเอง โอนได้เลยคะ
          รบกวนแนบรูปยอดค้างไว้ได้เลยคะ ขอบคุณมากค่ะ🙏
          <br /> 🙏 ถ้าสินค้ามีตำหนิกรุณารีบแจ้ง รับเปลี่ยน
          หรือคืนสินค้ามีตำหนิจากร้าน ส่งผิดสีผิดแบบ ผิดไซส์ เท่านั้นคะ
          ขอบพระคุณมากคะ🙏
          <br />
          <br />
        </div>
      </div>
    </>
  )
}
export default OrderHeader
