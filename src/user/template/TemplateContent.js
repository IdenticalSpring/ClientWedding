import React, { useEffect, useState } from "react";
import { userAPI } from "../../service/user";
import { Box, Typography, CircularProgress, Button, Pagination } from "@mui/material";
import { Star } from '@mui/icons-material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from React Router

// Styled Components
const Wrapper = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
`;

const TemplateContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: stretch;
`;

const TemplateCard = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  position: relative;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
`;

const VIPIndicator = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ffd700;
  color: #000;
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  z-index: 10;
`;

const FreeIndicator = styled.div`
  position: absolute;
  top: 15px;
  right: -30px;
  background-color: #ff4d4d;
  color: #fff;
  padding: 5px 50px;
  transform: rotate(45deg);
  z-index: 10;
  font-weight: bold;
  text-align: center;
  font-size: 0.8rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const TemplateImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const TemplateDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
`;

const TemplateName = styled(Typography)`
  font-size: 1.2rem;
  margin-bottom: 10px;
  font-weight: 600;
  color: #1976d2; /* Màu xanh dương */
`;

const TemplateDescription = styled(Typography)`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
`;

const AddButton = styled(Button)`
  text-transform: none;
  background-color: #4caf50; /* Màu xanh lá */
  margin-right: 10px;
  &:hover {
    background-color: #45a049;
    opacity: 0.8;
  }
`;

const StyledButton = styled(Button)`
  text-transform: none;
  background-color: hsl(345, 75%, 42%);
  &:hover {
    background-color: hsl(340, 80%, 38%);
    opacity: 0.8;
  }
`;

const TemplateContent = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(20);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await userAPI.getAllTemplates(currentPage, limit);
                setTemplates(response.data.data || []);
                setTotalPages(Math.ceil(response.data.total / limit));
            } catch (error) {
                console.error("Error fetching templates:", error);
                setTemplates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, [currentPage, limit]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        setLoading(true);
    };

    const handlePreview = (templateId) => {
        navigate(`/template/${templateId}`); 
    };

    const handleTryNow = (templateId) => {
        navigate(`/template/${templateId}`); 
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!Array.isArray(templates) || templates.length === 0) {
        return (
            <Box sx={{ textAlign: "center", padding: "20px" }}>
                <Typography variant="h6" color="text.secondary">
                    Không có mẫu nào để hiển thị.
                </Typography>
            </Box>
        );
    }

    return (
        <Wrapper>
            <TemplateContainer>
                {templates.map((template) => (
                    <TemplateCard key={template.id}>
                        {template.accessType === "VIP" && (
                            <VIPIndicator>
                                <Star sx={{ marginRight: "5px", fontSize: "20px" }} />
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    VIP
                                </Typography>
                            </VIPIndicator>
                        )}

                        {template.accessType === "FREE" && (
                            <FreeIndicator>FREE</FreeIndicator>
                        )}

                        <TemplateImage src={template.thumbnailUrl} alt={template.name} />

                        <TemplateDetails>
                            <Box>
                                <TemplateName variant="h6">{template.name}</TemplateName>
                                <TemplateDescription variant="body2">
                                    {template.description}
                                </TemplateDescription>
                            </Box>

                            <ButtonContainer>
                                <AddButton
                                    variant="contained"
                                    onClick={() => handlePreview(template.id)} 
                                >
                                    Xem trước
                                </AddButton>
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleTryNow(template.id)} 
                                >
                                    Thử ngay
                                </StyledButton>
                            </ButtonContainer>
                        </TemplateDetails>
                    </TemplateCard>
                ))}
            </TemplateContainer>

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                />
            </Box>
        </Wrapper>
    );
};

export default TemplateContent;
