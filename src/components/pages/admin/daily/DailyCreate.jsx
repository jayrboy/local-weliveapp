import { baseURL } from '../../../../App'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'
import { MdEdit, MdDelete } from 'react-icons/md'

import { useSelector, useDispatch } from 'react-redux'
import {
  getProducts,
  calTotals,
  deletedProduct,
} from '../../../../redux/productSlice'

import DailyProductCreate from '../daily/DailyProductCreate'

const DailyCreate = () => {
  let { products, total } = useSelector((store) => store.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useRef()
  let [isOpenEdit, setOpenEdit] = useState(false)
  let [index, setIndex] = useState(0)

  useEffect(() => {
    dispatch(calTotals())
  }, [products])

  useEffect(() => {
    dispatch(getProducts())
  }, [])

  const onSubmitForm = (e) => {
    e.preventDefault()

    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    formEnt.products = products
    formEnt.price_total = total

    // console.log(formEnt)

    fetch(`${baseURL}/api/daily/create`, {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((result) => {
        if (result === 'true') {
          form.current.reset()
          toast.success('ข้อมูลถูกจัดเก็บแล้ว')
          navigate('/admin/daily-stock')
        } else {
          toast.error('เกิดข้อผิดพลาด ข้อมูลไม่ถูกบันทึก')
        }
      })
      .catch((e) => toast.error(e))
  }

  const onEditClick = () => {
    const selectedInput = document.querySelector('input[name="index"]:checked')

    if (selectedInput) {
      const index = selectedInput.value
      console.log(index)

      setIndex(index)
      setOpenEdit(true)
    } else {
      toast.warning('กรุณาเลือกรายการที่ต้องการแก้ไข')
    }
  }

  const onDeleteClick = () => {
    const selectedInput = document.querySelector('input[name="index"]:checked')

    if (selectedInput) {
      let index = selectedInput.value
      dispatch(deletedProduct(index))
      console.log('delete selected')

      const radioButtons = document.querySelectorAll('input[name="index"]')
      radioButtons.forEach((radio) => {
        radio.checked = false
      })
    } else {
      toast.warning('กรุณาเลือกรายการที่ต้องการลบ')
    }
  }

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="  text-decoration-none">
              DAILY STOCK |
            </Link>
            <span className="text-success"> รายการขายสินค้า / เพิ่ม</span>
          </h3>
        </div>
      </div>

      <div className="card shadow m-3">
        <form ref={form} onSubmit={onSubmitForm}>
          <div className="row p-4">
            <div className="col-sm-4" style={{ width: '150px' }}>
              <label className="form-label">วันที่</label>
              <input
                type="date"
                name="date_added"
                className="form-control form-control-sm mb-3"
              />
            </div>

            <div className="col-sm-4" style={{ width: '150px' }}>
              <label className="form-label">สถานะ</label>
              <select
                name="status"
                defaultValue="new"
                className="form-select form-select-sm"
              >
                <option value="new">New</option>
                <option value="clear">Clear</option>
              </select>
            </div>
            <div className="col-sm-4" style={{ width: '150px' }}>
              <label className="form-label">Chanel</label>
              <select
                name="chanel"
                defaultValue="facebook"
                className="form-select form-select-sm"
              >
                <option value="facebook">Facebook</option>
              </select>
            </div>
          </div>
          {/* Table */}
          <div className="table-responsive px-2">
            <table className="table table-sm table-striped text-center table-bordered border-light table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-light border"
                      onClick={onEditClick}
                    >
                      <MdEdit color="orange" /> แก้ไข
                    </button>
                  </th>
                  <th>รหัส</th>
                  <th>ชื่อสินค้า</th>
                  <th>ราคา</th>
                  <th>จำนวน</th>
                  <th>limit</th>
                  <th>เหลือ</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((p, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center">
                          <input
                            type="radio"
                            name="index"
                            value={index}
                            className="form-check-input"
                          />
                        </td>
                        <td>{p.code}</td>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.stock_quantity}</td>
                        <td>{p.limit}</td>
                        <td>{p.remaining}</td>
                      </tr>
                    )
                  })}
                <tr>
                  <td className="text-center">
                    <button
                      style={{ width: '70px' }}
                      type="button"
                      className="btn btn-sm btn-light border"
                      onClick={onDeleteClick}
                    >
                      <MdDelete color="red" /> ลบ
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Total */}
          <div className="row p-4">
            <div className="col-sm-8">
              <label className="form-label">ราคารวมจำนวนสินค้าทั้งหมด</label>
            </div>
            <div className="col-sm-4">
              <span>
                {total.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                &nbsp;&nbsp;&nbsp;บาท
              </span>
            </div>
          </div>
          {/* Footer Button */}
          <footer className="d-flex justify-content-center p-4">
            <button
              className="btn btn-sm"
              onClick={() => navigate('/admin/daily-stock')}
            >
              ยกเลิก
            </button>
            &nbsp;&nbsp;&nbsp;
            <button type="submit" className="btn btn-primary btn-sm border">
              บันทึก
            </button>
          </footer>
        </form>
      </div>

      {isOpenEdit && (
        <DailyProductCreate
          isOpenEdit={isOpenEdit}
          setOpenEdit={setOpenEdit}
          index={index}
        />
      )}
    </>
  )
}
export default DailyCreate
