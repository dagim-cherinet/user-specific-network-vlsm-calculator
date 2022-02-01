const networkIDDOM = document.querySelector(".network-edit-id");
const networkNameDOM = document.querySelector(".network-edit-name");
const networkCompletedDOM = document.querySelector(".network-edit-completed");
const editFormDOM = document.querySelector(".single-network-form");
const editBtnDOM = document.querySelector(".network-edit-btn");
const formAlertDOM = document.querySelector(".form-alert");
const params = window.location.search;
const id = new URLSearchParams(params).get("id");
let tempName;

const showNetwork = async () => {
  try {
    const {
      data: { network },
    } = await axios.get(`/api/v1/networks/${id}`);
    const { _id: networkID, completed, network_name } = network;

    networkIDDOM.textContent = networkID;
    networkNameDOM.value = network_name;
    tempName = network_name;
    if (completed) {
      networkCompletedDOM.checked = true;
    }
  } catch (error) {
    console.log(error);
  }
};

showNetwork();

editFormDOM.addEventListener("submit", async (e) => {
  editBtnDOM.textContent = "Loading...";
  e.preventDefault();
  try {
    const networkName = networkNameDOM.value;
    const networkCompleted = networkCompletedDOM.checked;

    const {
      data: { network },
    } = await axios.patch(`/api/v1/networks/${id}`, {
      network_name: networkName,
      completed: networkCompleted,
    });

    const { _id: networkID, completed, network_name } = network;

    networkIDDOM.textContent = networkID;
    networkNameDOM.value = network_name;
    tempName = network_name;
    if (completed) {
      networkCompletedDOM.checked = true;
    }
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, edited Sub-Network`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    console.log(error);
    console.error(error);
    networkNameDOM.value = tempName;
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  editBtnDOM.textContent = "Edit";
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});
