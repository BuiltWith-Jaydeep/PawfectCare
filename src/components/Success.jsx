import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate('/service'), 3000);
  }, [navigate]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Redirecting to service page in 3 seconds...</p>
    </div>
  );
};

export default Success;