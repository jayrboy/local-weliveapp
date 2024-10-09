import { Link } from 'react-router-dom'
import { nanoid } from 'nanoid'

import { Grid, Card, CardContent, Typography, Box } from '@mui/material'

// icons
import { MdOutlineTableView, MdManageSearch } from 'react-icons/md'
import { FaListOl, FaSearch } from 'react-icons/fa'
import { TbArrowElbowRight } from 'react-icons/tb'
import { BiSolidBarChartAlt2 } from 'react-icons/bi'
import { IoMdCart } from 'react-icons/io'
import { IoSearchSharp } from 'react-icons/io5'

function Dashboard() {
  const features = [
    {
      id: nanoid(),
      title: 'สินค้า',
      link: '/stock',
      icon: <MdOutlineTableView size={75} />,
    },
    {
      id: nanoid(),
      title: 'ขาย',
      link: '/sale-daily',
      icon: <IoMdCart size={75} />,
    },
    {
      id: nanoid(),
      title: 'รายการสั่งซื้อ',
      link: '/order',
      icon: <FaListOl size={75} />,
    },
    {
      id: nanoid(),
      title: 'ค้นหารายการสั่งซื้อ',
      link: '/order/search',
      icon: <MdManageSearch size={75} />,
    },
    // {
    //   id: nanoid(),
    //   title: 'เช็คยอด',
    //   link: '/sales',
    //   icon: <TbArrowElbowRight size={75} color="#555555" />,
    // },
    // {
    //   id: nanoid(),
    //   title: 'รายงานสรุปยอด',
    //   link: '/analysis',
    //   icon: <BiSolidBarChartAlt2 size={75} color="#555555" />,
    // },
  ]

  return (
    <Box className="m-3 mt-3">
      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid key={feature.id} item xs={6} sm={6} md={6} lg={6}>
            <Card
              className="card d-flex justify-content-center"
              style={{ height: '250px' }}
            >
              <Link to={feature.link} className="text-center nav-link">
                {feature.icon}
                <p className="text-center mt-4" style={{ color: '#555555' }}>
                  {feature.title}
                </p>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
export default Dashboard
