import { baseURL } from '../../../../App'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'
import { MdEdit, MdDelete } from 'react-icons/md'
import { FaPlus, FaHistory } from 'react-icons/fa'

import { useSelector, useDispatch } from 'react-redux'
import {
  getProducts,
  calTotals,
  deletedProduct,
} from '../../../../redux/productSlice'

import DailyProductCreate from '../daily/DailyProductCreate'
import DailyProductAdd from './DailyProductAdd'

const DailyCreate = () => {
  let { products, total } = useSelector((store) => store.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useRef()
  const submitButton = useRef()
  let [isOpenEdit, setOpenEdit] = useState(false)
  let [index, setIndex] = useState(0)
  let [isOpenAdd, setOpenAdd] = useState(false)

  useEffect(() => {
    dispatch(calTotals())
  }, [products])

  useEffect(() => {
    dispatch(getProducts())
  }, [])

  const onSubmitForm = async (e) => {
    e.preventDefault()

    // Disable the submit button
    submitButton.current.disabled = true

    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    formEnt.products = products
    formEnt.price_total = total

    console.log(formEnt)

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
      // console.log(index)

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
            <div className="col-sm-3">
              <label className="form-label">วันที่</label>
              <input
                type="date"
                name="date_added"
                className="form-control form-control-sm mb-3"
              />
            </div>

            <div className="col-sm-3">
              <label className="form-label">Status</label>
              <select
                name="status"
                defaultValue="new"
                className="form-select form-select-sm"
              >
                <option value="new">New</option>
                <option value="clear">Clear</option>
              </select>
            </div>

            <div className="col-sm-3">
              <label className="form-label">Chanel</label>
              <select
                name="chanel"
                defaultValue="facebook"
                className="form-select form-select-sm"
              >
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div className="col-sm-3">
              <div className="text-end">
                <button
                  className="btn btn-light btn-sm border"
                  onClick={() => navigate('/admin/daily-stock')}
                >
                  <CloseIcon sx={{ color: 'red' }} />
                </button>
              </div>
            </div>

            <div className="col-12">
              <button
                type="button"
                className="btn btn-sm btn-light border"
                onClick={() => navigate('/admin/stock')}
              >
                <FaPlus color="blue" /> เพิ่มสินค้า
              </button>
              &nbsp;&nbsp;
              {/* <button
                type="button"
                className="btn btn-sm btn-light border"
                onClick={() => setOpenAdd(true)}
              >
                <FaPlus color="blue" /> เพิ่มสินค้าเฉพาะในรายการนี้
              </button>
              &nbsp;&nbsp; */}
              <button
                type="button"
                className="btn btn-sm btn-light border"
                onClick={onDeleteClick}
              >
                <MdDelete color="red" /> ลบรายการที่เลือก
              </button>
            </div>
          </div>
          {/* Table */}
          <div className="table-responsive px-2">
            <table className="table table-sm table-striped text-start table-bordered border-light table-hover">
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
                  <th>สินค้า</th>
                  <th>ราคา</th>
                  <th className="text-success">จำนวน</th>
                  <th>limit</th>
                  <th className="text-danger">*เหลือ</th>
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
                        <td>
                          <code style={{ fontSize: '20px' }}>{p.code}</code>
                          &nbsp;&nbsp;{p.name}
                        </td>
                        <td>
                          {p.price
                            .toFixed(0)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                        </td>
                        <td>{p.stock_quantity}</td>
                        <td>{p.limit}</td>
                        {/* สินค้าคงเหลือของ Product Master */}
                        <td>{p.remaining}</td>
                      </tr>
                    )
                  })}
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
            <button
              ref={submitButton}
              type="submit"
              className="btn btn-primary btn-sm border"
              disabled={false}
            >
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
      {/* {isOpenAdd && <DailyProductAdd setOpenAdd={setOpenAdd} />} */}
    </>
  )
}
export default DailyCreate
