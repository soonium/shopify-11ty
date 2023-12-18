const fetch = require('node-fetch');


exports.handler = async (event) => {

  const rootURL = process.env.URL || "https://localhost:8888";
  console.log("URL>> " + rootURL);

  const cartId = event.queryStringParameters.cartId;
  console.log("cartId>> " + cartId); 

  const result = await fetch(`${rootURL}/api/get-cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cartId: cartId
    }),
  })
  .then((res) =>{
    return res.json()
  });
  
  const checkout_result = await fetch(`${rootURL}/api/get-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cartId: cartId
    }),
  })
  .then((res) =>{
    return res.json()
  });


  const itemTotal = function(price, quantity) {
    const totalPrice = Number(price) * Number(quantity)
    return totalPrice.toFixed(2)
  }


  const cartItem = (cartId, item) => {
    const displayTitleModifier = item.merchandise.title == "Default Title" ? "" : item.merchandise.title;
    return ` <tr class="cart-table-row">
    <td class="cart-table-cell">
      <a href"=/products/${item.merchandise.product.handle}">
        ${ item.merchandise.product.title } (${ item.merchandise.title })
      </a>
    </td>
    <td class="cart-table-cell">
      ${item.merchandise.priceV2.amount}
    </td>
    <td class="cart-table-cell">${ item.quantity }</td>
    <td class="cart-table-cell">
      ${ itemTotal(item.merchandise.priceV2.amount, item.quantity) }
    </td>
    <td class="cart-table-cell">
      <form action="/api/remove-from-cart" method="POST">
        <input type="hidden" name="cartId" value="${cartId}">
        <input type="hidden" name="lineId" value="${item.id}">
        <input type="submit" value="Remove item">
      </form>
    </td>
  </tr>
`};
  
  const cartTotals = (cart) => {
    
    if (!cart.lines.edges.length) {
      console.log(`No basket`);
      return `<div class="cart-total-content">
        <div class="cart-total-column">
          <a href="/">Empty Cart</a>
        </div>
      </div>`;
    }

    return `
    <div class="cart-total-content">
      <div class="cart-total-column">
        <p>
          <strong>Subtotal:</strong>
        </p>
        <p>Shipping:</p>
        ${cart.cost.totalTaxAmountEstimated ? `<p>Tax:</p>` : ''}
        <p>Total:</p>
      </div>
      <div class="cart-total-column">
        <p>
          <strong>${cart.cost.subtotalAmount.amount} ${cart.cost.subtotalAmount.currencyCode} </strong>
        </p>
        <p>Free Shipping</p>
        ${cart.totalTaxAmountEstimated ? `<p>${cart.cost.totalTaxAmount.amount !== null ? cart.cost.totalTaxAmount.amount : 'N/A'} ${cart.cost.totalAmount.currencyCode} </p>` : ''}
        <p>${cart.cost.totalAmount.amount} ${cart.cost.totalAmount.currencyCode} </p>
      </div>
    </div>`;
  }

  
  let items = "";
    result.cart.lines.edges.forEach(item => {
    items += cartItem(result.cart.id, item.node)
  });

  


  const pageTemplate = (items, totals) => {return `
  <html>
  <head>
    <link rel="stylesheet" href="/css/main.css">
    <title>Your Cart</title>
  </head>
  <body>
  
    <header class="app-header">
      <h1>Band-A</h1>
      <nav class="main-nav">
        <ul>
        <li class="main-nav-item">
          <a href="/">All<a>
        </li>
        <li class="main-nav-item">
          <a href="/merch">merch<a>
        </li>
        <li class="main-nav-item">
          <a href="/music">music<a>
        </li>
        <li class="main-nav-item">
          <div class="cart-size"></div>
          <a href="/cart" class="cart cartLink">Shopping Cart</a>
        </li>
        </ul>
      </nav>
    </header>
    <main>
      <div class="cart-page">
      <article class="cart-page-content">
        <h1>Your Cart</h1>
        <div>
        <table class="cart-table">
        <thead>
          <th class="cart-table-heading">Item</th>
          <th class="cart-table-heading">Price</th>
          <th class="cart-table-heading">Quantity</th>
          <th class="cart-table-heading">Total</th>
          <th class="cart-table-heading">Actions</th>
        </thead>
        <tbody>
        ${items}
        </tbody>
        </table>
        <section class="cart-total">
        ${cartTotals(result.cart)}
        </section>
        </div>
        <div>
          <a href = "${checkout_result.cart.checkoutUrl}"> CHECKOUT </A>
          <br/>
        </div
      </article>
    </div>
    </main>
    <footer>
      <section class="testimonial">
        <h2>
          NEW ALBUM OUT NOW
        </h2>
        <p>Buy Now!</p>
      </section>
      <section class="app-footer-links">
        <ul>
          <li>About</li>
          <li>Company</li>
          <li>Locations</li>
          <li>Contact</li>
          <li>Hours</li>
        </ul>
        <ul>
          <li>Twitter</li>
          <li>Facebook</li>
          <li>Instagram</li>
          <li>LinkedIn</li>
        </ul>
        <div class="newsletter">
          <h2 class="newsletter-title">Sign up for our newsletter:</h2>
          <input
            class="newsletter-input"
            type="email"
            placeholder="Enter your email"
          />
        </div>
      </section>
  
    </footer>
    <script src="/js/shopping-ui.js"></script>
  </body>
  </html>
  `};
    
  return {
    statusCode: 200,
    body: pageTemplate(items, result.cart.cost)
  };

}