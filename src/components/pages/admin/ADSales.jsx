import { Link } from 'react-router-dom'
import { historySale } from '../../../data'

export default function ADSales() {
  return (
    <>
      <div className="m-2 row-cols-auto">
        <h3 className="text-start">
          <Link to="/admin/home" className="  text-decoration-none">
            WE LIVE |
          </Link>{' '}
          <span className="text-success"> เช็คยอดขาย </span>
        </h3>
      </div>
      <div className="card mt-3 ms-3">
        <form className=" position-relative m-3">
          <div className="ms-3">
            <span>วันที่ : </span>
            <input type="date" className=" rounded ms-1"></input>
            <button className="btn btn-sm btn-success mt-3 ms-3 mb-3">
              {' '}
              ค้นหา{' '}
            </button>
          </div>

          <div className="">
            <div>
              <table className=" table table-sm ">
                <thead className=" table-success ">
                  <tr>
                    <th className=" text-center ">#</th>
                    <th className=" text-center ">วันที่</th>

                    <th className=" text-center ">ออเดอร์</th>
                    <th className=" text-center ">จำนวนขาย</th>
                    <th className=" text-center ">ยอดขาย</th>
                    <th className=" text-center ">ค่าส่ง</th>
                    <th className=" text-center ">ส่งแล้ว/ยังไม่ส่ง</th>
                    <th className=" text-center ">ยอดเงินโอนแล้ว/ยังไม่โอน</th>
                    <th className=" text-center">ยอดขาย</th>
                    <th className=" text-center ">ต้นทุน</th>
                    <th className=" text-center ">ค่าส่ง</th>
                    <th className=" text-center link-offset-1-hover">กำไร</th>
                  </tr>
                </thead>

                <tbody className=" table-striped text-center">
                  {historySale.map((h, i) => {
                    // คำนวณค่า itempr * among - discount
                    return (
                      <tr key={h.id}>
                        <td className=" text-center">{i + 1}</td>
                        <td className=" text-center">{h.from.HSdate}</td>
                        <td className=" text-center">
                          {h.from.HSorder} ออเดอร์
                        </td>
                        <td className=" text-center">{h.from.HSamount} ชื้น</td>
                        <td className=" text-center">{h.from.HSsum}</td>
                        <td className=" text-center">{h.from.HSexcost}</td>
                        <td className=" text-center">
                          {h.from.expresed / h.from.Nexpresed}
                        </td>
                        <td className=" text-center">
                          {h.from.payed / h.from.Npayed}
                        </td>
                        <td className=" text-center">{h.from.HSprice} ฿</td>
                        <td className=" text-center">{h.from.cost} ฿</td>
                        <td className=" text-center">{h.from.HSexcost} ฿</td>
                        <td className=" text-center">{h.from.profit} ฿</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
