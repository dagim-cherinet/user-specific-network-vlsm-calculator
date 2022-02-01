const networksDOM = document.querySelector(".networks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".network-form");
const networkInputDOM = document.querySelector(".network-input");
const formAlertDOM = document.querySelector(".form-alert");
// Load networks from /api/networks
const showNetworks = async () => {
  loadingDOM.style.display = "block";
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/v1/get-user-specific-networks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const networks = await response.json();
    console.log(networks);

    if (networks.length < 1) {
      networksDOM.innerHTML =
        '<h5 class="empty-list">No network in your database</h5>';
      loadingDOM.style.display = "none";
      return;
    }
    const allNetworks = networks
      .map((Single_network) => {
        const {
          _id: networkID,
          network_name,
          network_address,
          subnet_mask,
          number_of_allocated_IP,
          number_of_usable_hosts,
          number_of_hosts_wasted,
          first_host_address,
          last_host_address,
          broadcast_address,
        } = Single_network;
        return `<div class="single-network">
<h5><span><i class="far fa-check-circle"></i></span>${network_name}</h5>
<div class="task-links">



<!-- edit link -->
<a href="edit_network.html?id=${networkID}"  class="edit-link">
<i class="fas fa-edit"></i>edit
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${networkID}">
<i class="fas fa-trash"></i>delete
</button>
</div>
</div>
<div class = "network__details">
   <table class="network__table">
       <thead>
          <tr>
              <th>Network Details</th>
              <th></th>
          </tr>
        </thead>
        <tbody>
         <tr>
             <td>Network Address:</td>
             <td>${network_address}</td>
         </tr>
          <tr>
             <td>Subnet Mask:</td>
             <td>${subnet_mask}</td>
         </tr>
          <tr>
             <td>Number of Allocated Address:</td>
             <td>${number_of_allocated_IP}</td>
         </tr>
          <tr>
             <td>Number of Usable Address:</td>
             <td>${number_of_usable_hosts}</td>
         </tr>
          <tr>
             <td>Number of Host Wasted:</td>
             <td>${number_of_hosts_wasted}</td>
         </tr>
          <tr>
             <td>First Host Address:</td>
             <td>${first_host_address}</td>
         </tr>
          <tr>
             <td>Last Host Address:</td>
             <td>${last_host_address}</td>
         </tr>
          <tr>
             <td>Broadcast Address:</td>
             <td>${broadcast_address}</td>
         </tr>
      </tbody>
 </table>

</div>`;
      })
      .join("");
    networksDOM.innerHTML = allNetworks;
  } catch (error) {
    console.log(error);
    networksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.display = "none";
};

showNetworks();

// delete network /api/networks/:id

networksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.display = "block";
    const id = el.parentElement.dataset.id;
    try {
      await axios.delete(`/api/v1/networks/${id}`);
      showNetworks();
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.display = "none";
});
