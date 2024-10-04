import { baseURL } from '../../App'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import InventoryIcon from '@mui/icons-material/Inventory'
import { FaCalendarDay } from 'react-icons/fa'
import { MdCalendarMonth } from 'react-icons/md'
import { GiCalendarHalfYear } from 'react-icons/gi'
import { Line } from 'react-chartjs-2'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { toast } from 'react-toastify'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function ProductGraph() {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [thisData, setThisData] = useState({})
  let [thisDate, setThisDate] = useState({
    day: '',
    month: '',
    year: '',
  })

  const [defaultDate, setDefaultDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  // Set thisDate based on defaultDate
  useEffect(() => {
    const [year, month, day] = defaultDate.split('-')

    setThisDate({
      day: day,
      month: month,
      year: year,
    })
  }, [defaultDate])

  // Fetch data whenever token, id, or thisDate changes
  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        let url = `${baseURL}/api/sale-order/getorderforreport/${id}/${thisDate.day}/${thisDate.month}/${thisDate.year}`
        // console.log(url)

        // Uncomment this code to fetch data
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            console.log('Product Detail:', data)
            setThisData(data)
          })
          .catch((error) => toast.error('There was an error!'))
      }, 100) // หน่วงเวลา 1000 มิลลิวินาที (0.1 วินาที)

      return () => clearTimeout(timer) // Clear the timeout if the component unmounts or dependencies change
    }
  }, [token, id, thisDate]) // Add thisDate to dependencies

  const handleDateChange = (event) => {
    const selectedDate = event.target.value
    setDefaultDate(selectedDate)

    const [year, month, day] = selectedDate.split('-')

    setThisDate({
      day: day,
      month: month,
      year: year,
    })
  }

  const chartData = {
    labels: thisData.last30Days || [],
    datasets: [
      {
        label: 'Daily Sales',
        data: thisData.dailySalesData || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `ยอดขายของ ${thisData.productName} 30 วันหลังสุด`,
      },
    },
  }

  return (
    <React.Fragment>
      {thisData.dailySalesData && (
        <div className="d-flex justify-content-center mt-5">
          <br />
          <br />

          <List
            sx={{
              width: '100%',
              maxWidth: 250,
              bgcolor: 'background.paper',
              borderRadius: '30px',
              marginLeft: '30px',
              marginRight: '30px',
            }}
          >
            <div className="container text-center">
              <p className="text-center">รายงานการขายสินค้า</p>
              <label>วันที่จะดูข้อมูล</label>
              <br />
              <input
                aria-label="เลือกวันที่จะดูข้อมูล"
                type="date"
                value={defaultDate}
                onChange={handleDateChange}
              />
            </div>

            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <ShowChartIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="ยอดขายรวมทั้งหมด"
                secondary={thisData.totalPrice}
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <MonetizationOnIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="กำไร/ขาดทุน" secondary={thisData.profit} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FaCalendarDay />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="วันนี้" secondary={thisData.dailySales} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <MdCalendarMonth />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="เดือนนี้"
                secondary={thisData.monthlySales}
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <GiCalendarHalfYear />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="ปีนี้" secondary={thisData.yearlySales} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <InventoryIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="จำนวน"
                secondary={thisData.totalQuantity}
              />
            </ListItem>
          </List>

          <div style={{ width: '80%', marginTop: '20px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
