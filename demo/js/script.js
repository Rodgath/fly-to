/*  Get all the accordion headers */
const accordionHeaders = document.querySelectorAll('.accordion-header');

/*  Loop through each header and add a click event listener */
accordionHeaders.forEach(header => {
  header.addEventListener('click', function () {

    /* Get the corresponding content for this header */
    const content = this.nextElementSibling;

    /* Toggle the accordion content with slide effect */
    toggleAccordionContent(header, content);
  });
});

/* Toggle the accordion content with slide effect */
function toggleAccordionContent(header, content) {
  let heightAdjust = 8; // Adjust the speed of the slide by changing this value
  let startHeight = 0;
  const maxHeight = content.scrollHeight;
  
  function expandAccordion() {

    header.classList.add('active');

    content.classList.remove('hidden');

    startHeight += heightAdjust;

    if (startHeight < maxHeight) {
      content.style.height = `${startHeight}px`;
      requestAnimationFrame(expandAccordion);
    } else {
      content.style.height = null;
    }
  }

  function collapseAccordion() {
    startHeight -= heightAdjust;

    if (Math.abs(startHeight) < maxHeight) {
      content.style.height = maxHeight - Math.abs(startHeight) + 'px';
      requestAnimationFrame(collapseAccordion);
    } else {
      content.style.height = null;
      header.classList.remove('active');
      content.classList.add('hidden');
    }
  }

  if (content.classList.contains('hidden')) {
    expandAccordion();
  } else {
    collapseAccordion();
  }
}


/* Manage Store Cart */
document.addEventListener('DOMContentLoaded', function () {
  const cartDropdown = document.querySelector('.cart-dropdown');
  const cartItems = document.querySelector('.cart-items');

  cartDropdown.addEventListener('click', function () {
      cartItems.classList.toggle('open');
  });

  /* Open the cart dropdown */
  function openCart() {
    cartItems.classList.add('open');
  }

  /* Close the cart dropdown */
  function closeCart() {
    cartItems.classList.remove('open');
  }

  cartDropdown.addEventListener('click', function (event) {
    /* Prevent the click event from propagating further */
    event.stopPropagation();
    openCart();
  });

  /* Add a click event listener to the document to close the cart dropdown */
  document.addEventListener('click', function (event) {
    const isCartClicked = event.target.closest('.cart-dropdown');

    if (!isCartClicked) {
      closeCart();
    }
  });

  /* Example: Add an item to the cart */
  function addItemToCart(productName, productPrice, productImage) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    cartItem.innerHTML = `
      <img class="cart-dd-image" src="${productImage}" alt="${productName}">
      <span class="cart-dd-name">${productName}</span>
      <span class="cart-dd-price">$${productPrice}</span>
    `;

    cartItems.appendChild(cartItem);
  }
  
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  addToCartButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      
      const productContainer = this.closest('.product');
      const productName = productContainer.querySelector('h2').textContent;
      const productPrice = parseFloat(productContainer.querySelector('.price').textContent.match(/\d+\.\d+/)[0]); // Get digits only
      const productImage = productContainer.querySelector('img');
      const imageSrc = productImage.getAttribute('src');
      
      addItemToCart(productName, productPrice, imageSrc);
    });
  });
});
