import React from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  IconButton, 
  Grid 
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const Condition = ({ condition, onUpdate, onRemove }) => {
  const fieldOptions = [
    { value: 'totalSpent', label: 'Total Spent' },
    { value: 'lastPurchaseDate', label: 'Last Purchase Date' },
    { value: 'totalOrders', label: 'Total Orders' },
    { value: 'country', label: 'Country' }
  ];

  const operatorOptions = {
    number: [
      { value: '>', label: 'Greater Than' },
      { value: '<', label: 'Less Than' },
      { value: '=', label: 'Equals' },
      { value: '!=', label: 'Not Equals' }
    ],
    date: [
      { value: '>', label: 'After' },
      { value: '<', label: 'Before' },
      { value: '=', label: 'On' }
    ],
    text: [
      { value: '=', label: 'Equals' },
      { value: '!=', label: 'Not Equals' },
      { value: 'contains', label: 'Contains' }
    ]
  };

  const getFieldType = (field) => {
    if (['totalSpent', 'totalOrders'].includes(field)) return 'number';
    if (field === 'lastPurchaseDate') return 'date';
    return 'text';
  };

  const fieldType = getFieldType(condition.field);
  const operators = operatorOptions[fieldType] || operatorOptions.text;

  const handleFieldChange = (e) => {
    onUpdate({ ...condition, field: e.target.value, operator: '', value: '' });
  };

  const handleOperatorChange = (e) => {
    onUpdate({ ...condition, operator: e.target.value });
  };

  const handleValueChange = (e) => {
    onUpdate({ ...condition, value: e.target.value });
  };

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={4}>
        <Select
          fullWidth
          value={condition.field}
          onChange={handleFieldChange}
          size="small"
        >
          <MenuItem value=""><em>Select Field</em></MenuItem>
          {fieldOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      
      {condition.field && (
        <>
          <Grid item xs={3}>
            <Select
              fullWidth
              value={condition.operator}
              onChange={handleOperatorChange}
              size="small"
              disabled={!condition.field}
            >
              <MenuItem value=""><em>Select Operator</em></MenuItem>
              {operators.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          
          <Grid item xs={4}>
            <TextField
              fullWidth
              value={condition.value}
              onChange={handleValueChange}
              size="small"
              disabled={!condition.operator}
              type={fieldType === 'number' ? 'number' : 'text'}
            />
          </Grid>
          
          <Grid item xs={1}>
            <IconButton onClick={onRemove}>
              <Delete />
            </IconButton>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Condition;