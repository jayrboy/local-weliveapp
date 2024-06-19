import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addProduct } from '../../redux/dailyStockSlice'
import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'

import CloseIcon from '@mui/icons-material/Close'
import { MdEdit } from 'react-icons/md'

function DailyProductAdd(props) {
  let { setOpenAdd } = props
  const dispatch = useDispatch()
  const form = useRef()

  const onSubmitForm = (event) => {
    event.preventDefault()

    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    // แปลงข้อมูลที่เป็นตัวเลขให้เป็นตัวเลขแบบ integer ก่อนส่งไปยัง reducer
    formEnt._id = nanoid()
    formEnt.price = parseInt(formEnt.price)
    formEnt.stock_quantity = parseInt(formEnt.stock_quantity)
    formEnt.limit = parseInt(formEnt.limit)
    formEnt.cost = parseInt(formEnt.cost)
    formEnt.cf = 0
    formEnt.remaining_cf = parseInt(formEnt.stock_quantity)
    formEnt.paid = 0
    formEnt.remaining = parseInt(formEnt.stock_quantity)

    console.log(formEnt)

    // เรียกใช้ action updateProduct และส่งข้อมูลที่แก้ไขไปยัง reducer
    dispatch(addProduct(formEnt))

    setOpenAdd(false)
    toast('เพิ่มสินค้าสำเร็จ')
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
            onClick={() => setOpenAdd(false)}
          >
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>
        <form ref={form} className="p-4">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <label className="form-label">รหัส CF</label>
              <input
                type="text"
                name="code"
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-12 col-md-12 col-lg-12">
              <label className="form-label mt-2">ชื่อสินค้า</label>
              <input
                type="text"
                name="name"
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-6 col-md-6 col-lg-6">
              <label className="form-label mt-2">ราคา</label>
              <input
                type="number"
                name="price"
                min="0"
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-6 col-md-6 col-lg-6">
              <label className="form-label mt-2">ราคาต้นทุน</label>
              <input
                type="number"
                name="cost"
                min="0"
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-4 col-md-4 col-lg-4">
              <label className="form-label mt-2">จำนวนสินค้า</label>
              <input
                type="number"
                name="stock_quantity"
                min="0"
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-4 col-md-4 col-lg-4">
              <label className="form-label mt-2">limit</label>
              <input
                type="number"
                name="limit"
                min="0"
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-4 col-md-4 col-lg-4">
              <label className="form-label mt-2">วันที่เพิ่มสินค้า</label>
              <input
                type="date"
                name="date_added"
                className="form-control form-control-sm mb-3"
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                onClick={onSubmitForm}
                className="btn btn-light btn-sm border"
              >
                <MdEdit color="orange" /> แก้ไข
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setOpenAdd(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
export default DailyProductAdd
