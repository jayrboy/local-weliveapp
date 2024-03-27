import Selectbar from '../../../assets/selectbar'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import MyComponent from '../../../assets/date'
import { orderDetail } from '../../../data'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export default function USinvoice() {
  return (
    <div className=" position-relative mt-5 ">
      <h3 className=" m-3">
        <span>We Live</span>
        <span className=" text-success ms-2">| ชำระสินค้า</span>
      </h3>
      <div className="m-2">
        {orderDetail.map((detail, i) => {
          // if (detail.from.fbName == 'Wittaya R.')
          // ใช้ในการกำหนด ให้ชื่อ user ตรงกับออเดอร์เท่านั้นถึงจะโชว์ให้จ่ายเงิน
          return (
            <div
              key={detail.id}
              className="card card-header mb-3 bg-warning bg-opacity-75 "
            >
              <Box sx={{ flexGrow: 1 }} className="m-3">
                <Grid container spacing={3} key={detail.id}>
                  <Grid item xs={2}>
                    <Item className="bg-primary text-white">
                      <h5>ออเดอร์ # {detail.from.orderID}</h5>
                    </Item>
                  </Grid>
                  <Grid item xs={4}>
                    <Item className=" bg-info-subtle text-center">
                      <h5 className="text-danger">
                        Facebook name :
                        "เพิ่มเงื่อนไขส่วนนี้ให้แสดงเฉพาะที่ตรงกับชื่อ User
                        ที่ล็อคอินเข้ามา
                      </h5>
                    </Item>
                  </Grid>
                  <Grid item xs={5}>
                    <Item className=" bg-info-subtle text-center">
                      <MyComponent />
                    </Item>
                  </Grid>
                </Grid>
              </Box>

              <div className="card card-body">
                <table className="table">
                  <thead className="table-success">
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">รายการ</th>
                      <th className="text-center">จำนวน</th>
                      <th className="text-center">ราคา</th>
                    </tr>
                  </thead>
                  <tbody className=" table-striped">
                    <tr key={detail.id}>
                      <th className="text-center">{i + 1}</th>
                      <th className="text-center">
                        {detail.from.itemId} | {detail.from.itemNm}
                      </th>
                      <th className="text-center">{detail.from.among} ชิ้น</th>
                      <th className="text-center">{detail.from.itempr} บาท </th>
                    </tr>
                    <tr>
                      <th className="text-center">{}</th>
                      <th className="text-center">ส่วนลด</th>
                      <th className="text-center">{}</th>
                      <th className="text-center">
                        {detail.from.discount} บาท
                      </th>
                    </tr>
                    <tr>
                      <th className="text-center">{}</th>
                      <th className="text-center">
                        <Selectbar />
                      </th>
                      <th className="text-center">{}</th>
                      <th className="text-center text-danger">
                        รอดึงราคาจาก expressdetail
                      </th>
                    </tr>
                    <tr>
                      <th className="text-center">{}</th>
                      <th className="text-center">รวม</th>
                      <th className="text-center">{detail.from.among} ชิ้น</th>
                      <th className="text-center text-danger">
                        รอ ฟังก์ชั่นในการรวมราคา
                      </th>
                    </tr>
                  </tbody>
                </table>

                <div>
                  <h5>
                    <span className="text-success">เลือก </span> | วันเวลาที่โอน
                  </h5>
                  <input type="date" className=" w-25 float-start" />
                  <input type="time" className=" w-25 ms-3" />
                </div>
                <div className="mt-3">
                  <h5>จำนวนเงิน</h5>
                  <input
                    type="number"
                    className=" w-25"
                    placeholder="กรอกตัวเลขเท่านั้น"
                  ></input>
                </div>
                <div className="mt-3">
                  <h5>อัพโหลดภาพสลิป</h5>
                  <input type="file"></input>
                </div>
              </div>
              <div className="text-center mt-2">
                <button className="btn btn-sm btn-primary">
                  ส่งแบบฟอร์มชำระเงิน
                </button>
                <button className="btn btn-sm btn-danger ms-3">
                  ยกเลิกคำสั่งซื้อนี้
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="text-center"></div>
    </div>
  )
}
