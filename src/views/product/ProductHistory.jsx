import { baseURL } from '../../App'
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
  Grid,
  IconButton,
} from '@mui/material'

import InfoIcon from '@mui/icons-material/Info'

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

  useEffect(() => {
    fetch(`${baseURL}/api/product/history`)
      .then((res) => res.json())
      .then((data) => setHistoryData(data))
  }, [])

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
            <caption>
              <small>พบข้อมูล {historyData.length} รายการ</small>
            </caption>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <MdGrid3X3 />
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  วันที่แก้ไข
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'green',
                    textAlign: 'center',
                  }}
                >
                  ผู้แก้ไข
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  ชื่อสินค้า
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  ราคาเดิม
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  ราคาใหม่
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  จำนวนเดิม
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  จำนวนใหม่
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  หมายเหตุ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((h, index) => {
                const cdt = new Date(Date.parse(h.createdAt))
                const cdf = (
                  <>
                    {cdt.getDate()}-{cdt.getMonth() + 1}-{cdt.getFullYear()}
                  </>
                )

                return (
                  <TableRow key={h._id}>
                    <TableCell
                      sx={{ textAlign: 'center', backgroundColor: '#f5f5f5' }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}
                    >
                      {cdf}
                    </TableCell>

                    <TableCell sx={{ backgroundColor: '#e8f5e9' }}>
                      <Typography noWrap>{h.updateBy}</Typography>
                    </TableCell>

                    <TableCell sx={{ backgroundColor: '#f0f0f0' }}>
                      <Typography noWrap>{h.product_name}</Typography>
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: '#ffebee', textAlign: 'right' }}
                    >
                      {h.price_old.toLocaleString()} {/* Format as needed */}
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: '#e3f2fd', textAlign: 'right' }}
                    >
                      {h.price_new.toLocaleString()} {/* Format as needed */}
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: '#ffebee', textAlign: 'right' }}
                    >
                      {h.stock_quantity_old}
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: '#e3f2fd', textAlign: 'right' }}
                    >
                      {h.stock_quantity_new}
                    </TableCell>

                    <TableCell sx={{ backgroundColor: '#f0f0f0' }}>
                      <Typography
                        noWrap
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '150px', // Adjust size as needed
                        }}
                      >
                        {h.remarks}
                        <IconButton size="small" sx={{ padding: '4px' }}>
                          <Tooltip title={h.remarks} arrow>
                            <InfoIcon />
                          </Tooltip>
                        </IconButton>
                      </Typography>
                    </TableCell>
                  </TableRow>
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
export default ProductHistory
