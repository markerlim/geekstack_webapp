import { Button } from '@mui/material';
import React, { useState } from 'react';

const StripeCheckoutIframe = () => {
  const handlePayment = () => {
    window.open("https://buy.stripe.com/6oE7uMgtY4bJ1xe6oo", "_blank");
  };

  return (
    <Button onClick={handlePayment}>
      Join Subcription!
    </Button>
  );
};

export default StripeCheckoutIframe;
