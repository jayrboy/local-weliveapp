import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBoxOpen } from 'react-icons/fa'
import { MdEdit, MdDelete } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function DBCFCode() {
  let [data, setData] = useState('')
  const form = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/db/read')
      .then((response) => response.json())
      .then((docs) => {
        if (docs.length > 0) {
          showData(docs)
        } else {
          setData(<>ไม่มีรายการข้อมูล</>)
        }
      })
      .catch((err) => alert(err))
    // eslint-disable-next-line
  }, [])

  const showData = (result) => {
    let r = (
      <>
        <h3 className="text-start">
          <Link to="/admin/home" className="  text-decoration-none">
            WE LIVE |
          </Link>{' '}
          <span className="text-success"> จัดการ CF CODE </span>
        </h3>
        <form onSubmit={onSubmitForm} ref={form}>
          <table className="table table-striped ">
            <thead className="table-success">
              <tr>
                <th className="text-center">
                  <input type="checkbox" />
                </th>
                <th className="text-center">สถานะ</th>
                <th className="text-center">CF CODE</th>
                <th className="text-center">สินค้าที่มี</th>
                <th className="text-center">รายละเอียด</th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {result.map((doc) => {
                let p = new Intl.NumberFormat().format(doc.price)
                return (
                  <tr key={doc._id}>
                    <td className="text-center ">
                      <input
                        type="checkbox"
                        className="toggle-switch-checkbox"
                        name="_id"
                        value={doc._id}
                      />
                    </td>
                    <td className="text-center">
                      <div className="btn btn-sm m-1 btn-danger">
                        พื้นที่สำหรับใส่ Toggle Button !!!
                      </div>
                    </td>
                    <td className="text-center">
                      <div>{doc.itemid}</div>
                    </td>

                    <td className="text-center">
                      <div className=" align-items-center">
                        <FaBoxOpen />
                        &nbsp;
                        {doc.stock}
                      </div>
                    </td>
                    <td>
                      <div className="carddocument text-center">
                        <p>
                          {doc.name} <br /> ฿ {p}
                        </p>
                      </div>
                    </td>
                    <td>
                      <Link to="/db/update">
                        <div className="btn btn-sm btn-warning">
                          <MdEdit />
                        </div>
                      </Link>
                      <button className="btn btn-sm btn-danger m-1">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <br />
          <div className="text-center ">
            <Link to="/db/create">
              <button className="btn btn-primary btn-sm">
                เพิ่มโค้ดการขาย
              </button>
            </Link>
          </div>
        </form>
      </>
    )

    setData(r)
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    if (!window.confirm('ยืนยันการลบรายการนี้')) {
      return
    }

    const fd = new FormData(form.current)
    const fe = Object.fromEntries(fd.entries())

    if (Object.keys(fe).length === 0) {
      alert('ต้องเลือกรายการที่จะลบ')
      return
    }

    fetch('/api/db/delete', {
      method: 'POST',
      body: JSON.stringify(fe),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          alert(result.error)
        } else {
          if (result.length === 0) {
            setData('ไม่มี CF CODE ดังกล่าว')
          } else {
            showData(result)
          }
          alert('cf code ถูกลบแล้ว')
        }
        navigate('/db/cfcode')
      })
      .catch((err) => alert(err))
  }

  return (
    <div style={{ margin: '20px' }}>
      <div id="data">{data}</div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <a href="/admin/home" className="btn btn-light btn-sm">
          หน้าหลัก
        </a>
      </div>
    </div>
  )
}
