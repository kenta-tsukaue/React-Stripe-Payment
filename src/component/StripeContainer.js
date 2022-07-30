import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from "./PaymentForm"
const PUBLIC_KEY="YOUR_PUBLIC_KEY"
const stripeTestPromise=loadStripe(PUBLIC_KEY)
export default function StripeContainer(props){
    return(
        <Elements stripe={stripeTestPromise}>
            <PaymentForm amount={4000}/>
        </Elements>
    )
}