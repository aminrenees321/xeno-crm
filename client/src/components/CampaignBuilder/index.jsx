import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import RuleGroup from './RuleGroup';

const RuleBuilder = ({ rules, onChange }) => {
  const handleAddGroup = () => {
    onChange({
      operator: 'AND',
      conditions: [{ field: '', operator: '', value: '' }]
    });
  };

  const handleUpdateGroup = (updatedGroup) => {
    onChange(updatedGroup);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Segment Rules
      </Typography>
      
      <RuleGroup 
        group={rules} 
        onUpdate={handleUpdateGroup}
      />
      
      <Button 
        variant="outlined" 
        onClick={handleAddGroup}
        sx={{ mt: 2 }}
      >
        Add Rule Group
      </Button>
    </Box>
  );
};

export default RuleBuilder;