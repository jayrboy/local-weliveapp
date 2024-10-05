import { baseURL } from '../App'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  Typography,
} from '@mui/material'

import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import { ConstructionOutlined } from '@mui/icons-material'
import ListAltIcon from '@mui/icons-material/ListAlt'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch'

import { MdOutlineSearch } from 'react-icons/md'
import { MdGrid3X3 } from 'react-icons/md'

import promptPayImg from '../assets/promptPay.jpg'

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
  const navigator = useNavigate()

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
    qrCode: '',
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

  //! Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size
      if (file.size > 500 * 1024) {
        // 500 KB
        toast.warning('ไฟล์ต้องมีขนาดไม่เกิน 500 KB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setBankData((prevData) => ({
          ...prevData,
          qrCode: reader.result, // Set image as Base64
        }))
      }
      reader.readAsDataURL(file) // Read the file as Data URL
    }
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

  const onClickRadio = (doc) => {
    setIsCreateBank(false) // ปิดฟอร์มหลังจากสร้างบัญชี
    setBankData({
      id: doc.id,
      bankID: doc.bankID,
      bank: doc.bank,
      bankName: doc.bankName,
      promptPay: doc.promptPay,
      qrCode: doc.qrCode,
    })
    setSelectedId(doc.id)
  }

  const onEditBank = () => {
    dispatch(updateBankAccount(bankData))
    setSelectedId('')
    dispatch(onEditAccount())
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
                  <strong>
                    <MdGrid3X3 />
                  </strong>
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
                <TableCell>
                  <strong>QR Code</strong>
                </TableCell>
                {(selectedId || isCreateBank) && (
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
                    <TableCell>
                      <Typography noWrap>{doc.bankName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap>{doc.bankID}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap>{doc.promptPay}</Typography>
                    </TableCell>
                    <TableCell>
                      <img
                        src={doc.qrCode}
                        alt=""
                        style={{
                          height: '100px', // ความสูงปรับตามสัดส่วน
                          objectFit: 'cover', // ปรับการแสดงผลของรูปภาพ
                        }}
                      />
                    </TableCell>
                    {(selectedId || isCreateBank) && (
                      <TableCell>
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
                      </TableCell>
                    )}
                  </StyledTableRow>
                )
              })}

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

                  <TableCell>
                    <img
                      src={bankData.qrCode}
                      style={{
                        height: '100px', // ความสูงปรับตามสัดส่วน
                        objectFit: 'cover', // ปรับการแสดงผลของรูปภาพ
                      }}
                    />
                  </TableCell>

                  {isCreateBank && (
                    <TableCell>
                      <input
                        accept="image/*"
                        id="upload-button-file"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                      />
                      <label htmlFor="upload-button-file">
                        <Button
                          variant="contained"
                          component="span"
                          color="inherit"
                        >
                          Upload
                        </Button>
                      </label>
                    </TableCell>
                  )}
                </TableRow>
              )}

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

                  <TableCell>
                    <img
                      src={bankData.qrCode}
                      style={{
                        height: '100px', // ความสูงปรับตามสัดส่วน
                        objectFit: 'cover', // ปรับการแสดงผลของรูปภาพ
                      }}
                    />
                  </TableCell>

                  {selectedId && (
                    <TableCell>
                      <input
                        accept="image/*"
                        id="upload-button-file"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                      />
                      <label htmlFor="upload-button-file">
                        <Button
                          variant="contained"
                          component="span"
                          color="inherit"
                        >
                          {bankData.qrCode ? 'Reupload' : 'Upload'}
                        </Button>
                      </label>
                    </TableCell>
                  )}
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
