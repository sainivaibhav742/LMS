import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const PaymentForm = ({ amount, courseId, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      // Create payment intent
      const response = await fetch('/api/payment/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          courseId,
          userId: localStorage.getItem('userId')
        })
      })

      const { clientSecret, error: serverError } = await response.json()

      if (serverError) {
        setError(serverError)
        setLoading(false)
        return
      }

      // Confirm payment
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      })

      if (stripeError) {
        setError(stripeError.message)
        setLoading(false)
      } else {
        onSuccess('stripe')
      }
    } catch (err) {
      setError('Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 rounded p-3">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
          },
        }} />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay $${amount}`}
        </button>
      </div>
    </form>
  )
}

const RazorpayPayment = ({ amount, courseId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/payment/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          courseId,
          userId: localStorage.getItem('userId')
        })
      })

      const { orderId, amount: orderAmount, currency, key } = await response.json()

      const options = {
        key,
        amount: orderAmount,
        currency,
        order_id: orderId,
        name: 'LMS Platform',
        description: 'Course Purchase',
        handler: function (response) {
          onSuccess('razorpay')
        },
        prefill: {
          email: localStorage.getItem('userEmail'),
        },
        theme: {
          color: '#6366f1'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Razorpay payment failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Complete your payment with Razorpay</p>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : `Pay ₹${amount}`}
        </button>
      </div>
      <button
        onClick={onCancel}
        className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  )
}

const PayPalPayment = ({ amount, courseId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load PayPal script
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      window.paypal.Buttons({
        createOrder: async () => {
          setLoading(true)
          try {
            const response = await fetch('/api/payment/paypal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount,
                courseId,
                userId: localStorage.getItem('userId')
              })
            })

            const { orderId } = await response.json()
            return orderId
          } catch (err) {
            console.error('PayPal order creation failed:', err)
            setLoading(false)
          }
        },
        onApprove: (data) => {
          onSuccess('paypal')
        },
        onError: (err) => {
          console.error('PayPal payment failed:', err)
          setLoading(false)
        }
      }).render('#paypal-button-container')
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [amount, courseId, onSuccess])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Complete your payment with PayPal</p>
        <div id="paypal-button-container"></div>
        {loading && <p className="text-sm text-gray-500 mt-2">Processing...</p>}
      </div>
      <button
        onClick={onCancel}
        className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  )
}

const PaymentModal = ({ isOpen, onClose, course, amount }) => {
  const [selectedGateway, setSelectedGateway] = useState('stripe')

  if (!isOpen) return null

  const handlePaymentSuccess = (gateway) => {
    alert(`Payment successful via ${gateway}!`)
    onClose()
    // Here you would typically redirect to course or update user's enrolled courses
  }

  const gateways = [
    { id: 'stripe', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'razorpay', name: 'Razorpay (India)', icon: '🇮🇳' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">{course?.title}</h3>
          <p className="text-2xl font-bold text-indigo-600">${amount}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="space-y-2">
            {gateways.map((gateway) => (
              <label key={gateway.id} className="flex items-center">
                <input
                  type="radio"
                  name="gateway"
                  value={gateway.id}
                  checked={selectedGateway === gateway.id}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">{gateway.icon} {gateway.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          {selectedGateway === 'stripe' && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={amount}
                courseId={course?.id}
                onSuccess={() => handlePaymentSuccess('Stripe')}
                onCancel={onClose}
              />
            </Elements>
          )}

          {selectedGateway === 'razorpay' && (
            <RazorpayPayment
              amount={amount}
              courseId={course?.id}
              onSuccess={() => handlePaymentSuccess('Razorpay')}
              onCancel={onClose}
            />
          )}

          {selectedGateway === 'paypal' && (
            <PayPalPayment
              amount={amount}
              courseId={course?.id}
              onSuccess={() => handlePaymentSuccess('PayPal')}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
