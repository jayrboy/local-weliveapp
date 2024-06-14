import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseURL } from '../../../../App'
import { useParams } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import InventoryIcon from '@mui/icons-material/Inventory'
export default function ProductGraph() {
  const { id } = useParams()
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [Product, setProduct] = useState({})

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchSaleOrder = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/sale-order/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('Fetched Data: ', response.data)
        const data = response.data
        let priceSum = 0
        let quantitySum = 0

        data.forEach((x) => {
          console.log('x: ', x)

          if (x.complete === true) {
            x.orders.forEach((y) => {
              if (y._id === id) {
                console.log('y: ', y)
                priceSum += y.price
                quantitySum += y.quantity
                setProduct(y)
              }
            })
          }
        })

        setTotalPrice(priceSum)
        setTotalQuantity(quantitySum)
      } catch (error) {
        console.error('There was an error!', error)
      }
    }

    if (token) {
      fetchSaleOrder()
    }
  }, [token, id])

  console.log('Product', Product)
  console.log('Total Price: ', totalPrice)
  console.log('Total Quantity: ', totalQuantity)

  return (
    <div className=" d-flex justify-content-center mt-5">
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          borderRadius: '30px',
        }}
      >
        <card>
          <p className="text-center">สินค้า {Product.name}</p>
        </card>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ShowChartIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="ยอดขาย" secondary={totalPrice} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <InventoryIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="จำนวน" secondary={totalQuantity} />
        </ListItem>
      </List>
    </div>
  )
}
