import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, amount, delay = 5000 } = body; // Default 5 second delay
    
    console.log(`Scheduling retry capture for payment ${paymentId} after ${delay}ms`);
    
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Attempt capture again
    const captureResponse = await retryPaymentCapture(paymentId, amount);
    
    return NextResponse.json({
      success: captureResponse.success,
      message: captureResponse.success 
        ? 'Payment captured successfully on retry' 
        : 'Retry capture failed',
      data: captureResponse.data,
      error: captureResponse.error,
      paymentId: paymentId
    });
    
  } catch (error) {
    console.error('Retry capture error:', error);
    return NextResponse.json(
      { success: false, message: 'Retry capture failed' }, 
      { status: 500 }
    );
  }
}

// Retry capture function
async function retryPaymentCapture(paymentId: string, amount: number) {
  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_SECRET;
  
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return { 
      success: false, 
      error: 'Razorpay credentials not configured' 
    };
  }
  
  try {
    // First check current status
    const statusUrl = `https://api.razorpay.com/v1/payments/${paymentId}`;
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    
    const statusResponse = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      }
    });
    
    const statusResult = await statusResponse.json();
    
    // If already captured, return success
    if (statusResult.status === 'captured') {
      return { 
        success: true, 
        data: statusResult,
        message: 'Payment was already captured'
      };
    }
    
    // If not authorized, cannot capture
    if (statusResult.status !== 'authorized') {
      return { 
        success: false, 
        error: `Payment status is '${statusResult.status}'. Cannot capture.`
      };
    }
    
    // Attempt capture
    const captureUrl = `https://api.razorpay.com/v1/payments/${paymentId}/capture`;
    
    const captureResponse = await fetch(captureUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Amount in paisa
        currency: 'INR'
      })
    });
    
    const captureResult = await captureResponse.json();
    
    if (captureResponse.ok && captureResult.status === 'captured') {
      return { success: true, data: captureResult };
    } else {
      return { 
        success: false, 
        error: captureResult.error?.description || 'Retry capture failed' 
      };
    }
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error during retry'
    };
  }
}
