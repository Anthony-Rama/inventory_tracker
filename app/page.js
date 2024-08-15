'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button, AppBar, Toolbar, Container, Paper, IconButton } from '@mui/material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function Home() {
  const [inventory, setInventory] = useState([]) 
  const [open, setOpen] = useState(false) 
  const [itemName, setItemName] = useState('') 
  const [search, setSearch] = useState('') 

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

  const addItems = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else { 
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  const searchItems = async (item) => {
    if (item.trim() === '') {
      await updateInventory();
      return;
    }

    const snapshot = query(collection(firestore, 'inventory'));
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
    setInventory(inventoryList);
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField 
              variant="outlined" 
              placeholder="Search Item"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => searchItems(search)}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setSearch('');
                updateInventory();
              }}
              startIcon={<ClearIcon />}
            >
              Reset
            </Button>
          </Stack>

          <Box mt={4}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleOpen} 
              startIcon={<AddCircleIcon />}
            >
              Add New Item
            </Button>
          </Box>

          <Stack mt={4} spacing={2}>
            {inventory.map(({ name, quantity }) => (
              <Paper key={name} elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Quantity: {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => addItems(name)}
                    color="success"
                    startIcon={<AddCircleIcon />}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => removeItem(name)}
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    Remove
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Container>

      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          width={400} 
          bgcolor="background.paper" 
          border="2px solid #000" 
          boxShadow={24} 
          p={4} 
          sx={{ 
            transform: "translate(-50%, -50%)", 
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2} mt={2}>
            <TextField 
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained" 
              onClick={() => {
                addItems(itemName);
                setItemName('');
                handleClose();
              }}
              color="primary"
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}