import { baseURL } from '../../App'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { MdEdit, MdDelete, MdArrowBack, MdGrid3X3 } from 'react-icons/md'
import { FaPlus, FaHistory } from 'react-icons/fa'
import { SiFacebooklive } from 'react-icons/si'

import { toast } from 'react-toastify'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  Box,
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

export default function DailyStockHistory() {
  let [data, setData] = useState('')
  const [status, setStatus] = useState(['new', 'clear'])
  const navigate = useNavigate()
  const form = useRef()

  let [isOpenHistory, setIsOpenHistory] = useState({})
  console.log(isOpenHistory)

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

  const toggleHistory = (id) => {
    setIsOpenHistory((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // เปลี่ยนสถานะเปิด/ปิดของรายการที่มี id นั้น
    }))
    setStatus((prevStatus) => [...prevStatus, 'new'])
  }

  const showData = (result) => {
    let r = (
      <>
        <Typography className="text-center mb-3">
          {result.length === 0
            ? 'ไม่พบข้อมูล'
            : `พบข้อมูลทั้งหมด ${result.length} รายการ`}
        </Typography>

        <form onSubmit={onSubmitForm} ref={form} className="m-1">
          <Grid container spacing={3}>
            {result.map((doc) => {
              let total = new Intl.NumberFormat().format(doc.price_total)
              let dt = new Date(Date.parse(doc.date_added))
              let df = (
                <>
                  {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
                </>
              )

              return (
                <Grid item xs={12} sm={12} md={12} key={doc._id}>
                  <Card>
                    <div className="d-flex justify-content-between align-items-center p-3">
                      <Typography>
                        วันที่&nbsp;
                        <strong>{df}</strong>
                      </Typography>
                      <Button
                        variant="contained"
                        color={isOpenHistory[doc._id] ? 'error' : 'success'}
                        onClick={() => toggleHistory(doc._id)}
                      >
                        {isOpenHistory[doc._id]
                          ? 'ซ่อนรายละเอียด'
                          : 'ดูรายละเอียด'}
                      </Button>
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
                    {isOpenHistory[doc._id] && (
                      <TableContainer className="table-responsive">
                        <Table className="table-sm">
                          <caption className="ms-3">
                            {doc.length === 0 ? (
                              <small>ไม่พบข้อมูล</small>
                            ) : (
                              <small>
                                พบข้อมูลทั้งหมด{' '}
                                {doc.products.length ? doc.products.length : 0}{' '}
                                รายการ
                              </small>
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
                              <StyledTableRow key={index + 1}>
                                <TableCell>
                                  <Typography noWrap>
                                    <Box
                                      component="span"
                                      className="btn btn-secondary"
                                      sx={{ fontSize: '20px' }}
                                    >
                                      {p.code}
                                    </Box>
                                    &nbsp;&nbsp;&nbsp;{p.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>{p.price}</TableCell>
                                <TableCell>{p.stock_quantity}</TableCell>
                                <TableCell>{p.limit}</TableCell>
                                <TableCell>{p.cf}</TableCell>
                                <TableCell>
                                  {p.paid}/{p.remaining_cf}
                                </TableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}

                    <div className="text-end container">
                      <label className="form-label">ยอดรวม&nbsp;&nbsp;</label>
                      <strong className="text-danger">{total}</strong>
                      &nbsp;บาท
                    </div>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
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

        <div className="col-lg-6 mt-1 text-center">
          <Button
            variant="contained"
            color="inherit"
            onClick={() => navigate('/sale-daily')}
          >
            <MdArrowBack style={{ color: 'black', fontSize: '1.5rem' }} />
            &nbsp;กลับหน้ารายการขาย
          </Button>
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
