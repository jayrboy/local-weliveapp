import { baseURL } from '../../App'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Button, TextField, Grid } from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

function ProductCreate(props) {
  let { isOpenCreate, setOpenCreate, page } = props
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

  // เรียกฟังก์ชันเมื่อ component ถูก mount หรือหลัง DOM โหลดเสร็จ
  useEffect(() => {
    setCurrentDate()
  }, [])

  const setCurrentDate = () => {
    const today = new Date()
    const date = today.toISOString().split('T')[0] // ได้รูปแบบ YYYY-MM-DD
    document.querySelector('input[name="date_added"]').value = date
  }

  const onSubmitForm = async () => {
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    formEnt.price = parseInt(formEnt.price)
    formEnt.cost = parseInt(formEnt.cost)
    formEnt.stock_quantity = parseInt(formEnt.stock_quantity)
    formEnt.limit = parseInt(formEnt.limit)

    // console.log(formEnt)

    let response = await fetch(`${baseURL}/api/product`, {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      toast.warning('มีรหัสสินค้านี้อยู่ในสต็อกแล้ว กรุณาเปลี่ยนรหัสสินค้าใหม่')
    } else {
      toast.success('ข้อมูลถูกจัดเก็บแล้ว')
      setOpenCreate(false)
      navigate(`/stock?page=${page}`)
      form.current.reset()
    }
  }

  return (
    <div className="modal-product">
      <div
        className="card shadow mx-auto rounded"
        style={{ width: '400px', background: '#fff' }}
      >
        <span className="card-header d-flex justify-content-between align-items-center">
          <h4>PRODUCT / เพิ่มสินค้า</h4>
          <button
            className="btn btn-sm border"
            onClick={() => setOpenCreate(false)}
          >
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>

        <form onSubmit={handleSubmit(onSubmitForm)} ref={form} className="p-4">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label="รหัส CF"
                type="text"
                name="code"
                className="form-control form-control-sm"
                {...register('code', {
                  required: 'กรุณาระบุรหัสสินค้า',
                  maxLength: {
                    value: 3,
                    message: 'รหัสสินค้าต้องไม่เกิน 3 ตัวอักษร',
                  },
                })}
              />
              {errors.code && <div style={err}>{errors.code.message}</div>}
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="date"
                label="วันที่เพิ่มสินค้า"
                name="date_added"
                className="form-control form-control-sm"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="ชื่อสินค้า"
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
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="ราคา"
                type="number"
                name="price"
                min="0"
                className="form-control form-control-sm"
                {...register('price', {
                  validate: (value) => parseFloat(value) > 0,
                })}
              />
              {errors.price && (
                <div style={err}>กำหนดราคาสินค้า ตัวอย่าง: 400</div>
              )}
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="จำนวนสินค้า"
                type="number"
                name="stock_quantity"
                min="0"
                max="99"
                className="form-control form-control-sm"
                {...register('stock_quantity', {
                  validate: (value) => parseFloat(value) > 0,
                })}
              />
              {errors.price && (
                <div style={err}>กำหนดจำนวนสินค้า ตัวอย่าง: 10</div>
              )}
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="ราคาต้นทุน"
                type="number"
                name="cost"
                min="0"
                className="form-control form-control-sm"
                {...register('cost', {
                  validate: (value) => parseFloat(value) > 0,
                })}
              />
              {errors.price && (
                <div style={err}>กำหนดราคาต้นทุน ตัวอย่าง: 200</div>
              )}
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="ขายเกินจำนวนได้ (limit)"
                type="number"
                name="limit"
                className="form-control form-control-sm"
              />
            </Grid>
          </Grid>

          <div className="d-flex justify-content-between mt-5">
            <Button
              className="btn btn-sm text-secondary"
              onClick={() => setOpenCreate(false)}
            >
              ยกเลิก
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="submit" variant="contained">
              บันทึก
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ProductCreate
