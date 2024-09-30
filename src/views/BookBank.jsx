import { baseURL } from '../App'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateBankAccount, onLoading, onLoaded } from '../redux/userSlice'

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
import { Button, Radio, TextField } from '@mui/material'
import { ConstructionOutlined } from '@mui/icons-material'
import { toast } from 'react-toastify'

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
  const dispatch = useDispatch()
  let user = useSelector((state) => state.user.user)
  const isLoading = useSelector((state) => state.user.isLoading)

  let [selectedId, setSelectedId] = useState('')
  let [bankData, setBankData] = useState({
    id: '',
    bankID: '',
    bank: '',
    bankName: '',
    promptPay: '',
  })

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (isLoading) {
      console.log('Updated user :', user)

      fetch(`${baseURL}/api/user`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok')
          }
          return res.json()
        })
        .then((data) => {
          toast.success('แก้ไขข้อมูลสำเร็จ')
          dispatch(onLoaded())
        })
        .catch((error) => toast.error('เกิดข้อผิดพลาดในการส่งข้อมูล'))
    }
  }, [user, isLoading])

  const onClickRadio = (doc) => {
    setBankData({
      id: doc.id,
      bankID: doc.bankID,
      bank: doc.bank,
      bankName: doc.bankName,
      promptPay: doc.promptPay,
    })
    setSelectedId(doc.id)
  }

  const onEditBank = () => {
    dispatch(updateBankAccount(bankData))

    setSelectedId('')

    dispatch(onLoading())
  }

  let showData = (
    <div className="position-relative m-3">
      <div className="d-flex mb-1 justify-content-end mb-2">
        <Button variant="contained">เพิ่มบัญชีใหม่</Button>
      </div>
      <form>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {user.bank_account.map((doc) => {
                return (
                  <StyledTableRow key={doc.id}>
                    <TableCell>
                      <Radio
                        color="primary"
                        checked={selectedId === doc.id}
                        onChange={() => onClickRadio(doc)}
                        value={doc.id}
                      />
                    </TableCell>
                    <TableCell>{doc.bank}</TableCell>
                    <TableCell>{doc.bankName}</TableCell>
                    <TableCell>{doc.bankID}</TableCell>
                    <TableCell>{doc.promptPay}</TableCell>
                  </StyledTableRow>
                )
              })}
              {selectedId && (
                <TableRow>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={onEditBank}
                    >
                      {isLoading ? 'กำลังบันทึก...' : 'แก้ไข'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      name="bank"
                      value={bankData.bank}
                      onChange={(e) =>
                        setBankData({ ...bankData, bank: e.target.value })
                      }
                      placeholder="ธนาคาร"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      name="bankName"
                      value={bankData.bankName}
                      onChange={(e) =>
                        setBankData({ ...bankData, bankName: e.target.value })
                      }
                      placeholder="ชื่อบัญชี"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      name="bankID"
                      value={bankData.bankID}
                      onChange={(e) =>
                        setBankData({ ...bankData, bankID: e.target.value })
                      }
                      placeholder="เลขบัญชี"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      name="promptPay"
                      value={bankData.promptPay}
                      onChange={(e) =>
                        setBankData({ ...bankData, promptPay: e.target.value })
                      }
                      placeholder="พร้อมเพย์"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </div>
  )

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
      {showData}
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
