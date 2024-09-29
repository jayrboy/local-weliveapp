import { Link } from 'react-router-dom'
import { checkoutDetail } from '../../data'
import { MdGrid3X3 } from 'react-icons/md'

export default function SaleOrderCheckout() {
  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>{' '}
            <span className="text-success"> Checkout</span>
          </h3>
        </div>
      </div>

      <form>
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-grid justify-content-between mb-2">
              <label>วันที่</label>
              <input
                className="form-control form-control-sm"
                name="expressDate"
                type="date"
                style={{ width: '150px' }}
              />
            </div>

            <div className="col-md-6 d-grid justify-content-between mb-2">
              <h5 className=""> เลขพัสดุ </h5>
              <input
                className="form-control form-control-sm"
                type="expressID"
                placeholder=" ' 21412312 ' "
                style={{ width: '150px' }}
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-sm btn-success">ค้นหา</button>
            </div>
          </div>
        </div>
      </form>
      <table className="table table-sm table-striped text-center table-bordered border-light">
        <thead className="table-light">
          <tr>
            <th>
              <MdGrid3X3 />
            </th>
            <th>Otherth</th>
            <th>วันที่</th>
            <th>ชื่อ Facebook</th>
            <th>เลขพัสดุ</th>
            <th>เวลาเช็คเอ้าท์</th>
            <th>ผู้ใช้งาน</th>
          </tr>
        </thead>
        <tbody>
          {checkoutDetail.map((checkout, i) => {
            // คำนวณค่า itempr * among - discount

            return (
              <tr key={checkout.from.id}>
                <td>{i + 1}</td>
                <td>{checkout.from.OrderID}</td>
                <td>{checkout.from.Date}</td>
                <td>{checkout.from.FBName}</td>
                <td>{checkout.from.ExpressID}</td>
                <td>{checkout.from.CheckOutTime}</td>
                <td>{checkout.from.WhoCheckOut}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/dashboard" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
