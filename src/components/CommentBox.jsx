import React, { useRef, useState, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  FormControlLabel,
  Switch,
  Card,
  styled,
  CircularProgress,
} from '@mui/material'

import CommentIcon from '@mui/icons-material/Comment'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import CachedIcon from '@mui/icons-material/Cached'
import FacebookIcon from '@mui/icons-material/Facebook'

import { useDispatch, useSelector } from 'react-redux'
import {
  pushComment,
  reloadComments,
  setComments,
  getComments,
} from '../redux/commentSlice'

const CommentBox = () => {
  const dispatch = useDispatch()
  let { comments, isLoadingCm } = useSelector((state) => state.comment)
  let { isLoading } = useSelector((state) => state.live)
  // console.log('Redux Comments :', comments)

  const [open, setOpen] = useState(false) // State to control chat box visibility
  const commentsEndRef = useRef(null)

  // เมื่อโหลดเสร็จเลื่อนลงมาข้างล่างสุด
  useEffect(() => {
    if (!isLoadingCm && comments.length > 0) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isLoadingCm, comments])

  const reloadCommentsHandler = () => {
    dispatch(reloadComments())

    // สมมติว่าคุณมีฟังก์ชัน fetchComments เพื่อดึงข้อมูลคอมเมนต์ใหม่จาก API
    // fetchComments().then((newComments) => {
    // dispatch(setComments(newComments))
    // })
    setTimeout(() => {
      dispatch(getComments())
    }, 1000)
  }

  const formatDate = (dateString) => {
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false }

    const timePart = new Date(dateString).toLocaleTimeString(
      'en-GB',
      timeOptions
    ) // en-GB for 24-hour format

    return `${timePart}`
  }

  return (
    <>
      {/* Chat Icon Button to toggle chat box */}
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#1976d2',
          color: 'white',
          boxShadow: 3,
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        }}
      >
        {open ? <CloseIcon /> : <CommentIcon />}
      </IconButton>

      {/* Chat Box */}
      {open && (
        <Card
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 70, // Adjusted to avoid overlap with the icon
            right: 20,
            width: 300,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              color: 'white',
              padding: 1,
            }}
          >
            <Typography sx={{ padding: 1 }} variant="h6">
              Comments
            </Typography>
          </Box>

          {isLoadingCm ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 300, // ความสูงเท่ากับกล่องคอมเมนต์
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <React.Fragment>
              <Box sx={{ padding: 1, overflowY: 'auto', maxHeight: 450 }}>
                {comments.length === 0 ? ( // เช็คว่ามีคอมเมนต์หรือไม่
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'gray',
                      textAlign: 'center',
                    }}
                  >
                    <FacebookIcon sx={{ fontSize: 40, marginBottom: 1 }} />
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      ไม่พบข้อมูล Comments ใน Live
                    </Typography>
                  </Box>
                ) : (
                  comments.map((msg, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{ margin: '5px 0' }}
                    >
                      <strong style={{ color: '#1877f2' }}>
                        {msg.from.name}
                      </strong>{' '}
                      : {msg.message}{' '}
                      <span style={{ fontSize: '0.8em', color: 'gray' }}>
                        ({formatDate(msg.created_time)})
                      </span>
                    </Typography>
                  ))
                )}
                {/* Element ที่จะเลื่อนมาถึง */}
                <div ref={commentsEndRef} />
              </Box>

              {/* Button Reload Comments */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: 1,
                }}
              >
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={reloadCommentsHandler} // ฟังก์ชันสำหรับรีโหลดคอมเมนต์
                >
                  <CachedIcon />
                </IconButton>
              </Box>
            </React.Fragment>
          )}
        </Card>
      )}
    </>
  )
}
export default CommentBox

/*
[
    {
      "created_time": "2024-10-10T08:06:01+0000",
      "from": {
        "name": "Jay Jakkrit",
        "id": "25712273311753617"
      },
      "message": "อยากได้สีขาว มีมั้ย",
      "id": "1724668985020016_839706578324481"
    },
    {
      "created_time": "2024-10-10T08:06:52+0000",
      "from": {
        "name": "Jay Jakkrit",
        "id": "25712273311753617"
      },
      "message": "Wow!🤩 🤠",
      "id": "1724668985020016_1074584164331449"
    },
    {
      "created_time": "2024-10-10T08:09:05+0000",
      "from": {
        "name": "Jay Jakkrit",
        "id": "25712273311753617"
      },
      "message": "b3=2",
      "id": "1724668985020016_1223502395567933"
    },
    {
      "created_time": "2024-10-10T08:03:34+0000",
      "from": {
        "name": "Saovalak Dinjuntuk",
        "id": "2208870926135220"
      },
      "message": "มี size ให้เลือกมั้ย",
      "id": "1724668985020016_2272768123097903"
    },
    {
      "created_time": "2024-10-10T08:09:38+0000",
      "from": {
        "name": "Jay Jakkrit",
        "id": "25712273311753617"
      },
      "message": "B0=1",
      "id": "1724668985020016_502173462797475"
    },
    {
      "created_time": "2024-10-10T08:09:27+0000",
      "from": {
        "name": "Jay Jakkrit",
        "id": "25712273311753617"
      },
      "message": "b1=1",
      "id": "1724668985020016_557570706840886"
    },
    {
      "created_time": "2024-10-10T08:02:27+0000",
      "from": {
        "name": "Jakkrit Onsomkrit",
        "id": "122129729402187406"
      },
      "message": "พิมพ์รหัสสินค้าเท่ากับจำนวนตามสินค้าที่ถ่ายทอดสดขายสินค้า",
      "id": "1724668985020016_542306898156958"
    }
  ]
*/
