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
                error={!!errors.code}
                helperText={errors.code?.message}
              />
              {/* {errors.code && <div style={err}>{errors.code.message}</div>} */}
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
                {...register('name', {
                  required: 'กรุณาระบุรหัสสินค้า',
                  maxLength: {
                    value: 30,
                    message: 'ชื่อสินค้าต้องไม่เกิน 30 ตัวอักษร',
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="ราคา"
                type="number"
                name="price"
                className="form-control form-control-sm"
                inputProps={{
                  min: 1, // กำหนดค่า min เป็น 1 เพราะต้องการให้กรอกมากกว่า 0
                }}
                {...register('price', {
                  required: 'กรุณาระบุราคาสินค้า',
                  validate: (value) =>
                    parseFloat(value) > 0 || 'ราคาต้องมากกว่า 0',
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="จำนวนสินค้า"
                type="number"
                name="stock_quantity"
                className="form-control form-control-sm"
                inputProps={{
                  min: 1,
                  max: 99,
                }}
                {...register('stock_quantity', {
                  required: 'กรุณาระบุจำนวนสินค้า',
                  validate: (value) =>
                    (value >= 0 && value <= 99) ||
                    'จำนวนสินค้าต้องอยู่ระหว่าง 0-99',
                })}
                error={!!errors.stock_quantity}
                helperText={errors.stock_quantity?.message}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="ราคาต้นทุน"
                type="number"
                name="cost"
                min="0"
                className="form-control form-control-sm"
                inputProps={{
                  min: 1, // กำหนดค่า min เป็น 1 เพราะต้องการให้กรอกมากกว่า 0
                }}
                {...register('cost', {
                  required: 'กรุณาระบุราคาต้นทุน',
                  validate: (value) =>
                    parseFloat(value) > 0 || 'ราคาต้องมากกว่า 0',
                })}
                error={!!errors.cost}
                helperText={errors.cost?.message}
              />
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
