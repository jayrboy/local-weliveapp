import { Link } from 'react-router-dom'
import { Chart as ChartJS, defaults } from 'chart.js/auto'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'

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
  // console.log(products)

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
    failed: orders.filter((order) => order.isDelete).length,
  }

  // ข้อมูลสำหรับแสดงกราฟ
  const sourceData = [
    { label: 'สำเร็จ', value: statusCount.completed },
    { label: 'รอดำเนินการ', value: statusCount.pending },
    { label: 'ไม่สำเร็จ', value: statusCount.failed },
  ]

  return (
    <>
      <div className="bg-chartjs mt-3">
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
                    'rgba(43, 63, 229, 0.8)',
                    'rgba(250, 192, 19, 0.8)',
                    'rgba(253, 135, 135, 0.8)',
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
                    'rgba(43, 63, 229, 0.8)',
                    'rgba(250, 192, 19, 0.8)',
                    'rgba(253, 135, 135, 0.8)',
                  ],
                  borderColor: [
                    'rgba(43, 63, 229, 0.8)',
                    'rgba(250, 192, 19, 0.8)',
                    'rgba(253, 135, 135, 0.8)',
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
