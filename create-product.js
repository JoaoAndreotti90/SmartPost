require('dotenv').config();
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createProduct() {
  try {
    const price = await stripe.prices.create({
      currency: 'brl',
      unit_amount: 2990,
      product_data: {
        name: 'Pacote 10 Créditos',
      },
    });

    console.log('Copie este ID para o seu .env:');
    console.log(`STRIPE_PRICE_ID="${price.id}"`);
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

createProduct();