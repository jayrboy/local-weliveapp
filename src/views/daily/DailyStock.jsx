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
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  Box,
} from '@mui/material'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

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

      {/* Summary */}
      <Box className="m-3">
        <Grid container spacing={2}>
          {/* Card 1: จำนวนออเดอร์ */}
          <Grid item xs={6} sm={6} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ShoppingCartIcon sx={{ fontSize: 40, color: 'blue' }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  ยอดสั่งซื้อ CF
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {dailyStock.reduce(
                    (acc, doc) =>
                      acc + doc.products.reduce((pAcc, p) => pAcc + p.cf, 0),
                    0
                  )}{' '}
                  ออเดอร์
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: สินค้า Pre-Order */}
          <Grid item xs={6} sm={6} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AddShoppingCartIcon sx={{ fontSize: 40, color: 'purple' }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  สินค้า Pre-Order
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {dailyStock.reduce(
                    (acc, doc) =>
                      acc +
                      doc.products.reduce((pAcc, p) => {
                        return p.remaining_cf < 0
                          ? pAcc + Math.abs(p.remaining_cf)
                          : pAcc
                      }, 0),
                    0
                  )}{' '}
                  จำนวน
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

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
                    <TableContainer className="table-responsive">
                      <Table className="table-sm">
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
                            <StyledTableRow key={index + 1}>
                              <TableCell>
                                <Typography noWrap>
                                  {isLoading ? (
                                    <Box
                                      component="span"
                                      className="btn btn-danger"
                                      sx={{ fontSize: '20px' }}
                                    >
                                      {p.code}
                                    </Box>
                                  ) : (
                                    <Box
                                      component="span"
                                      className="btn btn-secondary"
                                      sx={{ fontSize: '20px' }}
                                    >
                                      {p.code}
                                    </Box>
                                  )}
                                  &nbsp;&nbsp;&nbsp;{p.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {p.price
                                  .toFixed(0)
                                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                              </TableCell>
                              <TableCell>{p.stock_quantity}</TableCell>
                              <TableCell>{p.limit}</TableCell>
                              <TableCell>{p.cf}</TableCell>
                              {p.remaining_cf < 0 ? (
                                <TableCell className="text-danger">
                                  <strong>{p.remaining_cf}</strong>
                                </TableCell>
                              ) : (
                                <TableCell>{p.remaining_cf}</TableCell>
                              )}
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

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
