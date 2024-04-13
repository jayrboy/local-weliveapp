import { Link } from 'react-router-dom'
import { nanoid } from 'nanoid'

// icons
import { MdOutlineTableView, MdManageSearch } from 'react-icons/md'
import { FaListOl, FaSearch } from 'react-icons/fa'
import { TbArrowElbowRight } from 'react-icons/tb'
import { BiSolidBarChartAlt2 } from 'react-icons/bi'
import { IoMdCart } from 'react-icons/io'
import { IoSearchSharp } from 'react-icons/io5'

function HomeAdmin() {
  const features = [
    {
      id: nanoid(),
      title: 'ขาย',
      link: '/admin/daily-stock',
      icon: <IoMdCart size={75} color="#555555 " />,
    },
    {
      id: nanoid(),
      title: 'ค้นหารายการสั่งซื้อ',
      link: '/search/order',
      icon: <MdManageSearch size={75} color="#555555 " />,
    },
    {
      id: nanoid(),
      title: 'รายการสั่งซื้อ',
      link: '/order',
      icon: <FaListOl size={75} color="#555555 " />,
    },
    {
      id: nanoid(),
      title: 'สินค้า',
      link: '/admin/stock',
      icon: <MdOutlineTableView size={75} color="#555555" />,
    },
    {
      id: nanoid(),
      title: 'เช็คยอด',
      link: '/admin/sales',
      icon: <TbArrowElbowRight size={75} color="#555555" />,
    },
    {
      id: nanoid(),
      title: 'รายงานสรุปยอด',
      link: '/analysis',
      icon: <BiSolidBarChartAlt2 size={75} color="#555555" />,
    },
  ]

  return (
    <>
      <div className="container mt-3">
        <div className="row mb-3">
          {features.map((feature) => (
            <div key={feature.id} className="col-6 col-md-6 col-lg-6 mb-3">
              <div
                className="card d-flex justify-content-center"
                style={{ background: '#fff', height: '250px' }}
              >
                <Link to={feature.link} className="text-center nav-link">
                  {feature.icon}
                  <p className="text-center mt-4" style={{ color: '#555555' }}>
                    {feature.title}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default HomeAdmin
