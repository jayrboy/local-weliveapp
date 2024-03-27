import { Link } from 'react-router-dom'

// icons
import { FaRegMap } from 'react-icons/fa6'
import { FaSearchDollar } from 'react-icons/fa'
import { FaList } from 'react-icons/fa'
import { TbArrowElbowRight } from 'react-icons/tb'

export default function HomeAdmin() {
  let firstRow = (
    <div className="row mb-3">
      <div className="col-sm-12 col-md-6 mb-3">
        <div
          className="card d-flex justify-content-center"
          style={{ background: '#fff', height: '200px' }}
        >
          <Link to="/admin/stock" className="text-center">
            <FaRegMap size={75} color="#555555 " />
          </Link>
          <p className="text-center">คลังสินค้า</p>
        </div>
      </div>
      <div className="col-sm-12 col-md-6">
        <div
          className="card d-flex justify-content-center"
          style={{ background: '#fff', height: '200px' }}
        >
          <Link to="/search/by-order" className="text-center">
            <FaSearchDollar size={75} color="#555555 " />
          </Link>
          <p className="text-center">ค้นหารายการสั่งซื้อ</p>
        </div>
      </div>
    </div>
  )

  let secondRow = (
    <div className="row mb-3">
      <div className="col-sm-12 col-md-6 mb-3">
        <div
          className="card d-flex justify-content-center"
          style={{ background: '#fff', height: '200px' }}
        >
          <Link to="/search/by-order" className="text-center">
            <FaList size={75} color="#555555 " />
          </Link>
          <p className="text-center">รายการสั่งซื้อ</p>
        </div>
      </div>
      <div className="col-sm-12 col-md-6">
        <div
          className="card d-flex justify-content-center"
          style={{ background: '#fff', height: '200px' }}
        >
          <Link to="/admin/sales" className="text-center">
            <TbArrowElbowRight size={75} color="#555555 " />
          </Link>
          <p className="text-center">เช็คยอด</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mt-3 my-2">
      {firstRow}
      {secondRow}
      <br />
      <br />
    </div>
  )
}
