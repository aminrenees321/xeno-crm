import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Chip, 
  Stack,
  Box,
  IconButton,
  Collapse
} from '@mui/material';
import { 
  CheckCircle, 
  Error, 
  Schedule,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

const CampaignCard = ({ campaign }) => {
  const [expanded, setExpanded] = React.useState(false);
  const deliveryRate = (campaign.sentCount / campaign.totalCount) * 100;
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" gutterBottom>
            {campaign.name}
          </Typography>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Segment: {campaign.Segment?.name || 'N/A'}
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip 
            icon={<CheckCircle />} 
            label={`${campaign.sentCount} Sent`} 
            color="success" 
            size="small" 
          />
          <Chip 
            icon={<Error />} 
            label={`${campaign.failedCount} Failed`} 
            color="error" 
            size="small" 
          />
          <Chip 
            icon={<Schedule />} 
            label={new Date(campaign.scheduledAt).toLocaleDateString()} 
            size="small" 
          />
        </Stack>
        
        <LinearProgress 
          variant="determinate" 
          value={deliveryRate} 
          sx={{ height: 8, borderRadius: 4, mb: 1 }} 
        />
        
        <Typography variant="caption" display="block" sx={{ mb: 2 }}>
          {deliveryRate.toFixed(1)}% delivery rate
        </Typography>
        
        <Collapse in={expanded}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Message:</strong> {campaign.message}
          </Typography>
          
          {campaign.insights && (
            <Box sx={{ 
              backgroundColor: '#f5f5f5', 
              p: 2, 
              borderRadius: 1,
              mt: 1
            }}>
              <Typography variant="subtitle2" gutterBottom>
                AI Insights:
              </Typography>
              <Typography variant="body2">
                {campaign.insights}
              </Typography>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;