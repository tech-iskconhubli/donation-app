import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, amount, campaignId } = body;
    
    // If we have a paymentId, attempt to capture the payment
    if (paymentId) {
      try {
        // Capture payment using Razorpay REST API
        const captureResponse = await capturePaymentWithAPI(paymentId, amount);
        
        if (captureResponse.success) {
          console.log('Payment captured successfully:', {
            paymentId,
            amount,
            campaignId: campaignId || 'default',
            status: 'captured',
            timestamp: new Date().toISOString()
          });
          
          return NextResponse.json({ 
            success: true, 
            message: 'Payment captured successfully',
            paymentId: paymentId,
            status: 'captured',
            campaignId: campaignId || 'default'
          });
        } else {
          console.error('Payment capture failed:', captureResponse.error);
          return NextResponse.json(
            { 
              success: false, 
              message: 'Payment capture failed',
              error: captureResponse.error,
              paymentId: paymentId,
              status: 'authorized'
            }, 
            { status: 500 }
          );
        }
      } catch (captureError) {
        console.error('Payment capture error:', captureError);
        return NextResponse.json(
          { 
            success: false, 
            message: 'Payment capture failed due to server error',
            paymentId: paymentId,
            status: 'authorized'
          }, 
          { status: 500 }
        );
      }
    }
    
    // Fallback for payments without paymentId
    console.log('Payment received:', {
      ...body,
      timestamp: new Date().toISOString(),
      campaignId: body.campaignId || 'default'
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment processed successfully',
      campaignId: body.campaignId || 'default'
    });
    
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment processing failed' }, 
      { status: 500 }
    );
  }
}

// Function to capture payment using Razorpay REST API
async function capturePaymentWithAPI(paymentId: string, amount: number) {
  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_SECRET;
  
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return { 
      success: false, 
      error: 'Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.' 
    };
  }
  
  try {
    const url = `https://api.razorpay.com/v1/payments/${paymentId}/capture`;
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    
    const response = await fetch(url, {
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
    
    const result = await response.json();
    
    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, error: result.error || 'Capture failed' };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

// GET endpoint to retrieve campaign-specific payment data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    
    // Here you would typically query your database for campaign-specific payment data
    // For now, return mock data
    
    return NextResponse.json({
      success: true,
      campaignId: campaignId || 'all',
      message: 'Payment data retrieved successfully',
      // In a real app, this would be actual payment data from your database
      data: {
        totalDonations: 0,
        donationCount: 0,
        lastDonation: null
      }
    });
    
  } catch (error) {
    console.error('Error retrieving payment data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve payment data' },
      { status: 500 }
    );
  }
}
