import { Link } from 'react-router-dom'
import { checkoutDetail } from '../../../data'

export default function ADCheckout() {
  return (
    <div className=" position-relative">
      <div>
        <h3 className="text-start m-3">
          <Link to="/admin/home" className="  text-decoration-none">
            WE LIVE |
          </Link>{' '}
          <span className="text-success"> เช็คยอดขาย </span>
        </h3>
      </div>
      <div className="card m-3">
        <div className="m-3">
          <div className=" ">
            <h5 className=""> วันที่ </h5>
            <input
              className=" float-start w-25"
              name="expressDate"
              type="date"
            ></input>
          </div>
          <br></br>
          <br></br>
          <div>
            <h5 className=""> เลขพัสดุ </h5>
            <input
              className=" w-25"
              type="expressID"
              placeholder=" ' 21412312 ' "
            ></input>
          </div>
          <div className=" mt-3 mb-3 border-bottom border-2 border-black">
            <button className=" btn btn-sm btn-success m-lg-3 align-content-center">
              {' '}
              ค้นหา
            </button>
            <input type="text"></input>
          </div>
          <table className=" table table-sm">
            <thead className=" table-success text-center">
              <tr>
                <td>#</td>
                <td>OrderID</td>
                <td>วันที่</td>
                <td>ชื่อ Facebook</td>
                <td>เลขพัสดุ</td>
                <td>เวลาเช็คเอ้าท์</td>
                <td>ผู้ใช้งาน</td>
              </tr>
            </thead>
            <tbody className=" table-striped table-group-divider text-center">
              {checkoutDetail.map((checkout, i) => {
                // คำนวณค่า itempr * among - discount

                return (
                  <tr key={checkout.from.id} className=" text-center">
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
        </div>
      </div>
    </div>
  )
}
