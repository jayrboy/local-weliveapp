import { baseURL } from '../../App'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { MdEdit, MdDelete } from 'react-icons/md'
import { FaPlus, FaHistory } from 'react-icons/fa'
import { SiFacebooklive } from 'react-icons/si'

import { toast } from 'react-toastify'

import { getAllDaily } from '../../redux/dailyStockSlice'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  Tooltip,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  Pagination,
  Stack,
  DialogTitle,
  Dialog,
  Card,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
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
  let { isLoading } = useSelector((state) => state.live)
  // console.log(dailyStock)

  useEffect(() => {
    dispatch(getAllDaily())
  }, [status])

  const onChangeRole = (id, event) => {
    if (!window.confirm('ยืนยันเก็บเป็นประวัติย้อนหลัง')) {
      return
    }
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

        <div className="col-lg-6 mt-1 text-center">
          <Button
            variant="contained"
            onClick={() => navigate('/sale-daily/create')}
          >
            <FaPlus color="blue" />
            &nbsp;เพิ่มสินค้าขายรายวัน
          </Button>
          &nbsp;
          <Button
            variant="contained"
            color="inherit"
            onClick={() => navigate('/sale-daily/history')}
          >
            <FaHistory color="red" />
            &nbsp;ประวัติย้อนหลัง
          </Button>
        </div>
      </div>
      <>
        {/* <span className="ms-5">
          {dailyStock.length === 0 ? (
            <small>ไม่พบข้อมูล</small>
          ) : (
            <small>พบข้อมูลทั้งหมด {dailyStock.length} รายการ</small>
          )}
        </span> */}
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
                  <Card>
                    <div className="d-flex justify-content-between align-items-center p-3">
                      <Typography>
                        วันที่&nbsp;
                        <strong>{df}</strong>
                      </Typography>
                      <Link to={`/sale-daily/edit/${doc._id}`}>
                        <Button variant="contained" color="warning">
                          <MdEdit color="orange" />
                          &nbsp;แก้ไข
                        </Button>
                      </Link>
                    </div>
                    {/* Content */}
                    <div className="container">
                      <div className="row">
                        <div className="col-6 d-flex align-items-center">
                          Status&nbsp;
                          <Select
                            className="text-capitalize"
                            name="status"
                            value={doc.status}
                            style={{ height: '40px' }}
                            onChange={(event) => onChangeRole(doc._id, event)}
                          >
                            {status.map((item, i) => (
                              <MenuItem key={i + 1} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                        <div className="col-6 d-flex justify-content-end align-items-center">
                          Chanel:&nbsp;
                          {doc.chanel && (
                            <SiFacebooklive size={45} color="#1877f2" />
                          )}
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
                              <strong className="text-danger">เหลือ</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {doc.products.map((p, index) => (
                            <TableRow key={index + 1}>
                              <TableCell>
                                <Typography noWrap>
                                  {isLoading ? (
                                    <div
                                      className="btn btn-danger"
                                      style={{ fontSize: '20px' }}
                                    >
                                      {p.code}
                                    </div>
                                  ) : (
                                    <div
                                      className="btn btn-secondary"
                                      style={{ fontSize: '20px' }}
                                    >
                                      {p.code}
                                    </div>
                                  )}
                                  &nbsp;&nbsp;&nbsp;{p.name}
                                </Typography>
                              </TableCell>
                              <td>
                                {p.price
                                  .toFixed(0)
                                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                              </td>
                              <td>{p.stock_quantity}</td>
                              <td>{p.limit}</td>
                              <td>{p.cf}</td>
                              {p.remaining_cf < 0 ? (
                                <td className="text-danger">
                                  <strong>{p.remaining_cf}</strong>
                                </td>
                              ) : (
                                <td>{p.remaining_cf}</td>
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
                  </Card>
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
