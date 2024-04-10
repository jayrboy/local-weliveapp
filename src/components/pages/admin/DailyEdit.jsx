import { baseURL } from '../../../App'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'

function DailyEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const form = useRef()
  let itemid = useRef()
  let name = useRef()
  let cost = useRef()
  let price = useRef()
  let stock = useRef()
  let over_stock = useRef()
  let date_added = useRef()

  useEffect(() => {
    fetch(`${baseURL}/api/db/read/${id}`)
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        itemid.current.value = result.itemid
        name.current.value = result.name
        price.current.value = result.price
        cost.current.value = result.cost
        stock.current.value = result.stock
        over_stock.current.value = result.over_stock

        let dt = new Date(Date.parse(result.date_added))
        let y = dt.getFullYear()
        let m = dt.getMonth() + 1
        //ค่าที่จะกำหนดให้แก่อินพุตชนิด date ต้องเป็นรูปแบบ yyyy-mm-dd
        //สำหรับเดือนและวันที่ หากเป็นเลขตัวเดียวต้องเติม 0 ข้างหน้า
        m = m >= 10 ? m : '0' + m
        let d = dt.getDate()
        d = d >= 10 ? d : '0' + d
        date_added.current.value = `${y}-${m}-${d}`
      })
      .catch((err) => toast.error(err))
  }, [])

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())
    formEnt._id = id

    fetch(`${baseURL}/api/db/update`, {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((result) => {
        console.log(result)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('ข้อมูลถูกแก้ไขแล้ว')
          navigate('/admin/daily-stock')
        }
      })
      .catch((e) => toast.error(e))
  }

  return (
    <div className="modal-edit">
      <div
        className="card shadow rounded"
        style={{ width: '400px', background: '#fff' }}
      >
        <span className="card-header d-flex justify-content-between align-items-center">
          <h4>DAILY STOCK / แก้ไขสินค้า</h4>
          <button
            className="btn btn-sm"
            onClick={() => navigate('/admin/daily-stock')}
          >
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>
        <form onSubmit={onSubmitForm} ref={form} className="p-4">
          <label className="form-label">รหัส CF</label>
          <input
            type="text"
            name="itemid"
            className="form-control form-control-sm"
            ref={itemid}
          />

          <label className="form-label mt-2">ชื่อสินค้า</label>
          <input
            type="text"
            name="name"
            className="form-control form-control-sm"
            ref={name}
          />
          <label className="form-label mt-2">ราคา</label>
          <input
            type="number"
            name="price"
            min="0"
            className="form-control form-control-sm"
            ref={price}
          />

          <label className="form-label mt-2">ราคาต้นทุน</label>
          <input
            type="number"
            name="cost"
            min="0"
            className="form-control form-control-sm"
            ref={cost}
          />

          <label className="form-label mt-2">จำนวนสินค้า</label>
          <input
            type="number"
            name="stock"
            min="0"
            className="form-control form-control-sm"
            ref={stock}
          />

          <label className="form-label mt-2">
            จำนวนสินค้าที่อนุญาติให้ล้นสต็อก
          </label>
          <input
            type="number"
            name="over_stock"
            min="0"
            className="form-control form-control-sm"
            ref={over_stock}
          />

          <label className="form-label mt-2">วันที่เพิ่มสินค้า</label>
          <input
            type="date"
            name="date_added"
            className="form-control form-control-sm mb-3"
            ref={date_added}
          />
          <div className="d-flex justify-content-center ">
            <button className="btn btn-outline-warning btn-sm">
              แก้ไสินค้า
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              className="btn btn-sm"
              onClick={() => navigate('/admin/daily-stock')}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default DailyEdit
