import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
} from '@mui/material'

import { MdArrowBack, MdGrid3X3 } from 'react-icons/md'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const ProductHistory = () => {
  let [historyData, setHistoryData] = useState([])
  const navigate = useNavigate()

  //   useEffect(() => {
  //     fetch('url')
  //       .then((res) => res.json())
  //       .then((data) => setHistoryData(data))
  //   }, [historyData])

  return (
    <>
      {/* Header */}
      <div className="m-3">
        <h3 className="text-start">
          <Link to="/dashboard" className="text-decoration-none">
            WE LIVE |
          </Link>
          <span className="text-success">
            &nbsp; ประวัติการแก้ไขสต็อกสินค้า
          </span>
        </h3>
      </div>

      {/* Buttons */}
      <Grid container spacing={1} className="m-3">
        <Grid
          item
          xs={12}
          md={4}
          lg={4}
          container
          alignItems="center"
          justifyContent="start"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/stock')}
            style={{
              backgroundColor: '#1976d2', // สีฟ้าเข้มเพื่อความสวยงาม
              color: 'white',
            }}
          >
            <MdArrowBack style={{ color: 'white', fontSize: '1.5rem' }} />
            &nbsp;กลับหน้าสินค้า
          </Button>
        </Grid>
      </Grid>

      {/* Table History */}
      <div className="m-3">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <caption>พบข้อมูล {historyData.length} รายการ</caption>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>วันที่</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>แก้ไขโดย</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>สินค้า</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ราคาเดิม</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ราคาใหม่</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>จำนวนเดิม</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>จำนวนใหม่</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>หมายเหตุ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((h, index) => (
                <StyledTableRow key={h.id}>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>{new Date(h.createAt).toLocaleString()}</TableCell>
                  <TableCell>{h.updateBy}</TableCell>
                  <TableCell>{h.productName}</TableCell>
                  <TableCell>{h.oldPrice.toLocaleString()}</TableCell>
                  <TableCell>{h.newPrice.toLocaleString()}</TableCell>
                  <TableCell>{h.oldQuantity}</TableCell>
                  <TableCell>{h.newQuantity}</TableCell>
                  <TableCell>{h.remarks}</TableCell>
                </StyledTableRow>
              ))}
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
export default ProductHistory
