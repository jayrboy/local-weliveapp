import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Card,
  CardContent,
  Grid,
  styled,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '../redux/liveSlice'

import Logo from '../assets/logo-192-1.png'
import { FaFacebook } from 'react-icons/fa'

const steps = [
  'เข้าสู่ระบบ Facebook',
  'บัญชีธนาคาร/บริษัทขนส่ง',
  'เพิ่มสินค้า/รายการขาย',
  'Live Video Facebook',
  'เปิดระบบดูด Comments',
]

const stepDetails = [
  'ขั้นตอนนี้คุณจะต้องเข้าสู่ระบบ Facebook เพื่อเชื่อมต่อบัญชี',
  'เพิ่มบัญชีธนาคารหรือเลือกบริษัทขนส่งที่ต้องการ',
  'เพิ่มรายการสินค้าที่คุณต้องการขายในระบบ',
  'เริ่มทำ Live Video ขายสินค้าผ่าน Facebook Live',
  'เริ่มทำการเปิดระบบดูดข้อความคำสั่งซื้อที่มีรหัสสินค้าตรงกับรายการขายรายวัน ระบบจะสร้างออเดอร์ให้อัตโนมัติ',
]

const Info = () => {
  const [activeStep, setActiveStep] = useState(1)
  const dispatch = useDispatch(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const handleLiveFacebook = () => {
    dispatch(openModal())
  }

  return (
    <Box sx={{ width: '100%', mt: 5 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <img
          src={Logo}
          alt="Usage Instructions"
          style={{ width: '100px', height: '100px', marginBottom: '16px' }}
        />
        <Typography variant="h4" gutterBottom>
          วิธีการใช้งาน
        </Typography>
        <Typography variant="body1">
          นี่คือคำแนะนำเบื้องต้นเกี่ยวกับวิธีการใช้งานระบบของเรา...
        </Typography>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {/* Stepper Section */}
        <Grid item xs={12}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Navigation buttons */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{ mr: 1 }}
              disabled={activeStep === 0}
            >
              ย้อนกลับ
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              ขั้นตอนถัดไป
            </Button>
          </Box>
        </Grid>

        {/* Card Section with Navigate Button */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', margin: 3 }}>
            <CardContent>
              <Typography variant="h6">{steps[activeStep]}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {stepDetails[activeStep]}
              </Typography>

              {/* Navigate Button */}
              <Box sx={{ mt: 2 }}>
                {activeStep === 0 && (
                  <Link to="/auth/login" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">
                      เข้าสู่ระบบ Facebook
                    </Button>
                  </Link>
                )}
                {activeStep === 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Link to="/bookbank" style={{ textDecoration: 'none' }}>
                      <Button variant="contained" color="success">
                        เพิ่มบัญชีธนาคาร
                      </Button>
                    </Link>

                    <Link to="/express" style={{ textDecoration: 'none' }}>
                      <Button variant="contained" color="inherit">
                        กำหนดค่าขนส่ง
                      </Button>
                    </Link>
                  </Box>
                )}
                {activeStep === 2 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Link to="/stock" style={{ textDecoration: 'none' }}>
                      <Button variant="contained" color="success">
                        เพิ่มสินค้า
                      </Button>
                    </Link>

                    <Link to="/sale-daily" style={{ textDecoration: 'none' }}>
                      <Button variant="contained" color="primary">
                        เพิ่มรายการขาย
                      </Button>
                    </Link>
                  </Box>
                )}
                {activeStep === 3 && (
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      type="button"
                      fullWidth={true}
                      startIcon={<FaFacebook size={30} />}
                      style={{
                        backgroundColor: '#1877f2',
                        color: 'white',
                        textTransform: 'capitalize',
                        fontSize: '16px',
                      }}
                    >
                      เริ่ม Live Video
                    </Button>
                  </a>
                )}
                {activeStep === 4 && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleLiveFacebook}
                  >
                    เปิดระบบดูด Comments
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reset or go back to dashboard */}
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        {activeStep === steps.length - 1 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              คุณทำการเรียนรู้ครบทุกขั้นตอนแล้ว!
            </Typography>
            <Button onClick={handleReset} sx={{ mt: 2 }}>
              เริ่มต้นใหม่
            </Button>
          </Box>
        ) : null}

        <Box sx={{ mt: 3 }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <Button variant="text">หน้าหลัก</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default Info
