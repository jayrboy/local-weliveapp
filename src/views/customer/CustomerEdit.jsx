import { Checkbox } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined'
import CloseIcon from '@mui/icons-material/Close'

export default function CustomerEdit() {
  const navigate = useNavigate()
  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3>
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>{' '}
            <span className="text-success"> แก้ไขข้อมูลของลูกค้า</span>
          </h3>
        </div>
      </div>

      <div
        className="card shadow rounded mx-auto"
        style={{ width: '400px', background: '#fff' }}
      >
        <span className="card-header d-flex justify-content-between align-items-center">
          <h4>CUSTOMER / แก้ไขข้อมูลลูกค้า</h4>
          <button
            className="btn btn-sm"
            onClick={() => navigate('/search/customer')}
          >
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>
        <form className="p-4">
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
          <div>
            <label className="form-label">สถานะ :</label>
            <small className="text-success">
              <Checkbox />
              ส่งแล้ว
            </small>
            <small className="text-danger">
              <Checkbox />
              ยังไม่ส่ง
            </small>
            <small className="text-warning">
              <Checkbox />
              ไม่โอน/Ban
            </small>
          </div>
          <div className="d-flex justify-content-center mt-2">
            <Link to="/customer/search" className="btn btn-secondary btn-sm">
              กลับหน้าหลัก
            </Link>
            &nbsp;&nbsp;
            <button className="btn btn-outline-success btn-sm">
              พิมพ์ข้อมูลนี้
            </button>
            &nbsp;&nbsp;
            <button className="btn btn-success btn-sm">บันทึกการแก้ไข</button>
          </div>
        </form>
      </div>

      <table className="table table-sm table-striped text-center table-bordered border-light caption-top">
        <caption className="ms-3">
          <small>ประวัติการซื้อขายของลูกค้า</small>
        </caption>
        <thead className="table-light">
          <tr>
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
          <tr>
            <td>run number</td>
            <td>date</td>
            <td>amout</td>
            <td>money</td>
            <td className="ms-3">
              <PlagiarismOutlinedIcon />
            </td>
            <td>
              <PictureAsPdfOutlinedIcon />
            </td>
            <td>
              <LocalPrintshopOutlinedIcon />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
    </>
  )
}
