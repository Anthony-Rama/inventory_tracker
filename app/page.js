'use client'
import Image from "next/image";
import { useState, useEffect} from 'react'
import{firestore} from '@/firebase'
import {Box, Typography} from '@mui/material'
import { query } from "firebase/firestore";


export default function Home() {
  // Declare Helper Functions
  const [inventory, setInventory] = useState([]) // state variable to store inventory
  const [open, setOpen] = useState(false) // state variable to add & remove items
  const [itemName, setItemName] = useState('') // state variable to store name of items

  // Functions
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
  }

  return (
    <Box>
      <Typography variant="h1">Inventory Tracker</Typography>
    </Box>
  )
}
