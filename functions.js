const dicemap = {
  0: "□",
  1: "⚀",
  2: "⚁",
  3: "⚂",
  4: "⚃",
  5: "⚄",
  6: "⚅",
}

const emblemmap = {
  "": "https://res.cloudinary.com/startrekdesignproject-com/image/upload/c_fill,w_1200,f_auto/v1639179713/Tactical-Delta-2250s.webp",
  "starfleet": "https://res.cloudinary.com/startrekdesignproject-com/image/upload/c_fill,w_1200,f_auto/v1585863146/UFP2390s.webp",
  "klingon": "https://res.cloudinary.com/startrekdesignproject-com/image/upload/c_fill,w_1200,f_auto/v1555446084/Klingon2280s.webp",
  "bajoran": "https://res.cloudinary.com/startrekdesignproject-com/image/upload/c_fill,w_1200,f_auto/v1555635305/Bajoran.webp",
  "cardassian": "https://res.cloudinary.com/startrekdesignproject-com/image/upload/c_fill,w_1200,f_auto/v1569883183/CardassianUnion2.webp",
  "ferengi": "https://res.cloudinary.com/startrekdesignproject-com/image/upload/v1555452922/Ferengi.png",
  "romulan": "https://res.cloudinary.com/startrekdesignproject-com/image/upload/c_fill,w_1200,f_auto/v1622157191/RomulanEmpire2380s-B.webp",
}

function doRoll() {
  // Get number of dice to roll
  let ndice = parseInt(document.getElementById("ndice").value);
  // Pick that many random numbers between 1 and 6
  let outcome = [];
  for (let i = 0; i < ndice; i++) {
    outcome.push(Math.ceil(Math.random() * 6));
  }
  
  // Get total
  let total = outcome.reduce((a, b) => a + b, 0);
  // Get string
  let output = "";
  for (let value of outcome) {
    output += dicemap[value] + " ";
  }
  
  // Append proficiency
  let prof = document.getElementById("role").value;
  let stat = document.getElementById("roll-stat").value;
  let lvl = parseInt(document.getElementById("lvl").value);
  if (prof == stat) {
    output += "-" + lvl * 3;
    total -= lvl * 3;
  }
  
  // Display total
  document.getElementById("roll-total").value = total;
  // Display string
  document.getElementById("roll-string").innerHTML = output;
  
    // Update exp
  document.getElementById("exp").value = parseInt(document.getElementById("exp").value) + ndice;
  updateLvl()
}

function updateNDice(diff) {
  let newVal = parseInt(document.getElementById("ndice").value) + diff;
  document.getElementById("ndice").value = Math.max(newVal, 1);
}

function updateLvl() {
  let exp = parseInt(document.getElementById("exp").value);
  document.getElementById("lvl").value = Math.floor( Math.log(exp / 6 + 1) ) + 1;
  // Update health
  updateMaxHp();
  // Update scores
  updateStats();
}

function updateMaxHp() {
  // Get required stats
  let cbt = parseInt(document.getElementById("cbt").value);
  let med = parseInt(document.getElementById("med").value);
  let lvl = parseInt(document.getElementById("lvl").value);
  // Calculate max hp
  let maxhp = Math.floor(lvl * 6 + cbt + med / 2);
  document.getElementById("max-hp").value = document.getElementById("hp").max = maxhp;
  
}

function doRest() {
  document.getElementById("hp").value = parseInt(document.getElementById("max-hp").value)
}

function updateStats() {
  // Get references to stats ctrls
  let ctrls = [
    document.getElementById("cmd"),
    document.getElementById("egr"),
    document.getElementById("sci"),
    document.getElementById("cbt"),
    document.getElementById("pft"),
    document.getElementById("med"),
    document.getElementById("int"),
    document.getElementById("fly"),
  ]
  // How many points can they spend?
  let points = parseInt(document.getElementById("lvl").value) * 6 * 8;
  // How many points have they spent?
  let spent = 0
  for (let ctrl of ctrls) {
    spent += parseInt(ctrl.value)
  }
  // Colour and enable controls if they have points
  for (let ctrl of ctrls) {
    if (spent >= points) {
      ctrl.style.color = getComputedStyle(document.documentElement).getPropertyValue('--offwhite');
      ctrl.max = parseInt(ctrl.value)
    } else {
      ctrl.style.color = getComputedStyle(document.documentElement).getPropertyValue('--orange');
      ctrl.max = parseInt(ctrl.value) + points - spent
    }
  }
  // Update max hp
  updateMaxHp()
}

function setAffiliation() {
  let ctrl = document.getElementById("affiliation");
  let target = document.getElementById("role");
  let affil = ctrl.value;
  // Only show options with corresponding class to affiliation
  for (let opt of target.children) {
    if (opt.className.includes(affil)) {
      opt.hidden = false;
    } else {
      opt.hidden = true;
    }
  }
  // Reset role if it's no longer valid
  if (!target.options[target.selectedIndex].className.includes(affil)) {
    target.value = "";
  }
  // Update emblem
  let emblem = document.getElementById("emblem")
  emblem.src = emblemmap[affil]
}

function setRole() {
  let prof = document.getElementById("role").value;
  for (let stat of ["cmd", "egr", "sci", "cbt", "pft", "fly", "med", "int"]) {
    let lbl = document.getElementById(stat).labels[0];
    if (stat === prof) {
      lbl.className = "proficient"
    } else {
      lbl.className = ""
    }
  }
  checkProficiency()
}

function checkProficiency() {
  let prof = document.getElementById("role").value;
  let stat = document.getElementById("roll-stat").value;
  let lbl = document.getElementById("roll-string");
  
  if (stat === prof) {
    lbl.className = "proficient";
  } else {
    lbl.className = "";
  }
}

// Do all updates
function updateAll() {
  updateLvl();
  setAffiliation();
  setRole();
}

// Save to JSON file
function save() {
  let outDict = {};
  // Get values
  for (let emt of document.getElementById("write").elements) {
    // markdown object isn't recognised by form, so alias it with its editor
    if (emt === document.getElementById("details").editor) {
      emt = document.getElementById("details")
    }
    if (emt.dataset.saveload !== undefined) {
      // Only add relevant values to outDict
      if (emt.id === "role") {
        // Get role index rather than value
        outDict[emt.id] = emt.selectedIndex
      } else {
        outDict[emt.id] = emt.value;
      }
    }
  }

  // Save to file
  let file = new Blob([JSON.stringify(outDict)], { type: "application/json" });
  savebuffer.href = URL.createObjectURL(file);
  savebuffer.download = [outDict["name"], outDict["exp"]].join("_") + "xp.json";
  savebuffer.click();
}

// Load from JSON file
function load() {
  // Load the .json file to a dict
  var reader = new FileReader();
  loadbuffer.onchange = function () {
    reader.readAsText(loadbuffer.files[0]);
  };
  // Add listener function so loading actually happens
  reader.addEventListener("loadend", function () {
    // Parse file to get dict
    var inDict = JSON.parse(reader.result);
    // Restore values
    for (let emt of document.getElementById("write").elements) {
      // markdown object isn't recognised by form, so alias it with its editor
      if (emt === document.getElementById("details").editor) {
        emt = document.getElementById("details")
      }
      // Only use relevant values from inDict
      if (emt.id in inDict) {
        if (emt.id === "role") {
          // Set role by index rather than value
          emt.selectedIndex = parseInt(inDict[emt.id]);
        } else {
          emt.value = inDict[emt.id];
        }
      }
    }
    updateAll();
  });
  // Click to trigger previously defined functions
  loadbuffer.click();
}



// Setup initial sheet
document.getElementById("affiliation").value = "";
updateAll()
doRest();
