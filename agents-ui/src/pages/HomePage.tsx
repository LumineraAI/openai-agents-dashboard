import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Paper
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MemoryIcon from '@mui/icons-material/Memory';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Agents',
      description: 'Create and manage AI agents with different capabilities and configurations.',
      icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
      action: 'Manage Agents',
      path: '/agents'
    },
    {
      title: 'Workflows',
      description: 'Design multi-agent workflows to solve complex tasks through collaboration.',
      icon: <AccountTreeIcon sx={{ fontSize: 40 }} />,
      action: 'Manage Workflows',
      path: '/workflows'
    },
    {
      title: 'Executions',
      description: 'View and analyze the history of agent and workflow executions.',
      icon: <PlayArrowIcon sx={{ fontSize: 40 }} />,
      action: 'View Executions',
      path: '/executions'
    },
    {
      title: 'Model Providers',
      description: 'Configure and manage different AI model providers and their models.',
      icon: <MemoryIcon sx={{ fontSize: 40 }} />,
      action: 'Manage Providers',
      path: '/model-providers'
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to OpenAI Agents Dashboard
          </Typography>
          <Typography variant="body1" paragraph>
            This dashboard allows you to create, manage, and monitor AI agents and workflows.
            Use the navigation menu to access different sections of the application.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="center" mb={2}>
                    {card.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom align="center">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    fullWidth 
                    variant="contained" 
                    onClick={() => navigate(card.path)}
                  >
                    {card.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;