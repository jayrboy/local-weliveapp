import { baseURL } from '../../../App'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function DBCreate() {
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
          toast.success('ข้อมูลถูกจัดเก็บแล้ว')
          form.current.reset()
        } else {
          toast.error('เกิดข้อผิดพลาด ข้อมูลไม่ถูกบันทึก')
        }
        navigate('/db/create')
      })
      .catch((e) => alert(e))
  }

  return (
    <>
      <div className="m-2 row-cols-auto">
        <h3 className="text-start">
          <Link to="/admin/home" className="  text-decoration-none">
            WE LIVE |
          </Link>{' '}
          <span className="text-success"> เพิ่มสินค้าใหม่ </span>
        </h3>
      </div>
      <div
        className="card mx-auto p-4 rounded mt-3"
        style={{ width: '400px', background: '#fff' }}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} ref={form}>
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
            {...register('stock', {
              validate: (value) => parseFloat(value) > 0,
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
            <button className="btn btn-success btn-sm">ตกลง</button>
          </div>
        </form>
      </div>
      <br />
      <div className="d-flex justify-content-center">
        <a href="/admin/home" className="btn btn-light btn-sm mb-5">
          กลับหน้าหลัก
        </a>
      </div>
    </>
  )
}
export default DBCreate
