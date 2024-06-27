import { baseURL } from '../../App'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'
import { FaPlus } from 'react-icons/fa'
import { MdDelete, MdEdit } from 'react-icons/md'

import { useDispatch, useSelector } from 'react-redux'
import {
  calTotals,
  deletedProduct,
  getDaily,
  updateDailyStockStatus,
  updatePriceTotal,
} from '../../redux/dailyStockSlice'

import { SiFacebooklive } from 'react-icons/si'

import DailyProductAdd from './DailyProductAdd'
import DailyProductEdit from './DailyProductEdit'
import DailyProductAddQuantity from './DailyProductAddQuantity'

const DailyEdit = () => {
  const { id } = useParams()

  const form = useRef()
  const token = localStorage.getItem('token')
  let status = ['new', 'clear']

  let { daily, total } = useSelector((store) => store.dailyStock)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  let [isOpenEdit, setOpenEdit] = useState(false)
  let [index, setIndex] = useState(0)
  let [isOpenAdd, setOpenAdd] = useState(false)
  let [isOpenAddQuantity, setOpenAddQuantity] = useState(false)

  useEffect(() => {
    dispatch(calTotals())
  }, [daily])

  useEffect(() => {
    dispatch(getDaily(id))
  }, [])

  useEffect(() => {
    dispatch(updatePriceTotal(total))
  }, [total])

  const onSubmitForm = (e) => {
    e.preventDefault()

    // console.log(dailyStock.price_total)

    fetch(`${baseURL}/api/daily/update`, {
      method: 'PUT',
      body: JSON.stringify(daily),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        toast.success('แก้ไขข้อมูลสำเร็จ')
        navigate('/sale-daily')
      })
      .catch((err) => toast.error('เกิดข้อผิดพลาด ข้อมูลไม่ถูกบันทึก'))
  }

  const onEditClick = () => {
    const selectedInput = document.querySelector('input[name="index"]:checked')

    if (selectedInput) {
      setOpenEdit(true)
      const index = selectedInput.value
      setIndex(index)
    } else {
      toast.warning('กรุณาเลือกรายการที่ต้องการแก้ไข')
    }
  }

  const onDeleteClick = () => {
    const selectedInput = document.querySelector('input[name="index"]:checked')

    if (!selectedInput) {
      toast.warning('กรุณาเลือกรายการที่ต้องการลบ')
      return
    }

    let index = selectedInput.value
    dispatch(deletedProduct(index))
    console.log('delete selected')

    const radioButtons = document.querySelectorAll('input[name="index"]')
    radioButtons.forEach((radio) => {
      radio.checked = false
    })
  }

  const handleStatusChange = (e) => {
    const newStatus = e.target.value
    dispatch(updateDailyStockStatus(newStatus))
  }

  const onAddQuantity = () => {
    const selectedInput = document.querySelector('input[name="index"]:checked')

    if (selectedInput) {
      setOpenAddQuantity(true)
      const index = selectedInput.value
      setIndex(index)
    } else {
      toast.warning('กรุณาเลือกรายการที่ต้องการเพิ่มจำนวนสินค้า')
    }
  }

  let dt = new Date(Date.parse(daily.date_added))
  let df = (
    <>
      {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
    </>
  )

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-6">
          <h3 className="text-start">
            <Link to="/home" className="  text-decoration-none">
              DAILY STOCK |
            </Link>
            <span className="text-success"> รายการขายสินค้า / แก้ไข</span>
          </h3>
        </div>

        <div
          className="card shadow mx-auto rounded px-1 mt-1"
          style={{ width: '100%' }}
        >
          <form ref={form} onSubmit={onSubmitForm}>
            {/* Card Header */}
            <div className="d-flex justify-content-between align-items-center p-3">
              <div>
                วันที่:&nbsp;
                <strong className="text-primary">{df}</strong>
              </div>
              <button
                className="btn btn-light btn-sm float-end border"
                onClick={() => navigate('/sale-daily')}
              >
                <CloseIcon sx={{ color: 'red' }} />
              </button>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-6 d-flex align-items-center">
                  Status:&nbsp;
                  <select
                    name="status"
                    className="btn btn-sm btn-light border text-capitalize"
                    defaultValue={daily.status}
                    onChange={handleStatusChange} // เพิ่มการจัดการการเปลี่ยนแปลง
                    style={{ height: '30px' }}
                  >
                    {status.map((item, i) => (
                      <option key={i + 1} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6 d-flex justify-content-end align-items-center">
                  Chanel:&nbsp;
                  {daily.chanel && <SiFacebooklive size={45} />}
                </div>
              </div>
            </div>
            <div className="m-3">
              <button
                type="button"
                className="btn btn-sm btn-light border"
                onClick={() => setOpenAdd(true)}
              >
                <FaPlus color="blue" /> เพิ่มสินค้าเฉพาะในรายการนี้
              </button>
              &nbsp;&nbsp;
              <button
                type="button"
                className="btn btn-sm btn-light border"
                onClick={() => onAddQuantity(true)}
              >
                <FaPlus color="blue" /> เพิ่มจำนวนสินค้า
              </button>
              &nbsp;&nbsp;
              <button
                type="button"
                className="btn btn-sm btn-light border"
                onClick={onDeleteClick}
              >
                <MdDelete color="red" /> ลบรายการที่เลือก
              </button>
            </div>
            {/* Table */}
            <div className="table-responsive px-2">
              <table className="table table-sm table-striped table-bordered border-light table-hover">
                <caption className="ms-3">
                  {daily.length === 0 ? (
                    <>ไม่พบข้อมูล</>
                  ) : (
                    <>
                      <small>
                        พบข้อมูลทั้งหมด{' '}
                        {daily.products.length ? daily.products.length : 0}{' '}
                        รายการ
                      </small>
                    </>
                  )}
                </caption>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '80px' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-light border"
                        onClick={onEditClick}
                      >
                        <MdEdit color="orange" />
                        แก้ไข
                      </button>
                    </th>
                    <th>สินค้า</th>
                    <th>ราคา</th>
                    <th className="text-success">จำนวน</th>
                    <th>limit</th>
                    <th>CF</th>
                    <th className="text-danger">จ่ายแล้ว/เหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.products &&
                    daily.products.map((p, index) => {
                      // console.log(p)
                      return (
                        <tr key={index}>
                          <td className="text-center">
                            <input
                              type="radio"
                              name="index"
                              defaultValue={index}
                              className="form-check-input"
                            />
                          </td>
                          <td>
                            <code style={{ fontSize: '20px' }}>{p.code}</code>
                            &nbsp;&nbsp;{p.name}
                          </td>
                          <td>{p.price}</td>
                          <td>{p.stock_quantity}</td>
                          <td>{p.limit}</td>
                          <td>{p.cf}</td>
                          {p.remaining_cf < 0 ? (
                            <td className="text-danger">
                              {p.paid} / {p.remaining_cf}
                            </td>
                          ) : (
                            <td>
                              {p.paid} / {p.remaining_cf}
                            </td>
                          )}
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="text-end container">
              <label className="form-label">ยอดรวม&nbsp;&nbsp;</label>
              <span>
                {total.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                &nbsp;&nbsp;&nbsp;บาท
              </span>
            </div>
            {/* Footer Button */}
            <footer className="d-flex justify-content-center p-4">
              <button
                className="btn btn-sm"
                onClick={() => navigate('/sale-daily')}
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
      </div>
      {isOpenEdit && (
        <DailyProductEdit
          isOpenEdit={isOpenEdit}
          setOpenEdit={setOpenEdit}
          index={index}
        />
      )}
      {isOpenAdd && <DailyProductAdd setOpenAdd={setOpenAdd} />}
      {isOpenAddQuantity && (
        <DailyProductAddQuantity
          setOpenAddQuantity={setOpenAddQuantity}
          index={index}
        />
      )}
    </>
  )
}
export default DailyEdit
