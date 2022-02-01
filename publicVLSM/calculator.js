String.prototype.padLeft = function (l, c) {
  return Array(l - this.length + 1).join(c || " ") + this;
};

//Used for clearing arrays
Array.prototype.clear = function () {
  while (this.length > 0) {
    this.pop();
  }
};

//Creates Error Messages
function throw_error(text) {
  alert("ERROR: " + text);
}

//Test to see if a value is a number
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//Creates a percentage from the 2 numbers passed (rounded to nearest integer). It will return what percentage of b a is
function getPercent(a, b) {
  return Math.round((a / b) * 100);
}

//Put the cursor focus back onto the CIDR box and style it when there is an error
function cidrError() {}

//Put the cursor focus back onto the Network box and style it when there is an error
function netError() {}
//console.log("hello world");
var maskBits = 0; //Holds the numeric form (number of bits) of the address block's mask.
var fullMask = ""; //Holds the dot-decimal form of the address block's mask.
var ip = ""; //This holds the ip address entered in the CIDR block. This is only different than the below address (netAddress) if the address entered has 1 bits that extend beyond the mask.
var netAddress = ""; //This holds the base address of the address block.

// when the user enter the ip address
let enter = document.getElementById("enter");
enter.addEventListener("click", () => {
  //validateIP();
  updateCIDR();
});
// function that validate the ip address
const validateIP = (text) => {
  //let text = document.getElementById("ip");
  //console.log(text);
  if (text.value == "") {
    throw_error("You must enter an IP Address & Mask. You entered nothing.");
    text.value = "";
    cidrError();
    return false;
  }
  var val = text.value.split("/");
  //Make sure only 1 slash "/" exists.
  if (val.length != 2) {
    throw_error(
      "You either didn't enter a subnet mask or you entered it incorrectly. Also, make sure you use a forward slash '/'."
    );
    cidrError();
    text.value = "";
    return false;
  }
  //Make sure Mask is between 1 and 32
  if (val[1] > 32 || val[1] < 1) {
    throw_error(
      "You have entered an invalid mask number. It must be a number from 1 to 32."
    );
    cidrError();
    text.value = "";
    return false;
  }
  //Validate IP Address
  ip = val[0].split(".");

  //Make sure IP address has 4 values separated by 3 dots
  if (ip.length != 4) {
    throw_error("Your IP address is invalid. It must be in the format X.X.X.X");
    cidrError();
    text.value = "";
    return false;
  }
  for (let c = 0; c < ip.length; c++) {
    //Perform Test
    if (
      ip[c] <= -1 ||
      ip[c] > 255 ||
      !isNumber(ip[c]) ||
      ip[c].indexOf(" ") !== -1
    ) {
      throw_error(
        "Your IP address value " +
          ip[c] +
          " is invalid. All values must be a positive number from 0 to 255 and must not contain spaces."
      );
      cidrError();

      text.value = "";
      return false;
    }
    //Don't allow numbers with zero padding (i.e. 05 or 026 or 000128) as they will pass the above tests
    var numArr = ip[c].split("");
    if (numArr[0] == 0 && numArr.length > 1) {
      throw_error(
        "Your IP address value " +
          ip[c] +
          " is invalid. Please do not pad numbers with leading zeros."
      );
      cidrError();
      text.value = "";
      return false;
    }
  }

  //If all is good, style the text box
  // text.className = "ip_style_good";
  text.classList.add("ip_style_good");
  // document.body.classList.toggle("box_style_good");
  console.log(text.value);
  text.disabled = true;
  enter.disabled = true;
  return true;
};
//Calculates a full subnet mask from a number of bits (Example: 24 = 255.255.255.0)
function getFullMask(m) {
  //Get the number of full bytes (which will be 255)
  var fullBytes = Math.floor(m / 8);
  //Get the number of leftover bits after the above statement
  var leftOvers = m % 8;

  //Build an array containing each of the 4 numbers of the mask
  var mask = new Array();
  var control = 0;
  for (var c = 0; c < 4; c++) {
    if (c < fullBytes) {
      mask[c] = 255;
    } else {
      //Build Binary String of the next number
      mask[c] = "";
      for (var n = 1; n < 9; n++) {
        if (n <= leftOvers && control == 0) {
          mask[c] += "1";
        } else {
          mask[c] += "0";
        }
      }
      //Convert Binary to Decimal
      mask[c] = parseInt(mask[c], 2);
      control = 1;
    }
  }
  return mask.join(".");
}
//Inverts a binary number (i.e 11010 to 00101). Accepts only a binary string. Returns the same number of bits as were received.
function invertBinary(num) {
  //The statement below converts the string to a number, then XORs it with a string of 1s (converted to a number) the same length as the string we are inverting.
  //We then add it to a binary string of 32 0s to make it a 32-bit number.
  //It then converts it back to a binary string and cuts off the number of bits from the end that we started with and returns it.
  return (
    "00000000000000000000000000000000" +
    (parseInt(num, 2) ^ parseInt("".padLeft(num.length, "1"), 2)).toString(2)
  ).slice(-num.length);
}
//Will convert a dot-decimal address or mask into a number.
//NOTE: This function returns a number. NOT a binary string. You will have to convert it to a string if you want to display the binary equivialent.
//Binary numbers don't exist in JavaScript, so they are usually converted to DECIMAL or HEXADECIMAL form for calculations and bitwise operations.
//That is why all binary numbers are strings in JavaScript.
function address2Num(address) {
  //We will perform no validation because the address being passed should have already been validated in previous operations
  var a = address.split(".");
  var r = parseInt(a[0]).toString(2).padLeft(8, "0");
  r += parseInt(a[1]).toString(2).padLeft(8, "0");
  r += parseInt(a[2]).toString(2).padLeft(8, "0");
  r += parseInt(a[3]).toString(2).padLeft(8, "0");
  //We now have a 32-bit binary string. It is then converted to a number and returned.
  return parseInt(r, 2);
}

//Will convert a number to a dot-decimal address. Returns a string in dot-decimal format (i.e. 192.168.3.0)
function num2Address(num) {
  //First, make sure the number is 32-bits long
  num = num.toString(2).padLeft(32, "0");
  //Now split it into 8-bit chunks, convert to decimal, and join together
  return new Array(
    parseInt(num.substr(0, 8), 2),
    parseInt(num.substr(8, 8), 2),
    parseInt(num.substr(16, 8), 2),
    parseInt(num.substr(24, 8), 2)
  ).join(".");
}
//Given an IP address and Full Mask, it will return the network address. It will return it as an array of 2 different values.
//The first value will be number representation of the network address.
//The second will be a string with the network address in dot-decimal format (i.e. 192.168.3.0)
function getNetAddress(ip, mask) {
  //Gets the network address by ANDing the ip address and the mask. Then the >>> 0 makes sure the result is interpreted as an unsigned 32-bit binary value.
  n = (address2Num(ip) & address2Num(mask)) >>> 0;
  return new Array(n, num2Address(n));
}
//Calculates number of addresses in a block using the given subnet mask or number of mask bits. Accepts full subnet mask (i.e. 255.255.255.0) or a bit count (i.e. 24)
function getAddressCount(mask) {
  if (mask == 32 || mask == "255.255.255.255") {
    //Make sure the function returns zero if the mask is 32 bits long
    return 0;
  }
  //First check to see if this is a subnet mask or a number of bits
  if (mask.split(".").length == 4) {
    //This is a full subnet mask
    var m = mask.split(".");
    var mArr = new Array();
    //Convert each part of the mask to binary
    for (var c = 0; c < 4; c++) {
      mArr[c] = parseInt(m[c]).toString(2).padLeft(8, "0");
    }
    //Finally see how many zeros are on the end of the binary 32-bit mask and calculate the address count
    return Math.pow(2, mArr.join("").split("0").length - 1);
  } else {
    //This is a bit count
    //Return value
    return Math.pow(2, 32 - mask);
  }
}

//Calculates what class an address belongs to. Excepts only a v4 IP Address in Dot-Decimal format (192.168.2.3)
function getClass(a) {
  var arr = a.split(".");
  var bin = parseInt(arr[0]).toString(2).padLeft(8, "0"); //Create 8-Bit Binary String
  if (bin.substr(0, 1) == "0") {
    return "A";
  }
  if (bin.substr(0, 2) == "10") {
    return "B";
  }
  if (bin.substr(0, 3) == "110") {
    return "C";
  }
  if (bin.substr(0, 4) == "1110") {
    return "D";
  }
  if (bin.substr(0, 4) == "1111") {
    return "E";
  }
}
function updateCIDR() {
  //Get the value entered into the CIDR text box (IP Address/Mask)

  let text = document.getElementById("ip");
  //Create a variable for the div that displays the Address Block information

  //Validate the content before displaying details. If invalid, display error instead.
  if (validateIP(text)) {
    //If the IP Address & Mask are validated, compute and display the information textbox.
    //Clear any values and styles in the box before continuing in case the user decides to change the address block.

    //Put Values into variables
    var values = text.value.split("/");
    ip = values[0];
    maskBits = values[1];

    //Get the full subnet mask
    fullMask = getFullMask(maskBits);

    //Get the actual network address in case the address entered in the CIDR box contains bits that extend beyond the mask (i.e. 192.168.0.25/24)
    netAddress = getNetAddress(ip, fullMask)[1];

    //Build the output for the Address Block information box
    let displayDiv = document.createElement("div");
    displayDiv.innerHTML = `<div>
    <p>Information for Address Block</p>
    <ul>
    <li>Network Address: ${netAddress}</li>
    <li>Full-Mask: ${fullMask}</li>
    <li>Number of Address: ${getAddressCount(maskBits).toLocaleString()}</li>
    <li>Address Class: ${getClass(ip)}</li>
    </ul>
    </div > `;
    document.getElementById("outer__container").appendChild(displayDiv);
  }
  // else {
  //   //If the entered IP/Mask is invalid
  //   cidrDisplayBox.style.display = "none";
  // }

  //Updates the networks box if it is active
  //if (networks.length > 0) {
  //updateNets();
  //}
}

//Will Add A Network to the list of Networks for VLSM. Does not take any parameters. It gets it's value from the form elements.
var networks = new Array(); //Create a global array containing all networks that have been added.
var totalHosts = 0; //Create global array for determining the number of hosts needed for all the added networks.
var availableAddresses = 0; //Create a global array showing how many addresses are in the entered address block.
var netBoxCtrl = 0; //Control Variable. If zero, the network display box will animate and appear after the next network is added. If one, the box will stay visible on the page.
var netNum = 0; //Keeps track of how many networks there are currently. This is simply for styling and effects so that the fade-in effects look better.
var netFlag = 0; //Keeps track of when the first run of updateNets is.
var overLimit = 0; //Will be 1 if you have entered more addresses than you have in your block.
//Update the displaying of currently entered networks

document.getElementById("add").addEventListener("click", () => addNet());

function updateNets() {
  //Hide the networks display box if there are no networks left

  //Hide the calculation results if they are shown. It makes sense to hide the results if the networks are changed since they will no longer be validateCIDR
  // $("#results").animate({ opacity: 0}, 1).css("height", 0);
  // //Change button text to "Re-Calculate"
  // $("#calculate").attr("value","Calculate");

  //Clear all current network entries
  //$("#network_entries").html("");

  //Show the output if this is the first network added
  // if (netBoxCtrl == 0) {
  //   $("#networks").animate({ opacity: 1, height: "120px" }, 1200);
  // } else {
  //   $("#networks").animate({ height: h + "px" }, 800);
  // }

  //Update the progress bar
  availableAddresses = getAddressCount(maskBits);

  var percentage = Math.round((totalHosts / availableAddresses) * 100);
  //console.log(percentage);

  if (percentage > 100) {
    throw_error("You have exceeded the number of addresss in your IP");
    var lastEntry = networks[networks.length - 1];
    //console.log(lastEntry);
    //remove the number of host from the last array
    totalHosts = totalHosts - lastEntry[2];
    //remove the last network
    networks.pop();
    //return false;
  } else {
    //Create elements if this is the first time run
    if (netFlag == 0) {
      let addedNetworks = document.createElement("div");
      addedNetworks.innerHTML = `<div class= "network__entries" id = "network__entries">
     <div class="progress__bar__container">
     <p>Networks</p>
     <div class= "progress__bar"></div>
     </div>
     <ul class = "network__list" id="network__list"></ul>
   </div>`;
      document.getElementById("networkDiv").appendChild(addedNetworks);
    }

    var l = networks.length;
    var h = 25 * l + 100;
    document.getElementById("network__list").innerHTML = "";
    for (var c = 0; c < l; c++) {
      var name =
        networks[c][1].trim() == "" ? "(No Name)" : networks[c][1].trim();
      if (c < netNum) {
        //Determines whether the entry is new and should fade-in
        let child = document.createElement("li");
        child.innerHTML = `<p>${c + 1}     ${name}     ${networks[
          c
        ][2].toLocaleString()}   <button class = "remove" id= "remove"  data-id ="${
          networks[c][0]
        }">X</button></p>`;
        document.getElementById("network__list").appendChild(child);
      } else {
        let child = document.createElement("li");
        child.innerHTML = `<p>${c + 1}     ${name}     ${networks[
          c
        ][2].toLocaleString()}   <button class = "remove" id= "remove"  data-id ="${
          networks[c][0]
        }">X</button></p>`;

        document.getElementById("network__list").appendChild(child);
      }

      //Color the background of each network alternately
      // if (!(c % 2)) {
      //   $("#netentry" + c).css("background-color", "#FCFCFC");
      // }
      //Set the click event & cursor for the remove button

      // $("span[data-id|='" + networks[c][0] + "']").click(function () {
      //   removeNet($(this).attr("data-id"));
      // });
      // $("span[data-id]").css("cursor", "pointer");
    }
    let removeBtn = [...document.querySelectorAll(".remove")];
    removeBtn.map((x) =>
      x.addEventListener("click", () => {
        removeNet(document.getElementById("remove").getAttribute("data-id"));
      })
    );
    // if (document.getElementById("remove")) {
    //   document.getElementById("remove").addEventListener("click", () => {
    //     console.log(document.getElementById("remove").getAttribute("data-id"));
    //     removeNet(document.getElementById("remove").getAttribute("data-id"));
    //   });
    // }
    document.querySelector(
      ".progress__bar"
    ).innerHTML = `<div class="progress__bar__fill"></div><span class="progress__bar__text">using ${totalHosts.toLocaleString()} out of ${availableAddresses.toLocaleString()} Address (${Math.round(
      (totalHosts / availableAddresses) * 100
    )}%)</span> `;
    //This determines the width of the progress bar fill. Not letting it go over 100%.
    setTimeout(() => {
      document.querySelector(
        ".progress__bar__fill"
      ).style.width = `${Math.round((totalHosts / availableAddresses) * 100)}%`;
    }, 1001);

    document
      .querySelector(".progress__bar__fill")
      .animate(
        [{ width: `${Math.round((totalHosts / availableAddresses) * 100)}%` }],
        1000
      );
  }

  netBoxCtrl = 1;
  netNum = l;
  netFlag = 1;
}

function addNet() {
  //Before adding networks, make sure an address block/mask has been entered
  if (document.getElementById("ip").value.trim() == "") {
    throw_error(
      "You really should enter an IP Address Block & Mask before adding networks."
    );
    cidrError();
    return false;
  }

  //Get the number entered
  //var n = Number($("#net").val());
  let n = Number(document.getElementById("host__number").value);

  //Make sure value entered is a number, is positive, and an integer
  if (n == 0) {
    throw_error(
      "You must enter a number of hosts for the network (must be greater than 1)."
    );
    netError();
    return false;
  }
  if (n == 1) {
    throw_error(
      "You must enter a number greater than 1. Every network needs to use at least 2 host addresses or it isn't really a network, right?"
    );
    netError();
    return false;
  }
  if (!isNumber(n) || n < 0) {
    throw_error(
      "You must enter a positive integer for the number of hosts in the network."
    );
    netError();
    return false;
  }
  if (n % 1 != 0) {
    throw_error(
      "You must enter an integer for the number of hosts in the network. You can not have decimal points."
    );
    netError();
    return false;
  }

  //Generate Random number for network ID. An ID is used to make deleting a certain network from the list easier.
  var id = Math.floor(Math.random() * 100000 + 1);
  //Create array for the values of this network
  //Value order is [id,name,hosts]
  var thisNet = [id, document.getElementById("network__name").value, n];

  //Add this network to the global array containing the networks
  networks.push(thisNet);

  //Add the number of hosts to the running total
  totalHosts = totalHosts + n;

  //Remove any CSS classes placed on the network box by errors
  //$("#net").removeClass();

  //Clear values and focus for the next network
  document.getElementById("network__name").value = "";
  document.getElementById("host__number").value = "";

  //Update Networks Display
  updateNets();
}
//Removes a network from the global network array. Takes the network ID to be removed as a parameter.
function removeNet(id) {
  var l = networks.length;
  for (var c = 0; c < l; c++) {
    if (networks[c][0] == id) {
      //Remove the number of hosts from running total
      totalHosts = totalHosts - networks[c][2];
      //Remove the network
      networks.splice(c, 1);
      //Update Networks Display
      updateNets();
      //	$("#netname").focus();
      return false;
    }
  }
}
//This is it This is the function that will actually calculate the VLSM.

//Creates a global variable to hold the number of hosts actually used in the process of VLSM addressing.
//It will be updated throughout the address processing and if it ever exceeds the amount of available addresses, an error will be thrown.
//It is different than the totalHosts variable in that this variable will take into account addresses wasted by VLSM as well as unusable network and broadcast addresses.
var usedHosts = 0;

//Creates the global array that holds the VLSM results. This will be passed the updateVLSM function which will publish the results on the page.\
var results = new Array();
//Creates a global variable to hold the total number of addresses that were wasted by the VLSM process
var wasted = 0;
function calculateVLSM() {
  let text = document.getElementById("ip");
  //Immediately stop execution if the amount of network hosts entered is more than the available addresses.
  //Note that this doesn't take into account any addresses that are wasted in the addressing process or the network/broadcast addresses that aren't usable.
  //Those things will be calculated later and appropriate error messages will be thrown if necessary.
  if (overLimit == 1) {
    throw_error(
      "The networks you have entered have more hosts than you address block has addresses. You must use less hosts or a bigger address block."
    );
    return false;
  }

  //Do some more validation
  if (text.value.trim() == "") {
    throw_error(
      "You must enter an address block & mask first before you can calculate any VLSM."
    );
    cidrError();
    return false;
  }
  if (networks.length < 1) {
    throw_error(
      "You must enter at least one network before you can calculate any VLSM."
    );
    netError();
    return false;
  }

  //Reset the number of used hosts and wasted hosts back to zero in case the VLSM is re-calculated
  usedHosts = 0;
  wasted = 0;

  //Clear the results array in case of re-calculation
  results.clear();

  //Sort the networks array so that they are in the order of number of hosts from highest to lowest.
  networks.sort(function sortNetworks(a, b) {
    return b[2] - a[2];
  });

  //This is the main loop that will loop through every network entered and calculate the VLSM for each network.
  //It will create an array of each network and mask that should be used. The array will also include the network name and number of hosts.
  var addressesUsed = 0; //Will keep track of how many addresses have been used.
  var bits = 0; //Holds the number of bits the current network in the loop needs for hosts.
  var currentNet = netAddress; //Sets the current address that is being used in the loop. For the first time through the loop, this will be the address entered in the CIDR box. It will then be changed by the loop after each network is processed.
  var l = networks.length;
  for (var c = 0; c < l; c++) {
    //First thing to do is figure out how many bits the network needs for its hosts.
    //A loop is used to calculate this
    for (var x = 2; x < 32; x++) {
      if (networks[c][2] <= Math.pow(2, x) - 2) {
        bits = x;
        usedHosts += Math.pow(2, x);
        wasted += Math.pow(2, x) - 2 - networks[c][2];
        break;
      }
    }
    //Set the mask bits for the network
    var mBits = 32 - bits;

    //Add the network to the results array.
    //Order of Array items are: [name,# of hosts,network address,mask bits]
    results[c] = new Array(networks[c][1], networks[c][2], currentNet, mBits);

    //Now we must set up for the next network.
    //We get the next network address by adding the number of hosts used this time to the current network address
    currentNet = num2Address(address2Num(currentNet) + Math.pow(2, bits));
  }
  //Check to make sure we haven't exceeded our available addresses
  if (usedHosts > availableAddresses) {
    throw_error(
      "Due to the VLSM process, your needed amount of host addresses has exceeded the amount of available addresses in your address block. You will need less hosts or a larger address block."
    );
    return false;
  }

  //Display the results
  document.body.classList.add("resultDiv_show");
  updateResults();
}
//global variable for api
let api_network_detail = [];

//Writes the results of the VLSM to the page
function updateResults() {
  api_network_detail = [];
  //Clear any values and styles in the box before continuing in case the user decides to recalculate the results.
  const resultDiv = document.getElementById("resultDiv");
  resultDiv.innerHTML = "";

  //Create the results header
  let results__header = document.createElement("div");
  let sub__header = document.createElement("div");
  results__header.setAttribute("id", "results__header");
  results__header.innerHTML = `<div class="calculation__result"><h2 class="result_header">Calculation Results</h2><button class=" btn" onclick = "back__page()">Back/Re-calculate</button></div>`;
  resultDiv.appendChild(results__header);
  sub__header.setAttribute("id", "sub__header");
  sub__header.innerHTML = `<h3>Using ${usedHosts.toLocaleString()} addresses out of ${availableAddresses.toLocaleString()} (${getPercent(
    usedHosts,
    availableAddresses
  )}%). ${wasted.toLocaleString()} addresses were wasted in the VLSM process</h3>`;
  resultDiv.appendChild(sub__header);
  //	$("<div id=\"results_header\">Calculation Results</div>").appendTo($(".results"));
  //Create the results sub-header which will have some info on the total number of addresses used and wasted
  //$("<div id=\"results_subheader\">Using " +usedHosts.toLocaleString()+ " addresses out of " +availableAddresses.toLocaleString()+ " (" +getPercent(usedHosts,availableAddresses)+ "%). " +wasted.toLocaleString()+ " addresses were wasted in the VLSM process. </div>").appendTo($(".results"));

  //Create the field headers
  let field__header = document.createElement("div");
  field__header.setAttribute("id", "field_header");
  field__header.innerHTML = `<div class = "results_field_1">Name</div><div class="results_field_2"># of Hosts</div><div class="results_field_3">Network Address/Mask</div><div class="results_field_4"></div>`;
  resultDiv.appendChild(field__header);
  //  $("<div id=\"results_field_header_row\"><div class=\"results_field_1\">Name</div><div class=\"results_field_2\"># of Hosts</div><div class=\"results_field_3\">Network Address/Mask</div><div class=\"results_field_4\">&nbsp;</div></div>").appendTo($(".results"));
  let container__for__results = document.createElement("div");
  container__for__results.setAttribute("class", "container__for__results");
  container__for__results.setAttribute("id", "container__for__results");
  resultDiv.appendChild(container__for__results);
  //Loop Through Each Result in the results array and create DIVs for them
  var l = results.length;
  for (var c = 0; c < l; c++) {
    var name = results[c][0].trim() == "" ? "(No Name)" : results[c][0];

    var firstHost = num2Address(address2Num(results[c][2]) + 1);
    //Calculate the broadcast address
    var broadcast = num2Address(
      address2Num(results[c][2]) + (Math.pow(2, 32 - results[c][3]) - 1)
    );
    //Calculate the last usable host address
    var lastHost = num2Address(address2Num(broadcast) - 1);
    //Calculate the number of usable hosts in this network
    var usableHosts = Math.pow(2, 32 - results[c][3]) - 2;
    //Calculate how many addresses were wasted on this network
    var thisWasted = usableHosts - results[c][1];
    //Calculate the wasted percentage
    var wastedPercent = Math.round((thisWasted / usableHosts) * 100);
    //Output the results
    let final__result = {
      network_name: name,
      network_address: results[c][2],
      subnet_mask: `${getFullMask(results[c][3])} (${results[c][3]} Bits)`,
      number_of_allocated_IP: `${(usableHosts + 2).toLocaleString()}`,
      number_of_usable_hosts: `${usableHosts.toLocaleString()}`,
      number_of_hosts_wasted: `${thisWasted.toLocaleString()} (${wastedPercent}%)`,
      first_host_address: firstHost,
      last_host_address: lastHost,
      broadcast_address: broadcast,
    };
    api_network_detail.push(final__result);
  }
  console.log(results);
  console.log(api_network_detail);
  const allNetworks = api_network_detail
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

<!-- delete btn -->

</div>
</div>
<div class = "network__details">
   <table class="network__table">
       <thead>
          <tr>
              <th>Sub-net Name: ${network_name}</th>
              <th>Network Details</th>
              
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
  let child__table = document.createElement("div");
  child__table.innerHTML = allNetworks;
  container__for__results.appendChild(child__table);

  // $("#calculate").attr("value", "Re-Calculate");
  document.getElementById("calculate").innerText = "Re-Calculate";
  //creating a button to save the results to the database
  let save_container = document.createElement("div");
  save_container.setAttribute("class", "save_container");
  save_container.innerHTML = `<button class ="btn save_to_database" onclick = "saveToDB1()">Save to Database</button> <a href="./saved_networks.html"
              ><button class="btn">saved Networks</button></a
            >`;
  container__for__results.appendChild(save_container);
}
document.getElementById("calculate").addEventListener("click", () => {
  document.querySelector(".resultDiv").classList.toggle("hide");
  calculateVLSM();
});

const show_detail = () => {
  document.querySelector("#net_detail_box").classList.toggle("hide_detail");
  document.querySelector(".plus").classList.toggle("hide");
  document.querySelector(".minus").classList.toggle("hide");
};
const back__page = () => {
  document.body.classList.toggle("resultDiv_show");
  document.querySelector(".resultDiv").innerHTML = "";
  //
  document.querySelector(".resultDiv").classList.toggle("hide");
};
const save_to_database = () => {
  console.log("saving to the mongodb database");
  console.log(api_network_detail);
  saveToDB1();
};
const saveToDB1 = async () => {
  // let name = "255.255.255.255";
  // let network_name = "QQQQQQQQQQ";
  let token = localStorage.getItem("token");
  for (let i = 0; i < api_network_detail.length; i++) {
    let {
      network_name,
      network_address,
      subnet_mask,
      number_of_allocated_IP,
      number_of_usable_hosts,
      number_of_hosts_wasted,
      first_host_address,
      last_host_address,
      broadcast_address,
    } = api_network_detail[i];

    try {
      const response = await axios.post("/api/user-specific-netowrk", {
        token,
        network_name,
        network_address,
        subnet_mask,
        number_of_allocated_IP,
        number_of_usable_hosts,
        number_of_hosts_wasted,
        first_host_address,
        last_host_address,
        broadcast_address,
      });
      console.log(response);
      // const result = await response.json();
      const { data } = response;
      // console.log(data);
      if (!data.error) {
        //show_result();
        alert("Success sub-networks are added");
      } else {
        alert(data.error);
      }
      // showNetworks();
      // // taskInputDOM.value = "";
      // formAlertDOM.style.display = "block";
      // formAlertDOM.textContent = `success, task added`;
      // formAlertDOM.classList.add("text-success");
    } catch (error) {
      console.log(error);
      // formAlertDOM.style.display = "block";
      // formAlertDOM.innerHTML = `error, please try again`;
    }
  }
};
