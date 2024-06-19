import { baseURL } from '../../App'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import CloseIcon from '@mui/icons-material/Close'

export default function ExpressCreate() {
  const form = useRef()
  const navigate = useNavigate()

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    fetch(`${baseURL}/api/ex/create`, {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((result) => {
        if (result === 'true') {
          form.current.reset()
          alert('ข้อมูลถูกจัดเก็บแล้ว')
        } else {
          alert('เกิดข้อผิดพลาด ข้อมูลไม่ถูกบันทึก')
        }
        navigate('/express')
      })
      .catch((e) => alert(e))
  }

  return (
    <>
      <div
        className="card shadow mx-auto rounded mt-4"
        style={{ width: '400px', background: '#fff' }}
      >
        <span className="card-header d-flex justify-content-between align-items-center p-3">
          <h4>Express / เพิ่มขนส่ง</h4>
          <button className="btn btn-sm" onClick={() => navigate('/express')}>
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>
        <form onSubmit={onSubmitForm} ref={form} className="p-4">
          <label className="form-label">ชื่อขนส่ง</label>
          <input
            type="text"
            name="exname"
            placeholder="' J&T Express '"
            className="form-control form-control-sm"
            required
          />

          <label className="form-label mt-2">ค่าส่งเริ่มต้น</label>
          <input
            type="number"
            name="fprice"
            placeholder="' 50 ฿ '"
            className="form-control form-control-sm"
            required
          />

          <label className="form-label mt-2">ค่าส่งชิ้นต่อไป</label>
          <input
            type="number"
            name="sprice"
            placeholder="' 30  '"
            className="form-control form-control-sm"
          />

          <label className="form-label mt-2">ค่าส่งสูงสุด</label>
          <input
            type="number"
            name="maxprice"
            placeholder="' 100  '"
            className="form-control form-control-sm"
          />

          <label className="form-label mt-2">ส่งฟรีต่อเมื่อยอดถึง</label>
          <input
            type="number"
            name="whenfprice"
            placeholder="' 1000 '"
            className="form-control form-control-sm"
          />

          <label className="form-label mt-2">ค่าส่งเพิ่มเติมกรณี CODE</label>
          <input
            type="text"
            name="name"
            placeholder="' 30 '"
            className="form-control form-control-sm"
          />

          <label className="form-label mt-2">วันที่เริ่มต้น</label>
          <input
            type="Date"
            name="date_start"
            className="form-control form-control-sm mb-3"
          />

          <div className="d-flex justify-content-center ">
            <button className="btn btn-outline-success btn-sm">
              เพิ่มขนส่ง
            </button>
            &nbsp;&nbsp;&nbsp;
            <button className="btn btn-sm" onClick={() => navigate('/express')}>
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
