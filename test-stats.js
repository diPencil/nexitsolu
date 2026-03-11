const fetch = require('node-fetch');

async function testStats() {
    const productId = 'CMMK9PMVQ0008ESK6EGMLQX83'; // From user screenshot
    const url = `http://localhost:3000/api/products/${productId}/stats`;
    
    console.log(`Testing stats update for product: ${productId}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'view' })
        });
        
        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testStats();
