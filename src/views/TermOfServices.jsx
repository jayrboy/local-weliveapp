import React, { useState } from 'react'

const TermOfServices = () => {
  const [isThai, setIsThai] = useState(false)

  const toggleLanguage = () => {
    setIsThai((prevIsThai) => !prevIsThai)
  }

  return (
    <div className="container mt-3">
      <h5>
        {isThai ? (
          <strong>ข้อกำหนดการให้บริการ</strong>
        ) : (
          <strong>Terms of Service</strong>
        )}
      </h5>
      <div className="text-end">
        <button className="btn btn-sm btn-light mb-3" onClick={toggleLanguage}>
          {!isThai ? 'TH' : 'EN'}
        </button>
      </div>
      <div>
        {isThai ? (
          <div>
            <p>
              ยินดีต้อนรับสู่แอปพลิเคชันของเรา
              โปรดอ่านข้อกำหนดการให้บริการเหล่านี้อย่างละเอียด
              เมื่อคุณใช้บริการของเรา
              คุณตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขเหล่านี้
            </p>
            <h6>1. การใช้งานบริการ</h6>
            <p>
              คุณตกลงที่จะใช้บริการของเราเพื่อวัตถุประสงค์ที่ถูกกฎหมายและตามข้อกำหนดที่เรากำหนด
              ห้ามใช้บริการของเราเพื่อการกระทำที่ผิดกฎหมายหรือไม่ได้รับอนุญาต
            </p>
            <h6>2. ข้อจำกัดความรับผิด</h6>
            <p>
              เราไม่รับผิดชอบต่อความเสียหายที่เกิดขึ้นจากการใช้บริการของเรา
              การใช้บริการของเราเป็นความเสี่ยงของคุณเอง
            </p>
            {/* เพิ่มข้อกำหนดเพิ่มเติมที่นี่ */}
          </div>
        ) : (
          <div>
            <p>
              Welcome to our application. Please read these terms of service
              carefully. By using our services, you agree to comply with these
              terms and conditions.
            </p>
            <h6>1. Use of Services</h6>
            <p>
              You agree to use our services for lawful purposes and in
              accordance with the terms we provide. You are prohibited from
              using our services for any unlawful or unauthorized purpose.
            </p>
            <h6>2. Limitation of Liability</h6>
            <p>
              We are not responsible for any damages resulting from the use of
              our services. Your use of our services is at your own risk.
            </p>
            {/* Add more terms here */}
          </div>
        )}
      </div>
    </div>
  )
}

export default TermOfServices
