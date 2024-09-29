import { Link } from 'react-router-dom'
import { Chart as ChartJS, defaults } from 'chart.js/auto'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'

import './chartjs.css'

import revenueData from './revenueData.json'
import sourceData from './sourceData.json'

defaults.maintainAspectRatio = false
defaults.responsive = true

defaults.plugins.title.display = true
defaults.plugins.title.align = 'start'
defaults.plugins.title.font.size = 20
defaults.plugins.title.color = 'black'

const SaleOrderReport = () => {
  return (
    <>
      <div className="bg-chartjs mt-3">
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
                {
                  label: 'รายจ่าย',
                  data: revenueData.map((data) => data.cost),
                  backgroundColor: '#FF3030',
                  borderColor: '#FF3030',
                },
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
                  text: 'รายได้และค่าใช้จ่ายรายเดือน (Line Chart)',
                },
              },
            }}
          />
        </div>

        <div className="dataCard customerCard">
          <Bar
            data={{
              labels: sourceData.map((data) => data.label),
              datasets: [
                {
                  label: 'Count',
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
                  text: 'รายได้ (Bar Chart)',
                },
              },
            }}
          />
        </div>

        <div className="dataCard orderCard">
          <Doughnut
            data={{
              labels: sourceData.map((data) => data.label),
              datasets: [
                {
                  label: 'Count',
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
                  text: 'รายได้ (Doughnut Chart)',
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
