import React from 'react'
import { Link } from 'react-router-dom'

import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'

import IconButton from '@mui/material/IconButton'
import { MdOutlineSearch } from 'react-icons/md'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { Button, Checkbox, TextField } from '@mui/material'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const BookBank = () => {
  return (
    <>
      <div className="row m-3">
        <div className="col-lg-6">
          <h3 className="text-start">
            <Link to="/dashboard" className="text-decoration-none">
              BANK ACCOUNT |
            </Link>
            <span className="text-success"> บัญชีธนาคาร</span>
          </h3>
        </div>
      </div>

      <div className="position-relative m-3">
        <div className="d-flex mb-1 justify-content-end mb-2">
          <Button variant="contained">เพิ่มบัญชีใหม่</Button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>#</strong>
                </TableCell>
                <TableCell>
                  <strong>ธนาคาร</strong>
                </TableCell>
                <TableCell>
                  <strong>ชื่อบัญชี</strong>
                </TableCell>
                <TableCell>
                  <strong>เลขบัญชี</strong>
                </TableCell>
                <TableCell>
                  <strong>พร้อมเพย์</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <TableCell padding="checkbox">
                  <Checkbox color="primary" />
                </TableCell>
                <TableCell>KBANK</TableCell>
                <TableCell>123-456-7</TableCell>
                <TableCell>จักรกฤษ อ่อนส้มกฤษ</TableCell>
                <TableCell>0612345678</TableCell>
                <TableCell></TableCell>
              </StyledTableRow>

              <TableRow>
                <TableCell>
                  <Button variant="contained" color="warning">
                    แก้ไข
                  </Button>
                </TableCell>
                <TableCell>
                  <TextField placeholder="ธนาคาร" />
                </TableCell>
                <TableCell>
                  <TextField placeholder="ชื่อบัญชี" />
                </TableCell>
                <TableCell>
                  <TextField placeholder="เลขบัญชี" />
                </TableCell>
                <TableCell>
                  <TextField placeholder="พร้อมเพย์" />
                </TableCell>
              </TableRow>
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
export default BookBank
