import { useElements,useStripe,CardElement,CardNumberElement, CardExpiryElement, CardCvcElement} from "@stripe/react-stripe-js"
import {useState} from "react"
import Axios from "axios"
import Image1 from "./8.gif"
const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "rgb(0, 55, 107)",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "black" },
			"::placeholder": { color: "#92ccff" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}

function PaymentForm(props){
    const { amount } = props
    const [ load, setLoad ] = useState(false)
    const stripe = useStripe()
    const elements = useElements()

    /*
    const handleSubmit=async(e)=>{
        e.preventDefault()
        console.log(elements.getElement(CardNumberElement))
        const {error,paymentMethod}=await stripe.createPaymentMethod({
            type:"card",
            card:elements.getElement(CardNumberElement)
        })
        console.log(paymentMethod)
        setLoad(true)
        if(!error){
            try{
                const {id} = paymentMethod
                const response = await api.post("payment",{
                    amount:amount,//<=金額
                    id:id
                })
                console.log(response)
                if(response.data.success){
                    completePay()
                }else{
                    alert("お支払いに失敗しました。")
                    setLoad(false)
                }
            }catch(error){
                alert("Error",error)
                setLoad(false)
            }
        }else{
            alert(error.message)
            setLoad(false)
        }
        
    }*/

    const handleSubmit = async (e) => {
        e.preventDefault()
        const email = "kenta.tk.511@gmail.com"
        if (!stripe || !elements) {
          // Stripe.js has not yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }
    
        const res = await Axios.post('http://localhost:8000/pay', {email: email, amount: amount});
    
        const clientSecret = res.data.client_secret;

        console.log(res.data.client_secret)
    
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              email: email,
            },
          },
        });

        console.log(result)
    
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          console.log(result.error.message);
          setLoad(false)
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            // There's a risk of the customer closing the window before callback
            // execution. Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business critical
            // post-payment actions.
            console.log('You got 500$!');
            setLoad(false)
          }
        }
      };

    return(
        <>
        {load
        ?
        <img alt="" src={Image1} className="comu-load-image"/>
        :
        <form onSubmit={handleSubmit}>
            <div className="comu-FormRow">
                <label>カード番号</label>
                <br/>
                <CardNumberElement options={CARD_OPTIONS} className="comu-Form"/>
                <label>有効期限</label>
                <CardExpiryElement  className="comu-Form"/>
                <label>セキュリティーコード</label>
                <CardCvcElement  className="comu-Form"/>
            </div>

            <button>支払い</button>
        </form>
        }
        </>
    )
}
export default PaymentForm