import { baseURL } from '../../App'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { MdEdit, MdDelete } from 'react-icons/md'
import { FaPlus, FaHistory } from 'react-icons/fa'
import { SiFacebooklive } from 'react-icons/si'

import { toast } from 'react-toastify'

import { getAllDaily } from '../../redux/dailyStockSlice'

import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

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
            <Link to="/dashboard" className="  text-decoration-none">
              DAILY STOCK |
            </Link>
            <span className="text-success"> รายการขายสินค้า</span>
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
                      <Link to={`/sale-daily/edit/${doc._id}`}>
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
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>สินค้า</strong>
                            </TableCell>
                            <TableCell>
                              <strong>ราคา</strong>
                            </TableCell>
                            <TableCell>
                              <strong className="text-success">จำนวน</strong>
                            </TableCell>
                            <TableCell>
                              <strong>limit</strong>
                            </TableCell>
                            <TableCell>
                              <strong>CF</strong>
                            </TableCell>
                            <TableCell>
                              <strong className="text-danger">
                                จ่ายแล้ว/เหลือ
                              </strong>
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
                              <td>
                                {p.price
                                  .toFixed(0)
                                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                              </td>
                              <td>{p.stock_quantity}</td>
                              <td>{p.limit}</td>
                              <td>{p.cf}</td>
                              {p.remaining_cf < 0 ? (
                                <td className="text-center text-danger">
                                  {p.paid} / {p.remaining_cf}
                                </td>
                              ) : (
                                <td>
                                  {p.paid} / {p.remaining_cf}
                                </td>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
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
        <Link to="/dashboard" className="btn btn-light btn-sm border">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
