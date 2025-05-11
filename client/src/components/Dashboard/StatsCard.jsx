import React from 'react';
import { Card, CardContent, Typography, Stack } from '@mui/material';

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Icon sx={{ fontSize: 40, color }} />
          <div>
            <Typography variant="h6" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatsCard;