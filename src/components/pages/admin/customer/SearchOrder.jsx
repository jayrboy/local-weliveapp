import { MdArrowDropDown } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function SearchOrder() {
  function dropExpress() {
    var myEx = document.getElementById('myEx')
    document.getElementById('SelectExpress').value =
      myEx.options[myEx.selectedIndex].text
  }

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="  text-decoration-none">
              WE LIVE |
            </Link>{' '}
            <span className="text-success"> ค้นหาคำสั่งซื้อ </span>
          </h3>
        </div>
      </div>

      <form>
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-grid justify-content-between mb-2">
              <label>วันที่</label>
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ width: '150px' }}
              />
            </div>
            <div className="col-md-6 d-grid justify-content-between mb-2">
              <label>ชื่อลูกค้า / Order ID / เลขพัสดุ</label>
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ width: '150px' }}
                placeholder="เจษฎากร คุ้มเดช"
              />
            </div>

            <div>
              <button className="btn btn-sm btn-success"> ค้นหา </button>
              <button className="btn btn-sm btn-success ms-2">
                เพิ่มรายการ
              </button>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="text-center mt-3">
            <h3>
              <strong>Order # 12345</strong> <small>| Jasdakorn Ake</small>
            </h3>
          </div>
          <table className="table table-sm table-striped text-center table-bordered border-light caption-top">
            <caption className="ms-3">
              <select
                id="myEx"
                onChange={() => {
                  // SelectExpress
                }}
                className="btn btn-sm btn-outline-primary"
              >
                <option>เลือกขนส่ง</option>
                <option>J&T</option>
                <option>Shoppee</option>
                <option>Flash</option>
                <option>EMS</option>
              </select>
            </caption>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>รายการ</th>
                <th>จำนวน</th>
                <th>ราคา</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>R9 | ถ้วยฟุตบอลโลก</td>
                <td>1</td>
                <td>
                  <input
                    className="text-center"
                    placeholder="' 1234578 '"
                  ></input>
                </td>
                <td>
                  <button className=" btn btn-sm btn-success">Save </button>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>ส่วนลด</td>
                <td></td>
                <td>
                  <input className="text-center" placeholder="' null '"></input>
                </td>
                <td>
                  <button className=" btn btn-sm btn-success">Save </button>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>ค่าส่ง</td>
                <td></td>
                <td>
                  <input className="text-center" placeholder="' null '" />
                </td>
                <td>
                  <button className=" btn btn-sm btn-success">Save </button>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>โอนแล้ว</td>
                <td></td>
                <td>
                  <input className="text-center" placeholder="' null '"></input>
                </td>
                <td>
                  <button className=" btn btn-sm btn-success">Save </button>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>รวม</td>
                <td></td>
                <td>1234567</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/admin/home" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
