import React, { useState } from 'react'

const Policy = () => {
  let [isThai, setIsThai] = useState(false)
  console.log(isThai)

  const toggleLanguage = () => {
    setIsThai((prevIsThai) => !prevIsThai)
  }

  return (
    <div className="container mt-3">
      <h5>{isThai ? <strong>นโยบาย</strong> : <strong>Policy</strong>}</h5>
      <div className="text-end">
        <button className="btn btn-sm btn-light mb-3" onClick={toggleLanguage}>
          {!isThai ? 'TH' : 'EN'}
        </button>
      </div>
      {isThai ? (
        <div>
          <p>
            ยินดีต้อนรับสู่แอปพลิเคชันของเรา
            กรุณาอ่านนโยบายของเราอย่างละเอียดเพื่อเข้าใจถึงวิธีการที่เรารวบรวม
            ใช้ และจัดการข้อมูลส่วนบุคคลของคุณ
            การใช้งานบริการของเราถือว่าคุณยอมรับเงื่อนไขดังต่อไปนี้:
          </p>

          <h6>1. การเก็บข้อมูล</h6>
          <p>
            เรารวบรวมข้อมูลส่วนบุคคลที่คุณให้กับเรา เช่น ชื่อ ที่อยู่อีเมล
            และรายละเอียดการติดต่ออื่นๆ เมื่อคุณลงทะเบียนหรือใช้บริการของเรา
            นอกจากนี้เรายังรวบรวมข้อมูลเกี่ยวกับการใช้งานแอปของคุณ
            รวมถึงการทำธุรกรรมและการโต้ตอบของคุณ
          </p>

          <h6>2. การใช้ข้อมูล</h6>
          <p>
            เราใช้ข้อมูลส่วนบุคคลของคุณเพื่อให้บริการ รักษา
            และปรับปรุงบริการของเรา ซึ่งรวมถึงการประมวลผลธุรกรรม
            การส่งการแจ้งเตือน และการให้บริการสนับสนุนลูกค้า
            นอกจากนี้เรายังอาจใช้ข้อมูลของคุณเพื่อการวิจัยและวิเคราะห์เพื่อพัฒนาประสบการณ์ผู้ใช้และสร้างคุณสมบัติใหม่
          </p>

          <h6>3. การแบ่งปันข้อมูล</h6>
          <p>
            เราจะไม่แบ่งปันข้อมูลส่วนบุคคลของคุณกับบุคคลที่สาม
            ยกเว้นในกรณีต่อไปนี้: ด้วยความยินยอมของคุณ เพื่อเหตุผลทางกฎหมาย
            หรือเพื่อปกป้องสิทธิและความปลอดภัยของเรา
            เราอาจแบ่งปันข้อมูลที่ไม่สามารถระบุตัวตนได้กับพันธมิตรของเราสำหรับวิเคราะห์และการตลาด
          </p>

          <h6>4. ความปลอดภัยของข้อมูล</h6>
          <p>
            เรามีมาตรการที่เหมาะสมในการปกป้องข้อมูลส่วนบุคคลของคุณจากการเข้าถึง
            การเปลี่ยนแปลง และการเปิดเผยโดยไม่ได้รับอนุญาต อย่างไรก็ตาม
            บริการที่ใช้ผ่านอินเทอร์เน็ตไม่สามารถรับประกันความปลอดภัยได้ทั้งหมด
            ดังนั้นเราจึงไม่สามารถรับประกันความปลอดภัยได้อย่างสมบูรณ์
          </p>

          <h6>5. สิทธิของผู้ใช้</h6>
          <p>
            คุณมีสิทธิ์เข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณได้ทุกเมื่อ
            คุณสามารถจัดการการตั้งค่าบัญชีของคุณหรือ
            ติดต่อเราตรงสำหรับความช่วยเหลือ
            เราจะตอบสนองต่อคำขอของคุณอย่างรวดเร็วและตามกฎหมายที่เกี่ยวข้อง
          </p>

          <h6>6. การเปลี่ยนแปลงนโยบาย</h6>
          <p>
            เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว
            เราจะแจ้งให้คุณทราบถึงการเปลี่ยนแปลงสำคัญโดยการโพสต์นโยบายใหม่บนแอปของเราและอัปเดตวันที่มีผล
            การใช้งานบริการของเราต่อหลังจากการเปลี่ยนแปลงมีผลถือว่าคุณยอมรับนโยบายใหม่
          </p>

          <h6>7. ติดต่อเรา</h6>
          <p>
            หากคุณมีคำถามหรือข้อกังวลเกี่ยวกับนโยบายของเราหรือวิธีการจัดการข้อมูลส่วนบุคคลของคุณ
            กรุณาติดต่อเราที่ weliveapplication@hotmail.com
          </p>
        </div>
      ) : (
        <div>
          <p>
            Welcome to our application. Please read our policies carefully to
            understand how we collect, use, and handle your personal
            information. By using our services, you agree to the following
            terms:
          </p>

          <h6>1. Data Collection</h6>
          <p>
            We collect personal information that you provide to us, such as your
            name, email address, and other contact details when you register or
            use our services. We also collect information about your usage of
            the app, including your interactions and transactions.
          </p>

          <h6>2. Data Usage</h6>
          <p>
            We use your personal information to provide, maintain, and improve
            our services. This includes processing transactions, sending
            notifications, and offering customer support. We may also use your
            data for research and analysis to enhance user experience and
            develop new features.
          </p>

          <h6>3. Data Sharing</h6>
          <p>
            We do not share your personal information with third parties except
            in the following circumstances: with your consent, for legal
            reasons, or to protect our rights and safety. We may share
            anonymized data with our partners for analytics and marketing
            purposes.
          </p>

          <h6>4. Data Security</h6>
          <p>
            We take reasonable measures to protect your personal information
            from unauthorized access, alteration, and disclosure. However, no
            internet-based service can be completely secure, so we cannot
            guarantee absolute security.
          </p>

          <h6>5. User Rights</h6>
          <p>
            You have the right to access, correct, or delete your personal
            information at any time. You can manage your account settings or
            contact us directly for assistance. We will respond to your requests
            promptly and in accordance with applicable laws.
          </p>

          <h6>6. Changes to the Policy</h6>
          <p>
            We may update this policy from time to time. We will notify you of
            any significant changes by posting the new policy on our app and
            updating the effective date. Your continued use of our services
            after the changes take effect constitutes your acceptance of the new
            policy.
          </p>

          <h6>7. Contact Us</h6>
          <p>
            If you have any questions or concerns about our policy or how we
            handle your personal information, please contact us at
            weliveapplication@hotmail.com
          </p>
        </div>
      )}
    </div>
  )
}

export default Policy
