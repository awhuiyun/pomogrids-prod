const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default function GetPremiumSuccessPage() {
  return <div>Thanks for your subscription!</div>;
}
