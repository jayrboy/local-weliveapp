import { baseURL } from '../../../../App'
import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'
import { MdEdit } from 'react-icons/md'

function DailyProductEdit(props) {
  let { isOpenEdit, setOpenEdit, idEdit } = props

  const form = useRef()
  let code = useRef()
  let name = useRef()
  let cost = useRef()
  let price = useRef()
  let stock = useRef()
  let limit = useRef()
  let date_added = useRef()
  let cf
  let remaining_cf
  let paid
  let remaining

  useEffect(() => {
    fetch(`${baseURL}/api/daily/read/product/${idEdit}`)
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        code.current.value = result.code
        name.current.value = result.name
        price.current.value = result.price
        cost.current.value = result.cost
        stock.current.value = result.stock
        limit.current.value = result.limit

        let dt = new Date(Date.parse(result.date_added))
        let y = dt.getFullYear()
        let m = dt.getMonth() + 1
        //ค่าที่จะกำหนดให้แก่อินพุตชนิด date ต้องเป็นรูปแบบ yyyy-mm-dd
        //สำหรับเดือนและวันที่ หากเป็นเลขตัวเดียวต้องเติม 0 ข้างหน้า
        m = m >= 10 ? m : '0' + m
        let d = dt.getDate()
        d = d >= 10 ? d : '0' + d
        date_added.current.value = `${y}-${m}-${d}`

        cf = result.cf
        remaining_cf = result.remaining_cf
        paid = result.paid
        remaining = result.remaining
      })
      .catch((err) => toast.error(err))
  }, [])

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())
    formEnt._id = idEdit
    formEnt.cf = cf
    formEnt.remaining_cf = remaining_cf
    formEnt.paid = paid
    formEnt.remaining = remaining

    fetch(`${baseURL}/api/daily/update`, {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('ข้อมูลถูกแก้ไขแล้ว')
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
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <label className="form-label">รหัส CF</label>
              <input
                type="text"
                name="code"
                className="form-control form-control-sm"
                ref={code}
                required
              />
            </div>
            <div className="col-12 col-md-12 col-lg-12">
              <label className="form-label mt-2">ชื่อสินค้า</label>
              <input
                type="text"
                name="name"
                className="form-control form-control-sm"
                ref={name}
                required
              />
            </div>
            <div className="col-6 col-md-6 col-lg-6">
              <label className="form-label mt-2">ราคา</label>
              <input
                type="number"
                name="price"
                min="0"
                className="form-control form-control-sm"
                ref={price}
                required
              />
            </div>

            <div className="col-6 col-md-6 col-lg-6">
              <label className="form-label mt-2">ราคาต้นทุน</label>
              <input
                type="number"
                name="cost"
                min="0"
                className="form-control form-control-sm"
                ref={cost}
                required
              />
            </div>

            <div className="col-4 col-md-4 col-lg-4">
              <label className="form-label mt-2">จำนวนสินค้า</label>
              <input
                type="number"
                name="stock"
                min="0"
                className="form-control form-control-sm"
                ref={stock}
                required
              />
            </div>
            <div className="col-4 col-md-4 col-lg-4">
              <label className="form-label mt-2">limit</label>
              <input
                type="number"
                name="limit"
                min="0"
                className="form-control form-control-sm"
                ref={limit}
                required
              />
            </div>
            <div className="col-4 col-md-4 col-lg-4">
              <label className="form-label mt-2">วันที่เพิ่มสินค้า</label>
              <input
                type="date"
                name="date_added"
                className="form-control form-control-sm mb-3"
                ref={date_added}
              />
            </div>
            <div className="d-flex justify-content-center ">
              <button className="btn btn-light btn-sm border">
                <MdEdit color="orange" /> แก้ไข
              </button>
              &nbsp;&nbsp;&nbsp;
              <button className="btn btn-sm" onClick={() => setOpenEdit(false)}>
                ยกเลิก
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
export default DailyProductEdit
