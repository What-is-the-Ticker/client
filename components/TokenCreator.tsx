// components/TokenCreator.js
import React, { useState } from 'react';

export default function TokenCreator() {
  const [transactionSignature, setTransactionSignature] = useState(null);

  const handleCreateToken = async () => {
    console.log('Creating token...');
    try {
      const response = await fetch('/api/create-token', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        setTransactionSignature(data.signature);
        alert(`Token created! Transaction Signature: ${data.signature}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Token creation failed');
    }
  };

  return (
    <div>
      <button onClick={handleCreateToken}>Create Token</button>
      {transactionSignature && (
        <p>
          View Transaction:{' '}
          <a
            href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {transactionSignature}
          </a>
        </p>
      )}
    </div>
  );
}
