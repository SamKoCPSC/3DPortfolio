import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function TransitionsModal({open, setOpen, width, height, children}) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: width,
            height: height,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: 15,
            boxShadow: 24,
            p: 4,
          }}>
            {children}
            <Button variant='contained' onClick={()=>handleClose()}
                sx={{
                    background: '#A89E90', 
                    fontSize: '1.3rem', 
                    width: '100px', 
                    position: 'absolute',
                    bottom: '40px',
                    left: '40px'
                }}>
                Close
            </Button>
            <IconButton onClick={()=>handleClose()} sx={{
                position: 'absolute',
                right: '30px',
            }}>
                <Close fontSize='large'/>
            </IconButton>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
