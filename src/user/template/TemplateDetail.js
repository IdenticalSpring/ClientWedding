import React from 'react';
import { useParams } from 'react-router-dom';

const TemplateDetail = () => {
    const { id } = useParams(); 

    return (
        <div>
            <h1>Chi tiết template với ID: {id}</h1>
        </div>
    );
};

export default TemplateDetail;
