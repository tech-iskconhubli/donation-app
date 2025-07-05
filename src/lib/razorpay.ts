declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface DonationFormData {
  fullName: string;
  email: string;
  phone: string;
  seva: string;
  donationAmount: number;
  customAmount?: number;
  taxExemption: boolean;
  panNumber?: string;
  prasadam: boolean;
  address?: string;
  pinCode?: string;
  campaignId?: string;
}

export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const processPayment = async (formData: DonationFormData) => {
  const res = await initializeRazorpay();
  
  if (!res) {
    alert('Razorpay SDK failed to load. Please check your connection.');
    return;
  }

  const amount = formData.customAmount || formData.donationAmount;
  
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount * 100, // Razorpay expects amount in paisa
    currency: 'INR',
    name: 'Donation Campaign',
    description: `Donation for ${formData.seva}${formData.campaignId ? ` (Campaign: ${formData.campaignId})` : ''}`,
    image: 'https://www.fueladream.com/public/uploads/0894810651297247.jpg',
    handler: function (response: any) {
      // Send payment details to backend for capture
      const capturePayment = async () => {
        try {
          console.log('Attempting to capture payment:', response.razorpay_payment_id);
          
          const captureResponse = await fetch('/api/payments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              amount: amount,
              campaignId: formData.campaignId,
              ...formData
            })
          });
          
          const result = await captureResponse.json();
          
          if (result.success && result.status === 'captured') {
            console.log('Payment captured successfully:', result);
            // Redirect to success page
            const successUrl = formData.campaignId 
              ? `/success?campaign=${formData.campaignId}&payment=${response.razorpay_payment_id}&status=captured`
              : `/success?payment=${response.razorpay_payment_id}&status=captured`;
            window.location.href = successUrl;
          } else {
            console.warn('Payment was authorized but capture failed:', result);
            // Still redirect to success but with different status
            const successUrl = formData.campaignId 
              ? `/success?campaign=${formData.campaignId}&payment=${response.razorpay_payment_id}&status=authorized`
              : `/success?payment=${response.razorpay_payment_id}&status=authorized`;
            window.location.href = successUrl;
          }
        } catch (error) {
          console.error('Error during payment capture:', error);
          // Fallback - still redirect to success page with error status
          const successUrl = formData.campaignId 
            ? `/success?campaign=${formData.campaignId}&payment=${response.razorpay_payment_id}&status=error`
            : `/success?payment=${response.razorpay_payment_id}&status=error`;
          window.location.href = successUrl;
        }
      };
      
      capturePayment();
    },
    prefill: {
      name: formData.fullName,
      email: formData.email,
      contact: formData.phone,
    },
    notes: {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      seva: formData.seva,
      want_tax_exemption: formData.taxExemption,
      pan_number: formData.panNumber || '',
      want_prasadam: formData.prasadam || "",
      address: formData.address ? formData.address + " - " + formData.pinCode : "",
      campaignId: formData.campaignId || 'default',
    },
    theme: {
      color: '#3399cc',
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};
