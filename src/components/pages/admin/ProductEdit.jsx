import { baseURL } from '../../../App'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'

function ProductEdit(props) {
  let { isOpenEdit, setOpenEdit, idEdit } = props
  const navigate = useNavigate()

  const form = useRef()
  let code = useRef()
  let name = useRef()
  let cost = useRef()
  let price = useRef()
  let stock = useRef()
  let date_added = useRef()

  useEffect(() => {
    fetch(`${baseURL}/api/db/read/${idEdit}`)
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        code.current.value = result.code
        name.current.value = result.name
        price.current.value = result.price
        cost.current.value = result.cost
        stock.current.value = result.stock

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
    // formEnt._id = id
    formEnt._id = idEdit

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
          setOpenEdit(false)
          navigate('/admin/stock')
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
          <button className="btn btn-sm" onClick={() => setOpenEdit(false)}>
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>
        <form onSubmit={onSubmitForm} ref={form} className="p-4">
          <label className="form-label">รหัส CF</label>
          <input
            type="text"
            name="code"
            className="form-control form-control-sm"
            ref={code}
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
          <label className="form-label mt-2">วันที่เพิ่มสินค้า</label>
          <input
            type="date"
            name="date_added"
            className="form-control form-control-sm mb-3"
            ref={date_added}
            disabled={true}
          />
          <div className="d-flex justify-content-center ">
            <button className="btn btn-outline-warning btn-sm">
              แก้ไสินค้า
            </button>
            &nbsp;&nbsp;&nbsp;
            <button className="btn btn-sm" onClick={() => setOpenEdit(false)}>
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ProductEdit
