import { baseURL } from '../../App'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, TextField, Grid } from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'

const ProductEdit = (props) => {
  let { isOpenEdit, setOpenEdit, idEdit, setSelectItem } = props
  const token = localStorage.getItem('token')
  const { user } = useSelector((state) => state.user)

  const form = useRef()
  let [product, setProduct] = useState({
    code: '',
    name: '',
    cost: 0,
    price: 0,
    price_old: 0,
    stock_quantity: 0,
    stock_quantity_old: 0,
    limit: 0,
    cf: 0,
    paid: 0,
    remaining_cf: 0,
    remaining: 0,
    isDelete: false,
    date_added: '',
    remarks: '',
    updateBy: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/product/read/${idEdit}`, {
          headers: { Authorization: 'Bearer ' + token },
        })
        const result = await response.json()

        setProduct({
          code: result.code,
          name: result.name,
          price: result.price,
          price_old: result.price,
          cost: result.cost,
          stock_quantity: result.stock_quantity,
          stock_quantity_old: result.stock_quantity,
          limit: result.limit,
          cf: result.cf,
          paid: result.paid,
          remaining_cf: result.remaining_cf,
          remaining: result.remaining,
          date_added: result.date_added,
          updateBy: user.name,
        })
      } catch (err) {
        toast.error(err.message || 'An error occurred')
      }
    }

    fetchData()
  }, [])

  let handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    formData.append('_id', idEdit)
    formData.append('cf', product.cf)
    formData.append('paid', product.paid)
    formData.append('remaining_cf', product.remaining_cf)
    formData.append('remaining', product.remaining)
    formData.append('date_added', product.date_added)
    formData.append('price_old', product.price_old)
    formData.append('stock_quantity_old', product.stock_quantity_old)
    formData.append('remarks', product.remarks)
    formData.append('updateBy', product.updateBy)

    const formEnt = Object.fromEntries(formData.entries())
    formEnt.price = parseInt(formEnt.price)
    formEnt.cost = parseInt(formEnt.cost)
    formEnt.stock_quantity = parseInt(formEnt.stock_quantity)
    formEnt.stock_quantity_old = parseInt(formEnt.stock_quantity_old)
    formEnt.limit = parseInt(formEnt.limit)
    formEnt.paid = parseInt(formEnt.paid)
    formEnt.price_old = parseInt(formEnt.price_old)
    formEnt.remaining = parseInt(formEnt.remaining)
    formEnt.remaining_cf = parseInt(formEnt.remaining_cf)
    formEnt.cf = parseInt(formEnt.cf)

    // console.log(formEnt)

    fetch(`${baseURL}/api/product`, {
      method: 'PUT',
      body: JSON.stringify(formEnt),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => res.text())
      .then((result) => {
        // console.log(result)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('ข้อมูลถูกแก้ไขแล้ว')
          // setSelectItem(false)
          setOpenEdit(false)
        }
      })
      .catch((e) => toast.error(e))
  }

  return (
    <div className="modal-product">
      <div
        className="card shadow rounded"
        style={{ width: '400px', background: '#fff' }}
      >
        <span className="card-header d-flex justify-content-between align-items-center">
          <h4>PRODUCT / แก้ไขสินค้า</h4>
          <button
            className="btn btn-sm border"
            onClick={() => setOpenEdit(false)}
          >
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>

        <form onSubmit={onSubmitForm} ref={form} className="p-4">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label="รหัส CF"
                type="text"
                name="code"
                className="form-control form-control-sm"
                value={product.code}
                onChange={(e) => handleChange(e)}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="วันที่เพิ่มสินค้า"
                type="date"
                name="date_added"
                className="form-control form-control-sm"
                value={
                  product.date_added &&
                  new Date(product.date_added).toISOString().substring(0, 10)
                }
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="ชื่อสินค้า"
                type="text"
                name="name"
                className="form-control form-control-sm"
                value={product.name}
                onChange={(e) => handleChange(e)}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="ราคา"
                type="number"
                name="price"
                min="0"
                className="form-control form-control-sm"
                value={product.price}
                onChange={(e) => handleChange(e)}
                inputProps={{
                  min: 1, // กำหนดค่า min เป็น 1 เพราะต้องการให้กรอกมากกว่า 0
                }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="จำนวนสินค้า"
                type="number"
                name="stock_quantity"
                inputProps={{
                  min: 1,
                  max: 99,
                }}
                className="form-control form-control-sm"
                value={product.stock_quantity}
                onChange={(e) => handleChange(e)}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="ราคาต้นทุน"
                type="number"
                name="cost"
                min="0"
                className="form-control form-control-sm"
                value={product.cost}
                onChange={(e) => handleChange(e)}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="limit"
                type="number"
                name="limit"
                min="0"
                className="form-control form-control-sm"
                value={product.limit}
                onChange={(e) => handleChange(e)}
                required
              />
            </Grid>

            {/* ช่องสำหรับใส่ remarks */}
            <Grid item xs={12}>
              <TextField
                label="หมายเหตุ"
                type="text"
                name="remarks"
                className="form-control form-control-sm"
                value={product.remarks}
                onChange={(e) => handleChange(e)}
                multiline
                rows={4} // ให้มีหลายบรรทัด
                placeholder="หมายเหตุเพิ่มเติมเกี่ยวกับสินค้า"
              />
            </Grid>
          </Grid>

          <div className="d-flex justify-content-between mt-5">
            <Button className="btn btn-sm" onClick={() => setOpenEdit(false)}>
              ยกเลิก
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="submit" variant="contained" color="warning">
              บันทึก
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ProductEdit
