import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import api from '../../services/api';
import CampaignCard from '../../components/CampaignHistory/CampaignCard';

function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await api.get('/campaigns');
        setCampaigns(data);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);

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
        Campaign History
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Chip 
          label={`Total Campaigns: ${campaigns.length}`} 
          color="primary" 
          sx={{ mr: 1 }} 
        />
      </Box>
      
      {campaigns.length === 0 ? (
        <Typography>No campaigns found</Typography>
      ) : (
        campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))
      )}
    </Box>
  );
}

export default CampaignHistory;