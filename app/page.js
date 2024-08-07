'use client'
import Image from "next/image";
import { useState, useEffect} from 'react'
import{firestore} from '@/firebase'
import {Box, Typography} from '@mui/material'
import { collection, getDocs, query, updateDoc } from "firebase/firestore";

export default function Home() {
  // Declare Helper Functions
  const [inventory, setInventory] = useState([]) // state variable to store inventory
  const [open, setOpen] = useState(false) // state variable to add & remove items
  const [itemName, setItemName] = useState('') // state variable to store name of items

  // -- Functions -- 

  // Function #1: Update Inventory 
  const updateInventory = async () => { 
    const snapshot = query(collection(firestore, 'inventory')) 
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  // Function #2: Add Items
  const addItems = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
      } else {
        await setDoc(docRef, {quantity: 1})
      }

    await updateInventory()
  }

  // Function #3: Remove Items
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else{ 
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])


  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)



  return (
    <Box>
      <Typography variant="h1">Inventory Tracker</Typography>
      {inventory.forEach((item) => {
        console.log(item)
          return(<>
          {item.name}
          {item.count}
          </>)
        })
      }
    </Box>
  )
}
