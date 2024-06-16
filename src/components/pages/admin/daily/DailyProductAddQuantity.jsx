import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addQuantityProduct } from '../../../../redux/dailyStockSlice'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'
import { MdEdit } from 'react-icons/md'

function DailyProductAddQuantity(props) {
  let { setOpenAddQuantity, index } = props
  const dispatch = useDispatch()
  const form = useRef()

  const onSubmitForm = (event) => {
    event.preventDefault()

    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    formEnt.stock_quantity = parseInt(formEnt.stock_quantity)

    // เรียกใช้ action addQuantityProduct และส่งข้อมูลที่แก้ไขไปยัง reducer
    dispatch(addQuantityProduct({ index, formEnt }))

    setOpenAddQuantity(false)
    toast('เพิ่มจำนวนสินค้าสำเร็จ')
  }

  return (
    <div className="modal-product">
      <div
        className="card shadow rounded"
        style={{ width: '400px', background: '#fff' }}
      >
        <span className="card-header d-flex justify-content-between align-items-center">
          <h4>PRODUCT / เพิ่มจำนวนสินค้า</h4>
          <button
            className="btn btn-sm border"
            onClick={() => setOpenAddQuantity(false)}
          >
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>
        <form ref={form} className="p-4" onSubmit={onSubmitForm}>
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 mb-3">
              <label className="form-label mt-2">จำนวนสินค้า</label>
              <input
                type="number"
                name="stock_quantity"
                min="0"
                className="form-control form-control-sm"
                required
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setOpenAddQuantity(false)}
              >
                ยกเลิก
              </button>
              &nbsp;&nbsp;&nbsp;
              <button type="submit" className="btn btn-light btn-sm border">
                <MdEdit color="orange" /> บันทึก
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DailyProductAddQuantity
