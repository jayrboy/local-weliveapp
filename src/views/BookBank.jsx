import { baseURL } from '../App'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  createBankAccount,
  updateBankAccount,
  onCreateAccount,
  onCreatedAccount,
  onEditAccount,
  onEditedAccount,
  removeBankAccount,
} from '../redux/userSlice'

import {
  styled,
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TextField,
  Button,
  IconButton,
  Radio,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material'

import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import { ConstructionOutlined } from '@mui/icons-material'
import ListAltIcon from '@mui/icons-material/ListAlt'
import DeleteIcon from '@mui/icons-material/Delete'

import { MdOutlineSearch } from 'react-icons/md'

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
  let { user, isCreateAccount, isEditAccount } = useSelector(
    (state) => state.user
  )

  let [selectedId, setSelectedId] = useState('')
  let [bankData, setBankData] = useState({
    id: '',
    bankID: '',
    bank: '',
    bankName: '',
    promptPay: '',
  })
  let [errors, setErrors] = useState({})

  const token = localStorage.getItem('token')
  let [isCreateBank, setIsCreateBank] = useState(false)

  const banks = [
    { name: 'ธนาคารกรุงเทพ', value: 'BBL' },
    { name: 'ธนาคารกสิกรไทย', value: 'KBANK' },
    { name: 'ธนาคารกรุงไทย', value: 'KTB' },
    { name: 'ธนาคารไทยพาณิชย์', value: 'SCB' },
    { name: 'ธนาคารกรุงศรีอยุธยา', value: 'BAY' },
    { name: 'ธนาคารทหารไทยธนชาต', value: 'TTB' },
    { name: 'ธนาคารออมสิน', value: 'GSB' },
  ]

  useEffect(() => {
    if (isCreateAccount) {
      // console.log('Updated user :', user)

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
          toast.success('บันทึกข้อมูลสำเร็จ')
          dispatch(onCreatedAccount())
        })
        .catch((error) => toast.error('เกิดข้อผิดพลาดในการส่งข้อมูล'))
    }
  }, [user])

  useEffect(() => {
    if (isEditAccount) {
      // console.log('Updated user :', user)

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
          dispatch(onEditedAccount())
        })
        .catch((error) => toast.error('เกิดข้อผิดพลาดในการส่งข้อมูล'))
    }
  }, [user])

  const onClickRadio = (doc) => {
    setIsCreateBank(false) // ปิดฟอร์มหลังจากสร้างบัญชี
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
    dispatch(onEditAccount())
  }

  const onCreateBank = () => {
    const newErrors = {}
    if (!bankData.bank) newErrors.bank = 'กรุณากรอกชื่อธนาคาร'
    if (!bankData.bankName) newErrors.bankName = 'กรุณากรอกชื่อบัญชี'
    if (!bankData.bankID) newErrors.bankID = 'กรุณากรอกเลขบัญชี'
    if (!bankData.promptPay) newErrors.promptPay = 'กรุณากรอกพร้อมเพย์'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return // หยุดการทำงานหากมีข้อผิดพลาด
    }

    setSelectedId('')
    dispatch(createBankAccount(bankData)) // ส่งข้อมูลไปยัง Redux
    setIsCreateBank(false) // ปิดฟอร์มหลังจากสร้างบัญชี
    dispatch(onCreateAccount())
  }

  let showData = (
    <div className="position-relative m-3">
      <div className="d-flex mb-1 justify-content-end mb-2">
        <Button
          variant="contained"
          onClick={() => {
            setIsCreateBank(!isCreateBank)
            setSelectedId('')
          }}
        >
          {isCreateBank ? 'ปิดฟอร์ม' : 'เพิ่มบัญชีใหม่'}
        </Button>
      </div>
      <form>
        <TableContainer component={Paper}>
          <Table>
            <caption className="ms-3">
              <small>พบข้อมูลทั้งหมด {user.bank_account.length} รายการ</small>
            </caption>
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
                {selectedId && (
                  <TableCell>
                    <strong>จัดการ</strong>
                  </TableCell>
                )}
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
                    <TableCell>
                      {selectedId && (
                        <IconButton
                          variant="contained"
                          color="error"
                          onClick={() => {
                            dispatch(removeBankAccount({ id: doc.id }))
                            setSelectedId('')
                            dispatch(onCreateAccount())
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
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
                      {isEditAccount ? 'กำลังบันทึก...' : 'แก้ไข'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {/* <TextField
                      type="text"
                      name="bank"
                      value={bankData.bank}
                      onChange={(e) =>
                        setBankData({ ...bankData, bank: e.target.value })
                      }
                      placeholder="ธนาคาร"
                    /> */}
                    <FormControl fullWidth>
                      <InputLabel id="bank-select-label">เลือกบัญชี</InputLabel>
                      <Select
                        labelId="bank-select-label"
                        id="bank-select"
                        value={bankData.bank || ''}
                        label="เลือกบัญชี"
                        onChange={(e) =>
                          setBankData({ ...bankData, bank: e.target.value })
                        }
                      >
                        {banks.map((b, index) => (
                          <MenuItem key={index} value={b.value}>
                            {b.name} - {b.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
              {isCreateBank && (
                <TableRow>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={onCreateBank}
                    >
                      {isCreateBank ? 'บันทึก' : 'กำลังบันทึก...'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {/* <TextField
                      type="text"
                      name="bank"
                      onChange={(e) =>
                        setBankData({ ...bankData, bank: e.target.value })
                      }
                      placeholder="ธนาคาร"
                      error={Boolean(errors.bank)}
                      helperText={errors.bank}
                    /> */}
                    <FormControl fullWidth>
                      <InputLabel id="bank-select-label">เลือกบัญชี</InputLabel>
                      <Select
                        labelId="bank-select-label"
                        id="bank-select"
                        value={bankData.bank || ''}
                        label="เลือกบัญชี"
                        onChange={(e) =>
                          setBankData({ ...bankData, bank: e.target.value })
                        }
                      >
                        {banks.map((b, index) => (
                          <MenuItem key={index} value={b.value}>
                            {b.name} - {b.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      name="bankName"
                      onChange={(e) =>
                        setBankData({ ...bankData, bankName: e.target.value })
                      }
                      placeholder="ชื่อบัญชี"
                      error={Boolean(errors.bankName)}
                      helperText={errors.bankName}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      name="bankID"
                      onChange={(e) =>
                        setBankData({ ...bankData, bankID: e.target.value })
                      }
                      placeholder="เลขบัญชี"
                      error={Boolean(errors.bankID)}
                      helperText={errors.bankID}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      name="promptPay"
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
