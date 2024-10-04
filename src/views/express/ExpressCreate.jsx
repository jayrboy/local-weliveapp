import { baseURL } from '../../App'
import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  TextField,
  FormHelperText,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

export default function ExpressCreate() {
  const form = useRef()
  const navigate = useNavigate()

  const [selectedExpress, setSelectedExpress] = useState('')
  const [selectedUrl, setSelectedUrl] = useState('')
  const [errors, setErrors] = useState({})

  const expressList = [
    {
      value: 'ไปรษณีย์ไทย',
      url: 'https://track.thailandpost.co.th/',
    },
    {
      value: 'KERRY',
      url: 'https://th.kerryexpress.com/th/track/?spm=a2o7e.lsc-im.0.0.2c6628f5ii8zFd&track=KERPU070489109',
    },
    {
      value: 'FLASH',
      url: 'https://www.flashexpress.co.th/fle/tracking?se=TH20015CSHZ95E',
    },
    {
      value: 'J&T',
      url: 'https://www.jtexpress.co.th/service/track',
    },
    { value: 'DHL', url: 'https://www.dhl.com/th-th/home/tracking.html' },
  ]

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    const selectedExpressItem = expressList.find(
      (express) => express.value === selectedValue
    )
    setSelectedExpress(selectedValue)
    setSelectedUrl(selectedExpressItem?.url || '')
    setErrors((prev) => ({ ...prev, selectedExpress: '' })) // clear error
  }

  const validateForm = (formData) => {
    let tempErrors = {}
    if (!selectedExpress) tempErrors.selectedExpress = 'กรุณาเลือกชื่อขนส่ง'
    if (!formData.get('fprice')) tempErrors.fprice = 'กรุณากรอกค่าส่งเริ่มต้น'
    return tempErrors
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    formData.append('exname', selectedExpress)
    formData.append('expressUrl', selectedUrl)

    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const formEnt = Object.fromEntries(formData.entries())
    console.log(formEnt)

    fetch(`${baseURL}/api/ex/create`, {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((result) => {
        if (result === 'true') {
          form.current.reset()
          toast.success('ข้อมูลถูกจัดเก็บแล้ว')
        } else {
          toast.error('เกิดข้อผิดพลาด ข้อมูลไม่ถูกบันทึก')
        }
        navigate('/express')
      })
      .catch((e) => toast.error(e))
  }

  return (
    <>
      <div
        className="card shadow mx-auto rounded mt-4"
        style={{ width: '400px', background: '#fff' }}
      >
        <span className="card-header d-flex justify-content-between align-items-center p-3">
          <h4>Express / เพิ่มขนส่ง</h4>
          <button className="btn btn-sm" onClick={() => navigate('/express')}>
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>
        <form onSubmit={onSubmitForm} ref={form} className="p-4">
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.selectedExpress}
          >
            <InputLabel id="express-name-select-label">ชื่อขนส่ง</InputLabel>
            <Select
              labelId="express-name-select-label"
              label="ชื่อขนส่ง"
              id="express-name-select"
              value={selectedExpress}
              onChange={handleSelectChange}
            >
              {expressList.map((express) => (
                <MenuItem key={express.value} value={express.value}>
                  {express.value}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedExpress && (
              <FormHelperText>{errors.selectedExpress}</FormHelperText>
            )}
          </FormControl>

          <TextField
            name="fprice"
            label="ค่าส่งเริ่มต้น"
            type="number"
            fullWidth
            margin="normal"
            error={!!errors.fprice}
            helperText={errors.fprice}
          />

          {/* <TextField
            name="sprice"
            label="ค่าส่งชิ้นต่อไป"
            type="number"
            fullWidth
            margin="normal"
          />

          <TextField
            name="maxprice"
            label="ค่าส่งสูงสุด"
            type="number"
            fullWidth
            margin="normal"
          />

          <TextField
            name="whenfprice"
            label="ส่งฟรีต่อเมื่อยอดถึง"
            type="number"
            fullWidth
            margin="normal"
          />

          <TextField
            name="selectcod"
            label="ค่าส่งเพิ่มเติมกรณี CODE"
            type="text"
            fullWidth
            margin="normal"
          /> */}

          <TextField
            name="date_start"
            label="วันที่เริ่มต้น"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            margin="normal"
          />

          <div className="d-flex justify-content-center">
            <Button onClick={() => navigate('/express')}>ยกเลิก</Button>
            &nbsp;&nbsp;&nbsp;
            <Button variant="contained" color="primary" type="submit">
              เพิ่มขนส่ง
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
