import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Card, 
  CardContent,
  Grid,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

function CustomerView() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data } = await api.get(`/customers/${id}`);
        setCustomer(data);
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Failed to fetch customer:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!customer) {
    return <Typography>Customer not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Customer Details
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                width: 100, 
                height: 100, 
                fontSize: 40,
                margin: '0 auto 16px'
              }}>
                {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {customer.firstName} {customer.lastName}
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                {customer.email}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {customer.phone}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Customer Stats
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Total Orders:</Typography>
                <Typography variant="body1">{customer.totalOrders}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Total Spent:</Typography>
                <Typography variant="body1">₹{customer.totalSpent.toLocaleString()}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Last Purchase:</Typography>
                <Typography variant="body1">
                  {customer.lastPurchaseDate 
                    ? new Date(customer.lastPurchaseDate).toLocaleDateString() 
                    : 'Never'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              
              {orders.length === 0 ? (
                <Typography>No orders found</Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={order.status} 
                              color={
                                order.status === 'completed' ? 'success' : 
                                order.status === 'pending' ? 'warning' : 'error'
                              } 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CustomerView;