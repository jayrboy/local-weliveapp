import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { MdEdit, MdDelete } from 'react-icons/md'
import { FaPlus, FaHistory } from 'react-icons/fa'
import { SiFacebooklive } from 'react-icons/si'

import { toast } from 'react-toastify'

import { baseURL } from '../../../../App'
import { getAllDaily } from '../../../../redux/dailyStockSlice'

export default function DailyStock() {
  const navigate = useNavigate()
  const form = useRef()
  let [status, setStatus] = useState(['new', 'clear'])

  const dispatch = useDispatch()
  let { dailyStock } = useSelector((state) => state.dailyStock)
  // console.log(dailyStock)

  useEffect(() => {
    dispatch(getAllDaily())
  }, [status])

  const onChangeRole = (id, event) => {
    // อัพเดทสถานะ
    const newRole = {
      id: id,
      status: event.target.value,
    }
    fetch(`${baseURL}/api/daily/change-role`, {
      method: 'POST',
      body: JSON.stringify(newRole),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((result) => {
        toast.success(result)
        // เปลี่ยนแปลงสถานะเพื่อ trigger useEffect
        setStatus((prevStatus) => [...prevStatus])
      })
      .catch((err) => toast.error(err))
  }

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-6">
          <h3 className="text-start">
            <Link to="/admin/home" className="  text-decoration-none">
              DAILY STOCK |
            </Link>
            <span className="text-success"> รายการขายสินค้า</span>
          </h3>
        </div>
        <div className="col-lg-6 mt-1">
          <button
            className="btn btn-light btn-sm border"
            onClick={() => navigate('/admin/daily-stock/create')}
          >
            <FaPlus color="blue" />
            &nbsp;เพิ่ม Daily Stock
          </button>
          &nbsp;
          <button
            className="btn btn-light btn-sm border"
            onClick={() => navigate('/admin/daily-stock/history')}
          >
            <FaHistory color="red" />
            &nbsp;ประวัติย้อนหลัง
          </button>
        </div>
      </div>
      <>
        <span className="ms-5">
          {dailyStock.length === 0 ? (
            <small>ไม่พบข้อมูล</small>
          ) : (
            <small>พบข้อมูลทั้งหมด {dailyStock.length} รายการ</small>
          )}
        </span>
        <form ref={form} className="px-2">
          <div className="row">
            {dailyStock.map((doc) => {
              let total = new Intl.NumberFormat().format(doc.price_total)
              let dt = new Date(Date.parse(doc.date_added))
              let df = (
                <>
                  {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
                </>
              )

              return (
                <div
                  key={doc._id}
                  className="col-12 col-sm-12 col-md-12 col-lg-12 mt-3"
                >
                  <div className="card shadow">
                    <div className="d-flex justify-content-between align-items-center p-3">
                      <div>
                        วันที่:&nbsp;
                        <strong className="text-primary">{df}</strong>
                      </div>
                      <Link to={`/admin/daily-stock/edit/${doc._id}`}>
                        <button className="btn btn-light btn-sm float-end border">
                          <MdEdit color="orange" />
                          &nbsp;แก้ไข
                        </button>
                      </Link>
                    </div>
                    {/* Content */}
                    <div className="container">
                      <div className="row">
                        <div className="col-6 d-flex align-items-center">
                          Status:&nbsp;
                          <select
                            className="btn btn-sm btn-light border text-capitalize"
                            name="status"
                            defaultValue={doc.status}
                            style={{ height: '30px' }}
                            onChange={(event) => onChangeRole(doc._id, event)}
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
                          {doc.chanel && <SiFacebooklive size={45} />}
                        </div>
                      </div>
                    </div>
                    {/* Table */}
                    <div className="table-responsive px-2">
                      <table className="table table-sm table-striped table-bordered border-light table-hover">
                        <caption className="ms-3">
                          {doc.length === 0 ? (
                            <>ไม่พบข้อมูล</>
                          ) : (
                            <>
                              <small>
                                พบข้อมูลทั้งหมด{' '}
                                {doc.products.length ? doc.products.length : 0}{' '}
                                รายการ
                              </small>
                            </>
                          )}
                        </caption>
                        <thead className="table-light">
                          <tr>
                            <th className='text-center'>สินค้า</th>
                            <th className='text-center'>ราคา</th>
                            <th className="text-center text-success">จำนวน</th>
                            <th className='text-center'>limit</th>
                            <th className='text-center'>CF</th>
                            <th className="text-center text-danger">จ่ายแล้ว/เหลือ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {doc.products.map((p, index) => (
                            <tr key={index + 1}>
                              <td className='text-center'>
                                <code style={{ fontSize: '20px' }}>
                                 รหัส {p.code} |

                                </code>
                                &nbsp;&nbsp;{p.name}
                              </td>
                              <td className='text-center'>
                                {p.price
                                  .toFixed(0)
                                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                              </td  >
                              <td className='text-center'>{p.stock_quantity}</td>
                              <td className='text-center'>{p.limit}</td>
                              <td className='text-center'>{p.cf}</td>
                              {p.remaining_cf < 0 ? (
                                <td className="text-center text-danger">
                                  {p.paid} / {p.remaining_cf}
                                </td>
                              ) : (
                                <td className='text-center'>
                                  {p.paid} / {p.remaining_cf}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-end container">
                      <label className="form-label">ยอดรวม&nbsp;&nbsp;</label>
                      <strong className="text-success">{total}</strong>
                      &nbsp;บาท
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </form>
      </>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/admin/home" className="btn btn-light btn-sm border">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
