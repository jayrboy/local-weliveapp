import { MdArrowDropDown } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function SearchbyOrder() {
  function dropExpress() {
    var myEx = document.getElementById('myEx')
    document.getElementById('SelectExpress').value =
      myEx.options[myEx.selectedIndex].text
  }

  return (
    <>
      <div className="m-2 row-cols-auto">
        <h3 className="text-start">
          <Link to="/admin/home" className="  text-decoration-none">
            WE LIVE |
          </Link>{' '}
          <span className="text-success"> ค้นหาคำสั่งซื้อ </span>
        </h3>
      </div>
      <div className="card">
        <form className=" align-items-center m-3">
          <div className="  border-bottom border-1 ">
            <div>
              <span>วันที่ : </span>
              <input type="date" className=" rounded ms-1"></input>

              <span className="ms-3">ชื่อลูกค้า / Order ID / เลขพัสดุ : </span>
              <input
                type="text"
                className=" rounded ms-1"
                placeholder="เจษฎากร คุ้มเดช"
              ></input>
              <button className="btn btn-sm btn-success ms-2"> ค้นหา </button>
              <button className="btn btn-sm btn-success ms-2">
                เพิ่มรายการ{' '}
              </button>
            </div>
            <div className="mt-3 mb-3">
              <h3>Order # 12345</h3> <span>| Jasdakorn Ake</span>
            </div>

            <div className="relative flex-column px-2 mt-2">
              <div>
                <table className=" table table-striped ">
                  <thead className="  table-success">
                    <tr>
                      <th className=" text-center">#</th>
                      <th className=" text-center ">รายการ</th>
                      <th className=" text-center">จำนวน</th>
                      <th className=" text-center">ราคา</th>
                      <th className=" text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <th className=" text-center">1</th>
                      <th className=" text-center">R9 | ถ้วยฟุตบอลโลก</th>
                      <th className=" text-center">1</th>
                      <th className=" text-center">
                        <input
                          className="text-center"
                          placeholder="' 1234578 '"
                        ></input>
                      </th>
                      <th className=" text-center"></th>
                    </tr>
                    <tr>
                      <th className=" text-center">{}</th>
                      <th className=" text-center">ส่วนลด</th>
                      <th className=" text-center">{}</th>
                      <th className=" text-center">
                        <input
                          className="text-center"
                          placeholder="' null '"
                        ></input>
                      </th>
                      <th className=" text-center">
                        <button className=" btn btn-sm btn-success">
                          {''}
                          Save{' '}
                        </button>
                      </th>
                    </tr>
                    <tr>
                      <th className=" text-center">{}</th>
                      <th className=" text-center">ค่าส่ง</th>
                      <th className=" text-center">{}</th>
                      <th className=" text-center">
                        <input
                          className="text-center"
                          placeholder="' null '"
                        ></input>
                      </th>
                      <th className=" text-center">
                        <button className=" btn btn-sm btn-success">
                          {''}
                          Save{' '}
                        </button>
                      </th>
                    </tr>
                    <tr>
                      <th className=" text-center">{}</th>
                      <th className=" text-center">โอนแล้ว</th>
                      <th className=" text-center">{}</th>
                      <th className=" text-center">
                        <input
                          className="text-center"
                          placeholder="' null '"
                        ></input>
                      </th>
                      <th className=" text-center">
                        <button className=" btn btn-sm btn-success">
                          {''}
                          Save{' '}
                        </button>
                      </th>
                    </tr>
                    <tr>
                      <th className=" text-center">{}</th>
                      <th className=" text-center">รวม</th>
                      <th className=" text-center">{}</th>
                      <th className=" text-center">1234567</th>
                      <th className=" text-center">
                        <button className=" btn btn-sm btn-success">
                          {''}
                          Save{' '}
                        </button>
                      </th>
                    </tr>
                    <tr>
                      <th className="text-center ">
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
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
