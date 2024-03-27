import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DBOrder() {
  const form = useRef()
  const navigate = useNavigate()

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    fetch('/api/db/order', {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((result) => {
        if (result === 'true') {
          form.current.reset()
          alert('ได้ส่งคำสั่งซื่้อแล้ว')
        } else {
          alert('เกิดข้อผิดพลาด คำสั่งซื้อไม่ถูกส่ง')
        }
        navigate('/')
      })
      .catch((e) => alert(e))
  }

  return (
    <>
      <div
        className="card mt-5 mx-auto p-4 rounded"
        style={{ width: '400px', background: '#fff' }}
      >
        <form onSubmit={onSubmitForm} ref={form}>
          <label className="form-label">ชื่อผู้ใช้</label>
          <input
            type="text"
            name="UserName"
            className="form-control form-control-sm"
            required
          />
          <br />
          <label className="form-label">คอมเม้นท์</label>
          <input
            type="text"
            name="comment"
            className="form-control form-control-sm"
          />
          <br />
          <label className="form-label">วันที่สั่งสิ่งค้า</label>
          <input
            type="Date"
            name="date_added"
            className="form-control form-control-sm"
            required
          />
          <br />

          <div className="d-flex justify-content-center">
            <button className="btn btn-success btn-sm">สั่งซื้อ</button>
          </div>
        </form>
      </div>
      <br />
      <div className="d-flex justify-content-center">
        <a href="/" className="btn btn-light btn-sm">
          กลับหน้าหลัก
        </a>
      </div>
    </>
  )
}
