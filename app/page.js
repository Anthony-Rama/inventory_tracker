'use client'
import Image from "next/image";
import { useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button} from '@mui/material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore";

export default function Home() {
  // Declare Helper Functions
  const [inventory, setInventory] = useState([]) // state variable to store inventory
  const [open, setOpen] = useState(false) // state variable to add & remove items
  const [itemName, setItemName] = useState('') // state variable to store name of items
  const [search, setSearch] = useState('') // state variable to search for items

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

   // Function to Search Items
   const searchItems = async (item) => {
    if (item.trim() === '') {
      await updateInventory(); // Show all items if search is empty
      return;
    }

    const snapshot = query(collection(firestore, 'inventory')); // Get the full inventory
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      if (doc.id.toLowerCase().includes(item.toLowerCase())) {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      }
    });
    setInventory(inventoryList); // Set the filtered inventory
  }

  useEffect(() => {
    updateInventory()
  }, [])


  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)



  return (
    <Box 
    width = "100vw" 
    height = "100vh" 
    display = "flex"
    flexDirection = "column"
    justifyContent = "center" 
    alignItems = "center" 
    gap = {2}
    >
      <Modal open = {open} onClosed = {handleClose}> 
        <Box 
        position = "absolute" 
        top = "50%" 
        left = "50%" 
        width = {400} 
        bgcolor = "white" 
        border = "2px solid #000" 
        boxShadow = {24} 
        p = {4} 
        display = "flex" 
        flexDirection = "column" 
        gap = {3} 
        sx = {{ 
          transform: "translate(-50%, -50%)", 
        }}
        >
          <Typography variant = "h6">Add Item</Typography> 
          <Stack width = "100%" direction = "row" spacing = {2}>
            <TextField 
            variant = 'outlined'
            fullWidth
            value = {itemName}
            onChange = {(e) => setItemName(e.target.value)}
            />
            <Button
            variant = "outlined" 
            onClick={() => {
              addItems(itemName);
              setItemName('');
              handleClose();
            }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>

      <Stack direction="row" spacing={2}>
        <TextField 
          variant="outlined" 
          placeholder="Search Item"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="outlined"
          onClick={() => searchItems(search)}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setSearch('');
            updateInventory();
          }}
        >
          Reset
        </Button>
      </Stack>

      <Stack direction="column" spacing={2}>
        
      </Stack>

      <Button 
        variant = "contained" 
        onClick = {() => { 
          handleOpen() 
        }} 
      >
        Add New Item
      </Button>
      <Box border = "1px solid #333"> 
        <Box 
          width = "800px" 
          height = "100px" 
          bgcolor = "ADD8E6" 
          display = "flex" 
          alignItems = "center" 
          justifyContent= "center"
          >
          <Typography variant = "h2" color = "#333">
            Inventory Items
          </Typography>
          </Box>
      <Stack width = "800px" height = "300px"  spacing = {2} overflow = "auto">
        {
          inventory.map(({name, quantity}) => (
            <Box 
            key={name} 
            width = "100%" 
            minHeight = "150px" 
            display = "flex" 
            alignItems = "center" 
            justifyContent = "space-between" 
            bgColor = "#f0f0f0" 
            padding = {5}
            >
              <Typography // Display code for Item Names
                variant = "h3" 
                color = "#333" 
                textAlign = "center"
                style={{ width: '10%', textAlign: 'left' }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              
              <Typography // Display code for Item Quantity
                variant = "h4" 
                color = "#333" 
                textAlign = "center"
                style={{ width: '10%', textAlign: 'center' }} 
              >
                {quantity}
              </Typography> 

              
              <Stack direction={"row"} spacing={2}> 
              <Button // Display code for Add Button
              variant="contained" 
              onClick={() => {
                addItems(name)
              }}>
                Add
              </Button>

              <Button // Display code for Remove Button
              variant="contained" 
              onClick={() => {
                removeItem(name)
              }}>
                Remove
              </Button>
              </Stack>
            </Box>

          ))}
        </Stack>
      </Box>
      </Box>
    );
  }