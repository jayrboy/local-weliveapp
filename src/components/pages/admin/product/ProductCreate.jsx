import { baseURL } from '../../../../App'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'

function ProductCreate(props) {
  let { isOpenCreate, setOpenCreate } = props
  const form = useRef()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const err = {
    fontSize: 'smaller',
    color: 'red',
  }

  const onSubmitForm = () => {
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    formEnt.price = parseInt(formEnt.price)
    formEnt.cost = parseInt(formEnt.cost)
    formEnt.stock_quantity = parseInt(formEnt.stock_quantity)
    formEnt.limit = parseInt(formEnt.limit)

    // console.log(formEnt)

    fetch(`${baseURL}/api/product`, {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
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
          <button
            className="btn btn-sm border"
            onClick={() => setOpenCreate(false)}
          >
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>

        <form onSubmit={handleSubmit(onSubmitForm)} ref={form} className="p-4">
          <label className="form-label">รหัส CF</label>
          <input
            type="text"
            name="code"
            className="form-control form-control-sm"
            {...register('code', { required: true, maxLength: 30 })}
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
            name="stock_quantity"
            min="0"
            className="form-control form-control-sm"
            {...register('stock_quantity', {
              validate: (value) => parseFloat(value) > 0,
            })}
          />
          {errors.price && <div style={err}>กำหนดจำนวนสินค้า ตัวอย่าง: 10</div>}

          <label className="form-label mt-2">วันที่เพิ่มสินค้า</label>
          <input
            type="Date"
            name="date_added"
            className="form-control form-control-sm mb-3"
            {...register('date_added', {
              validate: (value) => parseFloat(value) > 0,
            })}
          />
          {errors.price && <div style={err}>โปรดเพิ่มวันที่</div>}

          <div className="d-flex justify-content-center ">
            <button className="btn btn-light btn-sm border">เพิ่มสินค้า</button>
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
