import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/subscription-plans');
        setPlans(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
          Pricing
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Choose the plan that fits your needs. Start with a free trial or explore premium plans for advanced features.
        </Typography>
      </Box>
      <Grid
        container
        spacing={3}
        sx={{
          alignItems: 'stretch',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {plans.map((plan) => {
          let cardColor, chipColor;
          switch (plan.name) {
            case 'Free':
              cardColor = 'linear-gradient(135deg, hsl(140, 70%, 50%), hsl(140, 60%, 40%))'; 
              chipColor = 'white';
              break;
            case 'Vip':
              cardColor = 'linear-gradient(135deg, hsl(50, 80%, 50%), hsl(50, 70%, 40%))';
              chipColor = 'white';
              break;
            case 'Super Vip':
              cardColor = 'linear-gradient(135deg, hsl(10, 70%, 50%), hsl(10, 60%, 40%))'; 
              chipColor = 'white';
              break;
            default:
              cardColor = 'linear-gradient(135deg, hsl(210, 30%, 95%), hsl(210, 20%, 90%))'; 
              chipColor = 'black';
          }


          const formattedDuration =
            plan.duration > 12
              ? `${Math.floor(plan.duration / 12)} year${Math.floor(plan.duration / 12) > 1 ? 's' : ''}`
              : `${plan.duration} month${plan.duration > 1 ? 's' : ''}`;

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={plan.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Card
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 4,
                  background: cardColor,
                  color: cardColor === 'white' ? 'black' : 'white',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography component="h3" variant="h6">
                      {plan.name}
                    </Typography>
                    {plan.name !== 'Free' && (
                      <Chip icon={<AutoAwesomeIcon />} label="Recommended" sx={{ color: chipColor }} />
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      flexWrap: 'wrap',
                    }}
                  >
                
                    {plan.price && (
                      <Typography component="h3" variant="h2" sx={{ lineHeight: '1.2' }}>
                        {Number(plan.price).toLocaleString()} VND
                      </Typography>
                    )}

                  
                    {plan.duration && (
                      <Typography component="h3" variant="h6" sx={{ ml: 1 }}>
                        &nbsp;/{' '}
                        {plan.duration > 12
                          ? `${Math.floor(plan.duration / 12)} year${Math.floor(plan.duration / 12) > 1 ? 's' : ''
                          }`
                          : `${plan.duration} month${plan.duration > 1 ? 's' : ''}`}
                      </Typography>
                    )}
                  </Box>


                  <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />
                  <Box
                    sx={{
                      py: 1,
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                      textAlign: 'left',  
                      wordBreak: 'break-word', 
                      overflowWrap: 'break-word',
                      maxWidth: '100%',  
                    }}
                  >
                    <CheckCircleRoundedIcon sx={{ color: 'primary.main' }} />
                    <Typography
                      variant="subtitle2"
                      component="span"
                      sx={{
                        lineHeight: 1.5, 
                        whiteSpace: 'normal',
                      }}
                    >
                      {plan.description}
                    </Typography>
                  </Box>

                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white', 
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    Subscribe
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
