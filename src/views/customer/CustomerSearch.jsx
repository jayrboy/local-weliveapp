import { Link } from 'react-router-dom'
import { MdOutlineSearch } from 'react-icons/md'

export default function CustomerSearch() {
  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>
            <span className="text-success"> ค้นหาลูกค้า</span>
          </h3>
        </div>
      </div>

      <form>
        <div className="container">
          <div className="row">
            <div className="col-md-3 mb-2 d-grid justify-content-between">
              <label>ชื่อ</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="JASDAKORN AKE"
              />
            </div>
            <div className="col-md-3 mb-2 d-grid justify-content-between">
              <label>ชื่อลูกค้า</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="เจษฎากร คุ้มเดช"
              />
            </div>
            <div className="col-md-3 mb-2 d-grid justify-content-between">
              <label>ที่อยู่</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="12/345"
              />
            </div>
            <div className="col-md-3 mb-2 d-grid justify-content-between">
              <label>เบอร์โทรศัพท์</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder=" 061-xxxx-xxx "
              />
            </div>
            <div className="mt-3">
              <button className="btn btn-sm btn-primary">
                <MdOutlineSearch />
                &nbsp;ค้นหา
              </button>
            </div>
          </div>
        </div>
      </form>
      <table className="table table-sm table-striped text-center table-bordered border-light mt-3">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>ชื่อ</th>
            <th>ชื่อลูกค้า</th>
            <th>ที่อยู่</th>
            <th>ตำบล/แขวง</th>
            <th>จังหวัด</th>
            <th>รหัสไปรษณีย์</th>
            <th>โทรศัพท์</th>
            <th>สถานะ</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{1}</td>
            <td>Jasdakorn Ake</td>
            <td>เจษฎากร คุ้มเดช</td>
            <td>12/345 ม.1</td>
            <td>จอมพล,จตุจักร</td>
            <td>กรุงเทพ</td>
            <td>10900</td>
            <td>061-xxxx-xxx</td>
            <td>ส่งแล้ว</td>
            <td>
              <Link
                className="btn btn-sm btn-warning"
                to={'/customer/edit/' + 1}
              >
                edit
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/admin/home" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
