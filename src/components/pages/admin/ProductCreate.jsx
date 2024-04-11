import { baseURL } from '../../../App'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'

function ProductCreate(props) {
  let { isOpenCreate, setOpenCreate } = props
  const form = useRef()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const err = {
    fontSize: 'smaller',
    color: 'red',
  }

  const onSubmitForm = (event) => {
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    fetch(`${baseURL}/api/db/create`, {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((result) => {
        if (result === 'true') {
          form.current.reset()
          toast.success('ข้อมูลถูกจัดเก็บแล้ว')
          setOpenCreate(false)
          navigate('/admin/stock')
        } else {
          toast.error('เกิดข้อผิดพลาด ข้อมูลไม่ถูกบันทึก')
        }
      })
      .catch((e) => toast.error(e))
  }

  return (
    <div className="modal-product">
      <div
        className="card shadow mx-auto rounded"
        style={{ width: '400px', background: '#fff' }}
      >
        <span className="card-header d-flex justify-content-between align-items-center p-3">
          <h4>PRODUCT / เพิ่มสินค้า</h4>
          <button className="btn btn-sm" onClick={() => setOpenCreate(false)}>
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>

        <form onSubmit={handleSubmit(onSubmitForm)} ref={form} className="p-4">
          <label className="form-label">รหัส CF</label>
          <input
            type="text"
            name="itemid"
            className="form-control form-control-sm"
            {...register('itemid', { required: true, maxLength: 30 })}
          />
          {errors.name && (
            <div style={err}>กรุณาระบุรหัสสินค้า ตัวอย่าง &quot;A01&quot;</div>
          )}
          <label className="form-label mt-2">ชื่อสินค้า</label>
          <input
            type="text"
            name="name"
            className="form-control form-control-sm"
            {...register('name', { required: true, maxLength: 30 })}
          />
          {errors.name && (
            <div style={err}>
              กรุณาระบุชื่อสินค้า ตัวอย่าง &quot;หนังสือ&quot;
            </div>
          )}
          <label className="form-label mt-2">ราคา</label>
          <input
            type="number"
            name="price"
            min="0"
            className="form-control form-control-sm"
            {...register('price', {
              validate: (value) => parseFloat(value) > 0,
            })}
          />
          {errors.price && <div style={err}>กำหนดราคาสินค้า ตัวอย่าง: 400</div>}
          <label className="form-label mt-2">ราคาต้นทุน</label>
          <input
            type="number"
            name="cost"
            min="0"
            className="form-control form-control-sm"
            {...register('cost', {
              validate: (value) => parseFloat(value) > 0,
            })}
          />
          {errors.price && <div style={err}>กำหนดราคาต้นทุน ตัวอย่าง: 200</div>}
          <label className="form-label mt-2">จำนวนสินค้า</label>
          <input
            type="number"
            name="stock"
            min="0"
            className="form-control form-control-sm"
            {...register('stock', {
              validate: (value) => parseFloat(value) > 0,
            })}
          />
          {errors.price && <div style={err}>กำหนดจำนวนสินค้า ตัวอย่าง: 10</div>}
          <label className="form-label mt-2">
            จำนวนสินค้าที่อนุญาติให้ล้นสต็อก
          </label>
          <input
            type="number"
            name="over_stock"
            min="0"
            className="form-control form-control-sm"
            {...register('over_stock', {
              validate: (value) => parseFloat(value) >= 0,
            })}
          />
          {errors.price && (
            <div style={err}>
              กำหนดจำนวน limit จำนวนที่นำมาตัดในสต็อก ตัวอย่าง: 10
            </div>
          )}
          <label className="form-label mt-2">วันที่เพิ่มสินค้า</label>
          <input
            type="Date"
            name="date_added"
            className="form-control form-control-sm mb-3"
          />
          <div className="d-flex justify-content-center ">
            <button className="btn btn-outline-primary btn-sm">
              เพิ่มสินค้า
            </button>
            &nbsp;&nbsp;&nbsp;
            <button className="btn btn-sm" onClick={() => setOpenCreate(false)}>
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ProductCreate
