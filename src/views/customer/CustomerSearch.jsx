import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchNameFacebook } from '../../redux/saleOrderSlice'

import {
  Paper,
  Grid,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  styled,
  Button,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material'

import { MdOutlineSearch } from 'react-icons/md'
import ErrorIcon from '@mui/icons-material/Error'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function CustomerSearch() {
  const dispatch = useDispatch()
  let { orders } = useSelector((store) => store.saleOrder)

  // สร้าง state สำหรับการค้นหา
  let [searchName, setSearchName] = useState('')
  let [searchAddress, setSearchAddress] = useState('')
  let [searchTel, setSearchTel] = useState('')

  // กรองข้อมูล orders ตามค่าการค้นหา
  const filteredOrders = orders.filter((order) => {
    return (
      order.name.toLowerCase().includes(searchName.toLowerCase()) &&
      order.address.toLowerCase().includes(searchAddress.toLowerCase()) &&
      order.tel.includes(searchTel)
    )
  })

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>
            <span className="text-success"> ค้นหาลูกค้า</span>
          </h3>
        </div>
      </div>

      <div className="position-relative m-3">
        <form className="mb-1">
          <Grid container spacing={2}>
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  type="text"
                  label="ชื่อลูกค้า"
                  size="small"
                  value={searchName}
                  className="form-control form-control-sm"
                  style={{ width: '150px' }}
                  onChange={(e) => setSearchName(e.target.value)} // อัปเดตค่าชื่อลูกค้า
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  type="text"
                  className="form-control form-control-sm"
                  label="ที่อยู่"
                  size="small"
                  style={{ width: '150px' }}
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)} // อัปเดตค่าที่อยู่
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <TextField
                  type="text"
                  className="form-control form-control-sm"
                  label="เบอร์โทรศัพท์"
                  size="small"
                  style={{ width: '150px' }}
                  value={searchTel}
                  onChange={(e) => setSearchTel(e.target.value)} // อัปเดตค่าเบอร์โทรศัพท์
                />
              </FormControl>
            </Grid>
          </Grid>
        </form>
        <TableContainer component={Paper}>
          <Table>
            <caption className="ms-3">
              <small> พบข้อมูลทั้งหมด {filteredOrders.length} รายการ</small>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ชื่อลูกค้า</strong>
                </TableCell>
                <TableCell>
                  <strong>ที่อยู่</strong>
                </TableCell>
                <TableCell>
                  <strong>ตำบล/แขวง</strong>
                </TableCell>
                <TableCell>
                  <strong>อำเภอ/เขต</strong>
                </TableCell>
                <TableCell>
                  <strong>จังหวัด</strong>
                </TableCell>
                <TableCell>
                  <strong>รหัสไปรษณีย์</strong>
                </TableCell>
                <TableCell>
                  <strong>โทรศัพท์</strong>
                </TableCell>
                <TableCell>
                  <strong>สถานะ</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length > 0 &&
                filteredOrders.map((order, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <TableCell>
                        <Typography noWrap>
                          <Link
                            to={`/order/${order._id}`}
                            state={{ _id: order._id }}
                            target="_blank"
                          >
                            {order.name}
                          </Link>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap>{order.address}</Typography>
                      </TableCell>
                      <TableCell>{order.district}</TableCell>
                      <TableCell>{order.amphure}</TableCell>
                      <TableCell>{order.province}</TableCell>
                      <TableCell>{order.postcode}</TableCell>
                      <TableCell>{order.tel}</TableCell>
                      <TableCell>
                        {order.sended ? (
                          <Typography noWrap className="text-success">
                            ส่งสินค้าแล้ว
                          </Typography>
                        ) : order.isDelete ? (
                          <Typography noWrap className="text-danger">
                            ปฏิเสธ/หมดเวลา
                          </Typography>
                        ) : (
                          <>
                            {order.isPayment ? (
                              <Typography
                                noWrap
                                sx={{
                                  display: 'flex', // ใช้ Flexbox เพื่อจัดเรียง
                                  alignItems: 'center', // จัดให้อยู่ตรงกลางในแนวตั้ง
                                  textAlign: 'center',
                                }}
                              >
                                <span className="text-warning">
                                  รอแพ็คสินค้า/จัดส่ง
                                </span>
                                &nbsp;
                                <Tooltip title="กรุณาแนบเลขพัสดุที่ออเดอร์ลูกค้า">
                                  <ErrorIcon color="warning" />
                                </Tooltip>
                              </Typography>
                            ) : (
                              <Typography
                                noWrap
                                sx={{
                                  display: 'flex', // ใช้ Flexbox เพื่อจัดเรียง
                                  alignItems: 'center', // จัดให้อยู่ตรงกลางในแนวตั้ง
                                  textAlign: 'center',
                                }}
                              >
                                <span className="text-secondary">
                                  ยังไม่ชำระเงิน
                                </span>
                              </Typography>
                            )}
                          </>
                        )}
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/dashboard" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
