const API_URL = "https://enchanting-wraps.onrender.com"; // your render URL

async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();
  products = data;
  populateCategories();
  renderProducts();
}

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(contactForm);
  const obj = Object.fromEntries(fd.entries());
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(obj)
  });
  if(res.ok){ alert('Message sent!'); contactForm.reset(); }
  else alert('Error sending message.');
});


