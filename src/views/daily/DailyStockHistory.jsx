import { baseURL } from '../../App'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { MdEdit, MdDelete } from 'react-icons/md'
import { FaPlus, FaHistory } from 'react-icons/fa'
import { SiFacebooklive } from 'react-icons/si'

import { toast } from 'react-toastify'

import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'

export default function DailyStockHistory() {
  let [data, setData] = useState('')
  const [status, setStatus] = useState(['new', 'clear'])
  const navigate = useNavigate()
  const form = useRef()

  useEffect(() => {
    // อัพเดทข้อมูลเมื่อ status เปลี่ยนแปลง
    fetch(`${baseURL}/api/daily/history`)
      .then((response) => response.json())
      .then((docs) => {
        if (docs.length > 0) {
          showData(docs)
        } else {
          setData(
            <p className="text-center">ประวัติย้อนหลัง ไม่มีรายการข้อมูล</p>
          )
        }
      })
      .catch((err) => toast.error(err))
  }, [status]) // เพิ่ม status เป็น dependency

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

  const showData = (result) => {
    let r = (
      <>
        <span className="ms-3">
          {result.length === 0 ? (
            <>ไม่พบข้อมูล</>
          ) : (
            <small>พบข้อมูลทั้งหมด {result.length} รายการ</small>
          )}
        </span>
        <form onSubmit={onSubmitForm} ref={form} className="px-2">
          <div className="row">
            {result.map((doc) => {
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
                  className="col-12 col-sm-12 col-md-6 col-lg-4 mt-3"
                >
                  <div className="card shadow">
                    <div className="card-header">
                      วันที่:&nbsp;
                      <strong className="text-danger">{df}</strong>
                      <div className="float-end">
                        <FaHistory color="red" size={20} />
                      </div>
                    </div>
                    {/* Content */}
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 d-flex align-items-center">
                          Status:&nbsp;
                          <select
                            className="btn btn-sm btn-light border text-capitalize text-danger"
                            name="status"
                            defaultValue={doc.status}
                            style={{ height: '30px' }}
                            onChange={(event) => onChangeRole(doc._id, event)}
                            disabled
                          >
                            {status.map((item, i) => (
                              <option key={i + 1} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end align-items-center">
                          Chanel:&nbsp;
                          {doc.chanel && <SiFacebooklive size={45} />}
                        </div>
                      </div>
                      {/* Table */}
                      <div className="table-responsive">
                        <table className="table table-sm table-striped table-bordered border-light table-hover">
                          <caption className="ms-3">
                            {doc.length === 0 ? (
                              <>ไม่พบข้อมูล</>
                            ) : (
                              <>
                                <small>
                                  พบข้อมูลทั้งหมด{' '}
                                  {doc.products.length
                                    ? doc.products.length
                                    : 0}{' '}
                                  รายการ
                                </small>
                              </>
                            )}
                          </caption>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <strong>สินค้า</strong>
                              </TableCell>
                              <TableCell>
                                <strong>ราคา</strong>
                              </TableCell>
                              <TableCell>
                                <strong>จำนวน</strong>
                              </TableCell>
                              <TableCell>
                                <strong>limit</strong>
                              </TableCell>
                              <TableCell>
                                <strong>CF</strong>
                              </TableCell>
                              <TableCell>
                                <strong>จ่ายแล้ว/เหลือ</strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {doc.products.map((p, index) => (
                              <TableRow key={index + 1}>
                                <td>
                                  <div
                                    className="btn btn-danger"
                                    style={{ fontSize: '20px' }}
                                  >
                                    {p.code}
                                  </div>
                                  &nbsp;&nbsp;&nbsp;{p.name}
                                </td>
                                <td>{p.price}</td>
                                <td>{p.stock_quantity}</td>
                                <td>{p.limit}</td>
                                <td>{p.cf}</td>
                                <td>
                                  {p.paid}/{p.remaining_cf}
                                </td>
                              </TableRow>
                            ))}
                          </TableBody>
                        </table>
                      </div>
                      <div className="text-end">
                        ยอดรวม&nbsp;&nbsp;
                        <strong className="text-danger">{total}</strong>
                        &nbsp;บาท
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </form>
      </>
    )

    setData(r)
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    if (!window.confirm('ยืนยันการลบรายการนี้')) {
      return
    }

    const fd = new FormData(form.current)
    const fe = Object.fromEntries(fd.entries())

    if (Object.keys(fe).length === 0) {
      toast.warning('ต้องเลือกรายการที่จะลบ')
      return
    }

    fetch('/api/db/delete', {
      method: 'POST',
      body: JSON.stringify(fe),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error)
        } else {
          if (result.length === 0) {
            setData('ไม่มี CF CODE ดังกล่าว')
          } else {
            showData(result)
          }
          toast.success('cf code ถูกลบแล้ว')
        }
        navigate('/db/cfcode')
      })
      .catch((err) => toast.error(err))
  }

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-6">
          <h3 className="text-start">
            <Link to="/dashboard" className="  text-decoration-none">
              DAILY STOCK |
            </Link>
            <span className="text-success"> ประวัติรายการขายสินค้า</span>
          </h3>
        </div>
        <div className="col-lg-6 mt-1">
          <button
            className="btn btn-light btn-sm border"
            onClick={() => navigate('/sale-daily/create')}
          >
            <FaPlus color="blue" />
            &nbsp;เพิ่มสินค้าขายรายวัน
          </button>
          &nbsp;
          <button
            className="btn btn-light btn-sm border"
            onClick={() => navigate('/sale-daily/history')}
          >
            <FaHistory color="red" />
            &nbsp;ประวัติย้อนหลัง
          </button>
        </div>
      </div>
      <>{data}</>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/sale-daily" className="btn btn-light btn-sm border">
          ย้อนกลับ
        </Link>
      </div>
    </>
  )
}
