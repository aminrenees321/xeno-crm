import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TablePagination,
  Avatar,
  Chip
} from '@mui/material';
import api from '../../services/api';
import { Link } from 'react-router-dom';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await api.get('/customers', {
          params: { search: searchTerm }
        });
        setCustomers(data.data);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>
      
      <TextField
        fullWidth
        label="Search Customers"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Total Spent</TableCell>
              <TableCell>Last Purchase</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>
                        {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                      </Avatar>
                      <Link 
                        to={`/customers/${customer.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {customer.firstName} {customer.lastName}
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Chip label={customer.totalOrders} />
                  </TableCell>
                  <TableCell>₹{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>
                    {customer.lastPurchaseDate 
                      ? new Date(customer.lastPurchaseDate).toLocaleDateString() 
                      : 'Never'}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={customers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

export default Customers;