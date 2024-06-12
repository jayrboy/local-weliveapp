import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { baseURL } from '../../../../App'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

export default function CustomerByOrder() {
  const { id } = useParams()
  const [alldata, setalldata] = useState([])
  const token = localStorage.getItem('token')
  const [formData, setFormData] = useState({
    picture_payment: '',
    address: '',
    sub_district: '',
    sub_area: '',
    district: '',
    postcode: '',
    tel: '',
    date_added: '',
    _id: id,
  })

  useEffect(() => {
    const fetchSaleOrder = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/sale-order/read/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setalldata(response.data)
      } catch (error) {
        console.error('There was an error!', error)
      }
    }

    if (token) {
      fetchSaleOrder()
    }
  }, [token, id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      picture_payment: e.target.files[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    formDataToSend.append('picture_payment', formData.picture_payment)
    formDataToSend.append('address', formData.address)
    formDataToSend.append('sub_district', formData.sub_district)
    formDataToSend.append('sub_area', formData.sub_area)
    formDataToSend.append('district', formData.district)
    formDataToSend.append('postcode', formData.postcode)
    formDataToSend.append('tel', formData.tel)
    formDataToSend.append('date_added', formData.date_added)
    formDataToSend.append('_id', formData._id)

    try {
      const response = await axios.put(
        `${baseURL}/api/sale-order`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      return response.data
    } catch (error) {
      console.error('There was an error!', error)
    }
  }

  return (
    <div className="container position-relative mt-3 mx-auto">
      <h3 className="text-start mb-3">
        <span>We Live App</span>
        <span className="text-success ms-2">| รายการสั่งซื้อ </span>
      </h3>
      <div className="card shadow">
        <div className="text-center">
          <br />
          <span> Order :</span>
          <span className="text-danger">#{id}</span> <br />
          --------------------------------------------
          <br />
          <br />
          พร้อมเพย์ 012-345-6789
          <br />
          KBANK 012-345-6789
          <br />
          ชื่อบัญชี นายเจษฎากร คุ้มเดช
          <br />
          <br />
          --------------------------------------------
          <br />
          🙏 รบกวนขอความกรุณาลูกค้า 💢 โอนยอดบิลต่อบิลนะคะ
          แล้วค่อยเอฟใหม่ได้คะ💢
          <br /> 💢หากมียอดค้างหักลบยอดเอง โอนได้เลยคะ
          รบกวนแนบรูปยอดค้างไว้ได้เลยคะ ขอบคุณมากค่ะ🙏
          <br /> 🙏 ถ้าสินค้ามีตำหนิกรุณารีบแจ้ง รับเปลี่ยน
          หรือคืนสินค้ามีตำหนิจากร้าน ส่งผิดสีผิดแบบ ผิดไซส์ เท่านั้นคะ
          ขอบพระคุณมากคะ🙏
          <br />
          <br />
        </div>
      </div>
      <div className="mt-4">
        <Paper elevation={3} className="p-4">
          <Typography variant="h6" gutterBottom>
            แบบฟอร์มสำหรับกรอกข้อมูล
          </Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  name="date_added"
                  value={formData.date_added}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ที่อยู่"
                  fullWidth
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="ตำบล"
                  fullWidth
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="อำเภอ"
                  fullWidth
                  name="sub_area"
                  value={formData.sub_area}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="จังหวัด"
                  fullWidth
                  name="sub_district"
                  value={formData.sub_district}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="รหัสไปรษณีย์"
                  fullWidth
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="เบอร์โทรศัพท์"
                  fullWidth
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    color="warning"
                    component="span"
                    className="m-lg-2"
                  >
                    อัปโหลดรูปภาพ
                  </Button>
                  {formData.picture_payment && formData.picture_payment.name}
                </label>
              </Grid>
              <Grid item xs={4}>
                <Button type="submit" variant="contained" color="primary">
                  ยืนยันการชำระเงิน
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>
    </div>
  )
}
