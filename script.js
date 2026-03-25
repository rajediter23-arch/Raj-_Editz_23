// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Smooth Scroll
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Place Order
async function placeOrder() {
  const btn = event.target;
  btn.innerText = "⏳ Sending...";

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const service = document.getElementById("service").value;
  const details = document.getElementById("details").value.trim();

  if (!name || !phone) {
    alert("Fill all details");
    btn.innerText = "Submit Order";
    return;
  }

  try {
    const doc = await db.collection("orders").add({
      name,
      phone,
      service,
      details,
      payment: "Pending",
      status: "Processing",
      time: new Date()
    });

    // WhatsApp Format
    const msg = `🔥 NEW ORDER
👤 Name: ${name}
📞 Phone: ${phone}
🎯 Service: ${service}
📝 Details: ${details}
🆔 Order ID: ${doc.id}`;

    window.open(`https://wa.me/919752973541?text=${encodeURIComponent(msg)}`);

    alert("✅ Order Placed Successfully!");

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("details").value = "";

  } catch (e) {
    alert("Error!");
  }

  btn.innerText = "Submit Order";
}

// Order Status Check
async function checkStatus() {
  const id = document.getElementById("orderId").value;

  if (!id) return alert("Enter Order ID");

  try {
    const doc = await db.collection("orders").doc(id).get();

    if (doc.exists) {
      const d = doc.data();
      document.getElementById("statusResult").innerHTML =
        `📦 Status: ${d.status} <br> 💰 Payment: ${d.payment}`;
    } else {
      alert("Order not found");
    }
  } catch {
    alert("Error fetching status");
  }
}

// Admin update status
async function updateStatus(id) {
  const newStatus = prompt("Enter Status (Done / Processing)");

  if (!newStatus) return;

  await db.collection("orders").doc(id).update({
    status: newStatus
  });

  loadOrders();
}