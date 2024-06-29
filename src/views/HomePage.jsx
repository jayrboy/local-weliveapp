import React from 'react'
import projectImage from '../assets/dashboard-logo.png'
import { Container, Card, Typography, Badge, Box, Grid } from '@mui/material'

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <div
        className="p-5"
        style={{ background: 'linear-gradient(to bottom, #EDE7F6, #ffffff)' }}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6} textAlign="center">
            <Typography variant="h4" component="div" gutterBottom>
              <strong>Web Application</strong>
              <Badge badgeContent="Live" color="secondary" sx={{ ml: 2 }} />
            </Typography>
            <Typography variant="body1" align="justify">
              เว็บแอปพลิเคชันเพื่อช่วยส่งเสริมผู้ประการทำการขายสินค้าออนไลน์
              ผ่านทางไลฟ์สดบน Facebook
              ที่จะสามารถช่วยให้ผู้ประกอบการจัดการระบบสต็อกสินค้าในการขายในการไลฟ์สด
              Facebook ในแต่ละครั้ง ระบบจะจัดการออเดอร์ให้อัตโนมัติ
              เมื่อลูกค้าส่งคอมเมนท์สั่งสินค้าขณะขายสินค้าทางไลฟ์สดบน Facebook
              ระบบจะดำเนินการสร้างใบคำสั่งซื้อ
              ไปที่หน้าเว็บแอปพลิเคชันเพื่อให้พ่อค้าแม่ค้าออนไลน์และลูกค้าสามารถตรวจสอบสินค้าได้ทันที
              และระบบสามารถช่วยให้ผู้ประกอบการลดขั้นตอนในการจัดการต่างๆ
              ด้วยตนเองได้หลังจบไลฟ์สด
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Image Column */}
            <img
              src={projectImage}
              alt="Project"
              style={{ maxWidth: '100%', borderRadius: '8px' }}
            />
          </Grid>
        </Grid>
      </div>

      {/* Main Content */}
      <div className="p-5" style={{ backgroundColor: '#f0f0f0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <strong>ระบบจัดการสต็อก</strong>
                </Typography>
                <Typography>
                  จัดการสินค้า ราคา ต้นทุน สามารถกำหนดให้ขายเกินจำนวนในสต็อกได้
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <strong>ระบบสร้างออเดอร์อัตโนมัติ</strong>
                </Typography>
                <Typography>
                  สร้างรายการคำสั่งซื้อที่ตรงกับโค้ดสินค้าให้อัตโนมัติ
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <strong>ระบบแชทบอท</strong>
                </Typography>
                <Typography>
                  ตอบแชทส่งออเดอร์ผ่าน Messenger ของลูกค้าอัตโนมัติ
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* Sub Content */}
      <div className="p-5" style={{ backgroundColor: 'white' }}>
        <Container maxWidth="sm">
          <Typography variant="h6">
            <strong>กำลังอยู่ในช่วงพัฒนาระบบ</strong>&nbsp;&nbsp;
            <Badge badgeContent="FREE" color="secondary" sx={{ ml: 2 }} />
          </Typography>
          <Typography>
            สามารถเข้าใช้งานระบบโดยเข้าสู่ระบบด้วยบัญชีเฟสบุ๊ก
          </Typography>
        </Container>
      </div>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#EDE7F6',
          color: 'black',
          textAlign: 'center',
        }}
      >
        <Typography variant="body1">
          © {new Date().getFullYear()} WE Live App. All rights reserved.
        </Typography>
      </Box>
    </>
  )
}
