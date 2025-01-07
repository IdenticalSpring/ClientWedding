import React, { useEffect, useState } from 'react';
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
import { userAPI } from '../../service/user';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const navigate = useNavigate();

  // Fetch plans data
  useEffect(() => {
    const fetchPlansData = async () => {
      try {
        const plans = await userAPI.fetchPlans();
        setPlans(plans);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlansData();
  }, []);

  // Validate User ID
  const validateUserId = () => {
    const userId = sessionStorage.getItem('userId');
    const parsedUserId = parseInt(userId, 10);

    if (!userId || isNaN(parsedUserId) || parsedUserId <= 0) {
      setModalMessage('Invalid User ID. Please ensure you are logged in.');
      setOpenModal(true);
      navigate('/dangnhap'); // Chỉ điều hướng khi cần thiết
      return null;
    }

    return parsedUserId;
  };

  // Handle Subscription Click
  const handleSubscribeClick = async (planId) => {
    const userId = validateUserId();
    if (!userId) return;

    setSelectedPlanId(planId);

    try {
      const response = await userAPI.createSubscription(userId, planId);

      if (response && response.data) {
        const { statusCode, message, paymentUrl } = response.data;

        // Universal modal state setting
        setModalMessage(message || 'Subscription processed');

        // Handle different status codes
        switch (statusCode) {
          case 204: // Existing subscription
            setPaymentUrl(paymentUrl);
            setModalMessage(message);
            break;

          case 202: // Confirmation needed
            setIsConfirming(true);
            break;

          case 200:
          case 201:
            if (paymentUrl) {
              setPaymentUrl(paymentUrl); // Set the payment URL
            } else {
              setModalMessage(message); // Display message if no payment URL
            }
            break;

          case 409: // Conflict - User already subscribed
            setModalMessage(message || 'You have already subscribed to this plan.');
            break;

          default:
            setModalMessage(message || 'Unexpected error occurred');
        }

        // Open modal for all scenarios
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Subscription Error:", error);
      setModalMessage('An error occurred while subscribing.');
      setOpenModal(true);
    }
  };


  const handleConfirmChange = async () => {
    const userId = validateUserId();
    if (!userId || !selectedPlanId) return;

    try {
      const response = await userAPI.createSubscription(userId, selectedPlanId, true);

      if (response && response.data) {
        const { statusCode, message, paymentUrl } = response.data;

        switch (statusCode) {
          case 200: // Successful change
          case 201: // Created after change (similar to 200)
            setModalMessage(message);
            if (paymentUrl) {
              setPaymentUrl(paymentUrl); // Set the payment URL for redirect
            }
            break;

          case 204: // Existing subscription
            setPaymentUrl(paymentUrl);
            setModalMessage(message);
            break;

          case 409: // Conflict - User already subscribed
            setModalMessage(message || 'You are already subscribed to this plan.');
            break;

          default:
            setModalMessage(message || 'Unexpected error occurred');
        }
      }
    } catch (error) {
      console.error('Confirm Change Error:', error);
      setModalMessage('An error occurred while confirming your subscription.');
    } finally {
      setIsConfirming(false);
      setOpenModal(true);
    }
  };


  // Custom redirect handler for payment
  const handlePaymentRedirect = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl; // Redirect to payment page
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Container id="pricing" sx={{
      pt: { xs: 4, sm: 12 },
      pb: { xs: 8, sm: 16 },
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: { xs: 3, sm: 6 },
    }}>
      <Box sx={{
        width: { sm: '100%', md: '60%' },
        textAlign: { sm: 'left', md: 'center' },
      }}>
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
          Pricing
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Choose the plan that fits your needs. Start with a free trial or explore premium plans for advanced features.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{
        alignItems: 'stretch',
        justifyContent: 'center',
        width: '100%',
      }}>
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

          const formattedDuration = plan.duration > 12
            ? `${Math.floor(plan.duration / 12)} year${Math.floor(plan.duration / 12) > 1 ? 's' : ''}`
            : `${plan.duration} month${plan.duration > 1 ? 's' : ''}`;

          return (
            <Grid item xs={12} sm={6} md={4} key={plan.id} sx={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Card sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 4,
                background: cardColor,
                color: cardColor === 'white' ? 'black' : 'white',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                height: '100%',
              }}>
                <CardContent>
                  <Box sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                  }}>
                    <Typography component="h3" variant="h6">
                      {plan.name}
                    </Typography>
                    {plan.name !== 'Free' && (
                      <Chip icon={<AutoAwesomeIcon />} label="Recommended" sx={{ color: chipColor }} />
                    )}
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                  }}>
                    {plan.price && (
                      <Typography component="h3" variant="h2" sx={{ lineHeight: '1.2' }}>
                        {Number(plan.price).toLocaleString()} VND
                      </Typography>
                    )}
                    {plan.duration && (
                      <Typography component="h3" variant="h6" sx={{ ml: 1 }}>
                        &nbsp;/ {formattedDuration}
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />
                  <Box sx={{
                    py: 1,
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'center',
                    textAlign: 'left',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%',
                  }}>
                    <CheckCircleRoundedIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle2" component="span" sx={{
                      lineHeight: 1.5,
                      whiteSpace: 'normal',
                    }}>
                      {plan.description}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  {plan.name !== 'Free' && (
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
                      onClick={() => handleSubscribeClick(plan.id)}
                    >
                      Subscribe
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>

          );
        })}
      </Grid>

      {/* Modal remains the same as in the previous version */}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setIsConfirming(false);
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 2,
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">{modalMessage}</Typography>

          {/* Show the "Go to Payment" button if a paymentUrl is available */}
          {paymentUrl && (
            <Button
              fullWidth
              variant="contained"
              sx={{
                marginTop: 2,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
              onClick={handlePaymentRedirect}
            >
              Go to Payment
            </Button>
          )}

          {/* Button to confirm change or close modal */}
          <Button
            fullWidth
            variant="outlined"
            sx={{
              marginTop: 2,
            }}
            onClick={() => {
              if (isConfirming) {
                handleConfirmChange();
              } else {
                setOpenModal(false);
              }
            }}
          >
            {isConfirming ? 'Confirm Change' : 'Close'}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
