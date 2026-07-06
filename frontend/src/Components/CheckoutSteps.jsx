import React from 'react';

const CheckoutSteps = ({ currentStep }) => {
  const steps = ['BAG', 'ADDRESS', 'PAYMENT'];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = currentStep >= stepNum;
        return (
          <div key={label} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              backgroundColor: isActive ? '#7b2424' : '#ccc',
              color: '#fff',
              fontWeight: 'bold',
              lineHeight: '32px',
              margin: '0 auto'
            }}>{stepNum}</div>
            <div style={{ color: isActive ? '#7b2424' : '#999', marginTop: 6 }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
