import { Link } from 'react-router-dom'

// icons
import { MdOutlineTableView } from 'react-icons/md'
import { FaSearchDollar, FaList } from 'react-icons/fa'
import { TbArrowElbowRight } from 'react-icons/tb'
import { VscGraph } from 'react-icons/vsc'
import { TbMessageCode } from 'react-icons/tb'

function AdminHome() {
  const features = [
    {
      id: 1,
      title: 'สินค้า',
      link: '/admin/stock',
      icon: <MdOutlineTableView size={75} color="#555555 " />,
    },
    {
      id: 2,
      title: 'ค้นหารายการสั่งซื้อ',
      link: '/search/order',
      icon: <FaSearchDollar size={75} color="#555555 " />,
    },
    {
      id: 3,
      title: 'ขายสินค้ารายวัน',
      link: '/admin/daily-stock',
      icon: <FaList size={75} color="#555555 " />,
    },
    {
      id: 4,
      title: 'คำสั่งซื้อ',
      link: '/order',
      icon: <TbMessageCode size={75} color="#555555 " />,
    },
    {
      id: 5,
      title: 'เช็คยอด',
      link: '/admin/sales',
      icon: <TbArrowElbowRight size={75} color="#555555 " />,
    },
    {
      id: 6,
      title: 'รายงานสรุปยอด',
      link: '/analysis',
      icon: <VscGraph size={75} color="#555555 " />,
    },
  ]

  return (
    <>
      <div className="container mt-3 my-2 mb-5">
        <div className="row mb-3">
          {features.map((feature) => (
            <div key={feature.id} className="col-sm-12 col-md-6 col-lg-6 mb-3">
              <div
                className="card d-flex justify-content-center"
                style={{ background: '#fff', height: '250px' }}
              >
                <Link to={feature.link} className="text-center">
                  {feature.icon}
                </Link>
                <p className="text-center">{feature.title}</p>
              </div>
            </div>
          ))}
        </div>
        <br />
        <br />
      </div>
    </>
  )
}
export default AdminHome
