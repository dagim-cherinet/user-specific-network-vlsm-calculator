const networksDOM = document.querySelector(".networks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".network-form");
const networkInputDOM = document.querySelector(".network-input");
const formAlertDOM = document.querySelector(".form-alert");
// Load tasks from /api/tasks
const showNetworks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { networks },
    } = await axios.get("/api/v1/networks");
    console.log(networks);

    if (networks.length < 1) {
      networksDOM.innerHTML =
        '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }
    const allNetworks = networks
      .map((Single_network) => {
        const { completed, _id: networkID, name } = Single_network;
        return `<div class="single-network ${completed && "task-completed"}">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">



<!-- edit link -->
<a href="network.html?id=${networkID}"  class="edit-link">
<i class="fas fa-edit"></i>edit
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${networkID}">
<i class="fas fa-trash"></i>delete
</button>
</div>
</div>`;
      })
      .join("");
    networksDOM.innerHTML = allNetworks;
  } catch (error) {
    console.log(error);
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = "hidden";
};

showNetworks();

// delete task /api/tasks/:id

networksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    try {
      await axios.delete(`/api/v1/networks/${id}`);
      showNetworks();
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = "hidden";
});

// form

// formDOM.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const name = taskInputDOM.value;

//   try {
//     await axios.post("/api/v1/networks", { name });
//     showNetworks();
//     networkInputDOM.value = "";
//     formAlertDOM.style.display = "block";
//     formAlertDOM.textContent = `success, task added`;
//     formAlertDOM.classList.add("text-success");
//   } catch (error) {
//     formAlertDOM.style.display = "block";
//     formAlertDOM.innerHTML = `error, please try again`;
//   }
//   setTimeout(() => {
//     formAlertDOM.style.display = "none";
//     formAlertDOM.classList.remove("text-success");
//   }, 3000);
// });
const child = document.createElement("div");
child.innerHTML = `<button class="clickMe">click me</button>`;
document.body.appendChild(child);
document.querySelector(".clickMe").addEventListener("click", () => {
  saveToDB();
});
const saveToDB = async () => {
  let name = "255.255.255.255";
  let network_name = "QQQQQQQQQQ";
  for (let i = 0; i < 2; i++) {
    try {
      await axios.post("/api/v1/networks", { name, network_name });
      showNetworks();
      // taskInputDOM.value = "";
      formAlertDOM.style.display = "block";
      formAlertDOM.textContent = `success, task added`;
      formAlertDOM.classList.add("text-success");
    } catch (error) {
      formAlertDOM.style.display = "block";
      formAlertDOM.innerHTML = `error, please try again`;
    }
  }
};
