import React from 'react';
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  Button, 
  Divider 
} from '@mui/material';
import Condition from './Condition';

const RuleGroup = ({ group, onUpdate, onRemove }) => {
  const handleAddCondition = () => {
    const newConditions = [...group.conditions, { field: '', operator: '', value: '' }];
    onUpdate({ ...group, conditions: newConditions });
  };

  const handleUpdateCondition = (index, updatedCondition) => {
    const newConditions = [...group.conditions];
    newConditions[index] = updatedCondition;
    onUpdate({ ...group, conditions: newConditions });
  };

  const handleRemoveCondition = (index) => {
    const newConditions = group.conditions.filter((_, i) => i !== index);
    onUpdate({ ...group, conditions: newConditions });
  };

  const handleOperatorChange = (e) => {
    onUpdate({ ...group, operator: e.target.value });
  };

  return (
    <Box sx={{ 
      border: '1px solid #ddd', 
      borderRadius: 1, 
      p: 2, 
      mb: 2,
      backgroundColor: '#f9f9f9'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1">Rule Group</Typography>
        <Select
          value={group.operator}
          onChange={handleOperatorChange}
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value="AND">ALL conditions must be true (AND)</MenuItem>
          <MenuItem value="OR">ANY condition can be true (OR)</MenuItem>
        </Select>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {group.conditions.map((condition, index) => (
        <Condition
          key={index}
          condition={condition}
          onUpdate={(updated) => handleUpdateCondition(index, updated)}
          onRemove={() => handleRemoveCondition(index)}
        />
      ))}
      
      <Button 
        variant="outlined" 
        onClick={handleAddCondition}
        size="small"
        sx={{ mt: 1 }}
      >
        Add Condition
      </Button>
      
      {onRemove && (
        <Button 
          variant="outlined" 
          color="error"
          onClick={onRemove}
          size="small"
          sx={{ mt: 1, ml: 1 }}
        >
          Remove Group
        </Button>
      )}
    </Box>
  );
};

export default RuleGroup;