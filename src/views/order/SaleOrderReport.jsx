import { Link } from 'react-router-dom'
import { Chart as ChartJS, defaults } from 'chart.js/auto'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material'

import {
  AttachMoney,
  ShoppingCart,
  BarChart,
  TrendingUp,
} from '@mui/icons-material'

import './chartjs.css'

import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getProducts } from '../../redux/productSlice'

// import revenueData from './revenueData.json'
// import sourceData from './sourceData.json'

defaults.maintainAspectRatio = false
defaults.responsive = true

defaults.plugins.title.display = true
defaults.plugins.title.align = 'start'
defaults.plugins.title.font.size = 20
defaults.plugins.title.color = 'black'

const SaleOrderReport = () => {
  const dispatch = useDispatch()
  let { orders } = useSelector((state) => state.saleOrder)
  let { products } = useSelector((state) => state.product)
  // console.log(orders)
  console.log('Product :', products)

  // สมมติว่าคุณจะรอการโหลดข้อมูลจริง
  const isLoading = false // แทนด้วยสถานะจริงของการโหลด

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  // แปลงข้อมูล orders เป็นข้อมูลสำหรับกราฟรายได้ กรองจากวันที่สร้างของออเดอร์แต่ละรายการ
  const revenueData = orders.map((order) => ({
    label: new Date(order.date_added).toLocaleString('default', {
      month: 'short',
    }),
    revenue: order.orders.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ), // ยอดรวมสินค้าใน order
  }))

  // การนับสถานะของออเดอร์ (สำเร็จ/รอดำเนินการ/ไม่สำเร็จ)
  const statusCount = {
    completed: orders.filter((order) => order.complete).length,
    pending: orders.filter((order) => !order.complete).length,
    inprogress: orders.filter((order) => order.isPayment).length,
    failed: orders.filter((order) => order.isDelete).length,
  }

  // ข้อมูลสำหรับแสดงกราฟ
  const sourceData = [
    { label: 'สำเร็จ', value: statusCount.completed },
    { label: 'รอชำระเงิน', value: statusCount.pending },
    { label: 'จ่ายแล้ว', value: statusCount.inprogress },
    { label: 'ปฎิเสธ', value: statusCount.failed },
  ]

  // สรุปยอดต่างๆ
  // กรองเฉพาะบิลที่ complete: true
  const completedOrders = orders.filter((order) => order.complete)

  // คำนวณยอดรวมต่อบิล
  const totalAmounts = completedOrders.map((order) => {
    return order.orders.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    )
  })

  // คำนวณยอดรวมทั้งหมด
  const totalSum = totalAmounts.reduce((sum, amount) => sum + amount, 0)

  // หาค่าเฉลี่ยต่อบิล
  const averagePerBill = totalSum / completedOrders.length

  // console.log(`ค่าเฉลี่ยต่อบิล: ${averagePerBill}`)

  // (2)
  // คำนวณยอดขายจากสินค้าที่ชำระเงินแล้ว
  const paidRevenue = products.reduce(
    (sum, product) => sum + product.paid * product.price,
    0
  )

  // คำนวณยอดขายรวมของสินค้าทั้งหมด
  const totalRevenue = products.reduce(
    (sum, product) => sum + product.stock_quantity * product.price,
    0
  )

  // คำนวณอัตราการเติบโต
  const growthRate = (paidRevenue / totalRevenue) * 100

  // console.log(`ยอดขายที่ชำระเงินแล้ว: ${paidRevenue}`)
  // console.log(`ยอดขายรวมของสินค้าทั้งหมด: ${totalRevenue}`)
  // console.log(`อัตราการเติบโต: ${growthRate.toFixed(2)}%`)

  return (
    <>
      {growthRate && (
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {/* Card 1: ยอดรวม */}
            <Grid item xs={6} sm={3} md={3}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AttachMoney sx={{ fontSize: 40, color: 'green' }} />
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    ยอดรวม
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      `${
                        totalSum
                          .toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || 0
                      } บาท`
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 2: จำนวนออเดอร์ */}
            <Grid item xs={6} sm={3} md={3}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ShoppingCart sx={{ fontSize: 40, color: 'blue' }} />
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    จำนวนออเดอร์
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      `${orders.length || 0} ออเดอร์`
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 3: ค่าเฉลี่ย/บิล */}
            <Grid item xs={6} sm={3} md={3}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <BarChart sx={{ fontSize: 40, color: 'orange' }} />
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    ค่าเฉลี่ย/บิล
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      `${
                        averagePerBill
                          .toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || 0
                      } บาท`
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 4: รายได้เติบโต */}
            <Grid item xs={6} sm={3} md={3}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'purple' }} />
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    รายได้เติบโต
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      `${growthRate.toFixed(2) || 0}%`
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      <div className="bg-chartjs">
        {/* กราฟแสดงรายได้ */}
        <div className="dataCard revenueCard">
          <Line
            data={{
              labels: revenueData.map((data) => data.label),
              datasets: [
                {
                  label: 'รายได้',
                  data: revenueData.map((data) => data.revenue),
                  backgroundColor: '#064FF0',
                  borderColor: '#064FF0',
                },
                // {
                //   label: 'ยอดขาย',
                //   data: revenueData.map((data) => data.cost),
                //   backgroundColor: '#FF3030',
                //   borderColor: '#FF3030',
                // },
              ],
            }}
            options={{
              elements: {
                line: {
                  tension: 0.5,
                },
              },
              plugins: {
                title: {
                  text: `รายงานยอดรายได้จากใบสั่งซื้อสินค้า ปี ${new Date().getFullYear()}`,
                },
              },
            }}
          />
        </div>

        {/* กราฟแสดงสถานะออเดอร์ */}
        <div className="dataCard customerCard">
          <Bar
            data={{
              labels: sourceData.map((data) => data.label),
              datasets: [
                {
                  label: 'สำเร็จ',
                  data: sourceData.map((data) => data.value),
                  backgroundColor: [
                    'rgba(11, 156, 49, 0.8)',
                    'rgba(250, 192, 19, 0.8)',
                    'rgba(43, 63, 229, 0.8)',
                    'rgba(255, 0, 0, 0.8)',
                  ],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: 'รายงานสถานะใบสั่งซื้อ',
                },
              },
            }}
          />
        </div>

        {/* กราฟแสดงสินค้าในสต็อก */}
        <div className="dataCard orderCard">
          <Doughnut
            data={{
              labels: sourceData.map((data) => data.label),
              datasets: [
                {
                  label: 'จำนวนสินค้าในสต็อก',
                  data: sourceData.map((data) => data.value),
                  backgroundColor: [
                    'rgba(11, 156, 49, 0.8)',
                    'rgba(250, 192, 19, 0.8)',
                    'rgba(43, 63, 229, 0.8)',
                    'rgba(255, 0, 0, 0.8)',
                  ],
                  borderColor: [
                    'rgba(11, 156, 49, 0.8)',
                    'rgba(250, 192, 19, 0.8)',
                    'rgba(43, 63, 229, 0.8)',
                    'rgba(255, 0, 0, 0.8)',
                  ],
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: 'สรุปใบสั่งซื้อ',
                },
              },
            }}
          />
        </div>
      </div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/admin/home" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
export default SaleOrderReport
