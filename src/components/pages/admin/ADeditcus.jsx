import { Checkbox } from '@mui/material'
import { Link } from 'react-router-dom'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined'

export default function ADeditcus() {
  return (
    <div className=" container">
      <div className="m-2">
        <h3>
          <Link to="/admin/home" className="  text-decoration-none">
            WE LIVE |
          </Link>{' '}
          <span className=" text-danger"> แก้ไขข้อมูลของลูกค้า </span>
        </h3>
      </div>
      <div
        className=" position-relative card mt-5 p-4 m-auto "
        style={{ width: '500' }}
      >
        <form className=" row justify-content-md-center">
          <label className="form-label">ชื่อ</label>
          <input
            type="text"
            placeholder=" ' JASDAKORN KHUMDEJ ' "
            name="fbname"
            className="form-control form-control-sm"
            required
          />
          <br />
          <label className="form-label">ชื่อลูกค้า</label>
          <input
            type="text"
            name="name"
            placeholder="' เจษฎากร คุ้มเดช '"
            className="form-control form-control-sm"
            required
          />
          <br />
          <label className="form-label">ที่อยู่</label>
          <textarea
            type="text"
            name="Hnumber"
            placeholder="' 12/345 ม.1 '"
            min="0"
            className="form-control form-control-sm"
            required
          />
          <br />
          <label className="form-label">ตำบล</label>
          <input
            type="text"
            name="tb"
            min="0"
            placeholder="' จอมพล , จตุจักร '"
            className="form-control form-control-sm"
            required
          />
          <br />
          <label className="form-label">จังหวัด</label>
          <input
            type="text"
            name="jw"
            placeholder="' กรุงเทพ '"
            min="0"
            className="form-control form-control-sm"
            required
          />
          <br />
          <label className="form-label">รหัสไปรษณีย์</label>
          <input
            type="text"
            name="postID"
            placeholder="' 10900 '"
            min="0"
            className="form-control form-control-sm"
          />
          <br />
          <label className="form-label">โทรศัพท์</label>
          <input
            type="number"
            name="phoneNumber"
            placeholder="' 0619799148 '"
            className="form-control form-control-sm"
            required
          />
          <br />
          <label className="form-label">เลขที่บัญชีของลูกค้า</label>
          <input
            type="number"
            name="bankNumber"
            placeholder="'KBANK 044-556677-8 '"
            className="form-control form-control-sm"
            required
          />
          <br />
          <label className="form-label">เลขที่เสียภาษีของลูกค้า</label>
          <input
            type="number"
            name="bankNumber"
            placeholder="'1-2345-678-9'"
            className="form-control form-control-sm"
            required
          />
          <br />
          <label className="form-label">สถานะ</label>
          <div className="ms-2">
            <span className="text-success">
              <Checkbox /> ส่งแล้ว
            </span>
            <span className=" ms-2 text-danger">
              <Checkbox /> ยังไม่ส่ง
            </span>
            <span className=" ms-2 text-warning">
              <Checkbox /> ไม่โอน/ใส่แบล็คลิสต์
            </span>
          </div>

          <br />
          <div className="d-flex justify-content-center">
            <button className="btn btn-success btn-sm">บันทึกการแก้ไข</button>
            <button className="btn btn-outline-success btn-sm ms-5 ">
              พิมพ์ข้อมูลนี้
            </button>
            <a href="/db/adminsearch" className="btn btn-primary btn-sm ms-5">
              กลับหน้าหลัก
            </a>
          </div>
        </form>
      </div>
      <br />

      <div className="card justify-content-center bg-white mt-3 ">
        <div className=" border-success border border-3 boer">
          <div className="m-3 border-gray border-bottom ">
            <h5>ประวัติการซื้อขายของลูกค้า</h5>
          </div>
          <table className=" table mt-3 table-striped">
            <thead className=" table-success border-bottom border-bottom-5 ">
              <tr className=" text-center">
                <th>#</th>
                <th>วันที่</th>
                <th>จำนวน</th>
                <th>จำนวนเงิน</th>
                <th className="ms-3">action 1</th>
                <th>action 2</th>
                <th>action 3</th>
              </tr>
            </thead>
            <tbody>
              <tr className=" text-center">
                <th>run number</th>
                <th>date</th>
                <th>amout</th>
                <th>money</th>
                <th className="ms-3">
                  <PlagiarismOutlinedIcon />
                </th>
                <th>
                  <PictureAsPdfOutlinedIcon />
                </th>
                <th>
                  <LocalPrintshopOutlinedIcon />
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
