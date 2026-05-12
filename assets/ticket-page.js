 document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    let phoneNumber = urlParams.get("phone_no") || "{{ customer.phone | remove: '+' | remove: ' ' }}";
    if (urlParams.has("phone_no")) {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("phone_no");
      window.history.replaceState({}, document.title, cleanUrl.toString());
    }
    if (phoneNumber) {
      phoneNumber = phoneNumber.replace(/\D/g, "");
      if (phoneNumber.length >= 10) {
        phoneNumber = phoneNumber.slice(-10);
      }
      fetch(`https://care.deodap.in/api/deodap_in/tickets/${phoneNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 12|kRXTYtwkjISfsWVeSVKMa4lmB6fanJIqXQbqfMKG806baf8a'
        }
      })
      .then(response => response.json())
      .then(data => {
        const ticketsResultsContainer = document.getElementById('ticketsResults');
        ticketsResultsContainer.innerHTML = '';
        if (data.status === "success" && data.data.length > 0) {
          data.data.forEach(ticket => {
            let ticketDiv = document.createElement('div');
            ticketDiv.classList.add('ticket-card');
            ticketDiv.innerHTML = `
              <p style="margin: 0; line-height:normal;"><span class="tck-head">Issue: </span> <a class="ticket-acc-issue" href="${ticket.url}" target="_blank">${ticket.issue}</a></p>
              <hr class="tck-hr">
              <p class="tck-sts-p"><span class="tck-head">Status:</span> <span class="tck-status" style="color: ${ticket.status === 'Closed' ? '#ec1a23' : 'green'};">${ticket.status}</span></p>
              <p class="tck-crt-p"><span class="tck-head">Created At:</span> <span class="tck_create">${ticket.created_at}</span></p>
              <p class="tck-son-p"><span class="tck-head">Order no.:</span> <span class="tck_create">${ticket.shopify_order_no}</span></p>
              <p class="tck-url-p"><a class="ticket-acc-url" href="${ticket.url}" target="_blank">View Ticket</a></p>
            `;
            ticketsResultsContainer.appendChild(ticketDiv);
          });
        } else {
          ticketsResultsContainer.innerHTML = `<p style="color: red;">No tickets found.</p>`;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        document.getElementById('ticketsResults').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
      });
    }
  });