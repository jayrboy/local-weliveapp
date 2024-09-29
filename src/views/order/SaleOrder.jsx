import { useState } from 'react'
import { Link } from 'react-router-dom'

import { historySale } from '../../data'

export default function SaleOrder() {
  let [data, setData] = useState(historySale)

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="  text-decoration-none">
              WE LIVE |
            </Link>
            <span className="text-success"> เช็คยอดขาย </span>
          </h3>
        </div>
      </div>

      <table className="table table-sm table-striped text-center table-bordered border-light caption-top">
        <caption className="ms-3">
          <div className="d-flex">
            <input
              type="date"
              className="form-control form-control-sm"
              style={{ width: '150px' }}
            />
            <button className="btn btn-sm btn-outline-primary ms-3">
              ค้นหา
            </button>
          </div>
        </caption>
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>วันที่</th>
            <th>ออเดอร์</th>
            <th>จำนวนขาย</th>
            <th>ยอดขาย</th>
            <th>ค่าส่ง</th>
            <th>ส่งแล้ว/ยังไม่ส่ง</th>
            <th>ยอดเงินโอนแล้ว/ยังไม่โอน</th>
            <th className=" text-center">ยอดขาย</th>
            <th>ต้นทุน</th>
            <th>ค่าส่ง</th>
            <th>กำไร</th>
          </tr>
        </thead>
        <tbody>
          {data.map((h, i) => {
            // คำนวณค่า itempr * among - discount
            return (
              <tr key={h.id}>
                <td className=" text-center">{i + 1}</td>
                <td className=" text-center">{h.from.HSdate}</td>
                <td className=" text-center">{h.from.HSorder} ออเดอร์</td>
                <td className=" text-center">{h.from.HSamount} ชื้น</td>
                <td className=" text-center">{h.from.HSsum}</td>
                <td className=" text-center">{h.from.HSexcost}</td>
                <td className=" text-center">
                  {h.from.expresed / h.from.Nexpresed}
                </td>
                <td className=" text-center">{h.from.payed / h.from.Npayed}</td>
                <td className=" text-center">{h.from.HSprice} ฿</td>
                <td className=" text-center">{h.from.cost} ฿</td>
                <td className=" text-center">{h.from.HSexcost} ฿</td>
                <td className=" text-center">{h.from.profit} ฿</td>
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
