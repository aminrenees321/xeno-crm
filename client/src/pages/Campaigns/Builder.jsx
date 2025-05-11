import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Grid } from '@mui/material';
import RuleBuilder from '../../components/CampaignBuilder';
import { createSegment, generateSegmentFromText, previewSegment } from '../../services/segmentService';
import { useAuth } from '../../services/auth';

function CampaignBuilder() {
  const { user } = useAuth();
  const [rules, setRules] = useState({
    operator: 'AND',
    conditions: [{ field: '', operator: '', value: '' }]
  });
  const [segmentName, setSegmentName] = useState('');
  const [nlpInput, setNlpInput] = useState('');
  const [previewCount, setPreviewCount] = useState(0);

  const handleGenerateFromText = async () => {
    try {
      const generatedRules = await generateSegmentFromText(nlpInput);
      setRules(generatedRules);
    } catch (error) {
      console.error('Failed to generate rules:', error);
    }
  };

  const handlePreview = async () => {
    try {
      const { count } = await previewSegment(rules);
      setPreviewCount(count);
    } catch (error) {
      console.error('Failed to preview segment:', error);
    }
  };

  const handleSave = async () => {
    try {
      await createSegment({
        name: segmentName,
        rules,
        userId: user.id
      });
      alert('Segment created successfully!');
    } catch (error) {
      console.error('Failed to create segment:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Campaign Builder
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Segment Name"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Natural Language Input
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="e.g., Customers who spent more than ₹5000 in the last 3 months"
              value={nlpInput}
              onChange={(e) => setNlpInput(e.target.value)}
            />
            <Button 
              variant="outlined" 
              onClick={handleGenerateFromText}
              sx={{ mt: 1 }}
            >
              Generate Rules
            </Button>
          </Box>
          
          <RuleBuilder rules={rules} onChange={setRules} />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" onClick={handlePreview}>
              Preview Audience ({previewCount})
            </Button>
            <Button 
              variant="contained" 
              color="success" 
              onClick={handleSave}
              disabled={!segmentName}
            >
              Save Segment
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {/* Message editor and campaign settings would go here */}
        </Grid>
      </Grid>
    </Box>
  );
}

export default CampaignBuilder; 