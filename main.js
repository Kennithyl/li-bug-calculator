// main.js

// Color GetMax() {} ...

// string ToLower(string str) {} ...

import { Livlies } from './livly.js';
import { Color } from './bfs_color.js';
import { FindBugs } from './bfs_color.js';
import { Bugs } from './bfs_color.js';

// int main() {} below //

const livliesSelect = document.getElementById("livlies");

Object.keys(Livlies).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    livliesSelect.appendChild(option);
});


let found = false;

let r = 0, g = 0, b = 0;
let valR = 0, valG = 0, valB = 0;
let spec, errorchoice;
const size = Livlies.size; // This should work

let maxRGB = new Color();
let currRGB = new Color();
let tarRGB = new Color();

let i = 0;

document.getElementById('livlies').addEventListener('change', toggleMaxRGB);
document.getElementById('livlies').addEventListener('change', validateInputs);

function toggleMaxRGB() {
    const select = document.getElementById("livlies");
    const div = document.getElementById("maxRGB");
  
    if (select.value == "None") {
      div.style.display = ""; // or "" to reset to default
    } 
    else {
      div.style.display = "none";
    }
}

// Attach event listeners to all inputs
const inputs = [
    "currR", "currG", "currB",
    "tarR", "tarG", "tarB"
  ].map(id => document.getElementById(id));

  inputs.forEach(input => {
    input.addEventListener("input", validateInputs);
  });

  // Initial state
  validateInputs();

function validateInputs() {
    let valRGB = new Color();
    const div2 = document.getElementById("valError");

    const submitBtn = document.getElementById("submit");

    const livly = document.getElementById("livlies");

    if (livly.value === "None") { // I'm not validating anything if you manually enter values larger than your own maximum. Sorry.
        document.getElementById("valError").style.display = "none";
      
        /*const inputs = [
          "currR", "currG", "currB",
          "tarR", "tarG", "tarB"
        ];
        inputs.forEach(id => {
          const el = document.getElementById(id);
          el.classList.remove("input-error"); // or manually reset style
          el.style.border = ""; // Reset border color if you used red, for example
        });*/
      
        document.getElementById("submit").disabled = true;
      
        return;
    }
    else {
        valR = Number(Livlies[livly.value].r);
        valG = Number(Livlies[livly.value].g);
        valB = Number(Livlies[livly.value].b);
    }

    valRGB.r = valR;
    valRGB.g = valG;
    valRGB.b = valB;

    const values = {
      currR: parseInt(document.getElementById("currR").value),
      currG: parseInt(document.getElementById("currG").value),
      currB: parseInt(document.getElementById("currB").value),
      tarR: parseInt(document.getElementById("tarR").value),
      tarG: parseInt(document.getElementById("tarG").value),
      tarB: parseInt(document.getElementById("tarB").value),
    };

    // Validate that values are not NaN and within the bounds
    const isValid = (
      values.currR >= 0 && values.currR <= valRGB.r &&
      values.currG >= 0 && values.currG <= valRGB.g &&
      values.currB >= 0 && values.currB <= valRGB.b &&
      values.tarR >= 0 && values.tarR <= valRGB.r &&
      values.tarG >= 0 && values.tarG <= valRGB.g &&
      values.tarB >= 0 && values.tarB <= valRGB.b
    );

    submitBtn.disabled = !isValid;
    div2.style.display = isValid ? "none" : "";
}

document.getElementById('submit').addEventListener('click', calculateBugs);

function calculateBugs() {
    const livly = document.getElementById("livlies");

    if (livly.value == "None") {
        r = Number(document.getElementById('maxR').value);
        g = Number(document.getElementById('maxG').value);
        b = Number(document.getElementById('maxB').value);
    }
    else {
        r = Number(Livlies[livly.value].r);
        g = Number(Livlies[livly.value].g);
        b = Number(Livlies[livly.value].b);
    }

    maxRGB.r = r;
    maxRGB.g = g;
    maxRGB.b = b;

    const curr = document.getElementById("currRGB");

    currRGB.r = Number(document.getElementById('currR').value);
    currRGB.g = Number(document.getElementById('currG').value);
    currRGB.b = Number(document.getElementById('currB').value);

    const tar = document.getElementById("tarRGB");

    tarRGB.r = Number(document.getElementById('tarR').value);
    tarRGB.g = Number(document.getElementById('tarG').value);
    tarRGB.b = Number(document.getElementById('tarB').value);

    const bugSequence = FindBugs(currRGB, tarRGB, maxRGB);

    

    if (FindBugs) {
        document.getElementById("output").innerHTML = `---<br><br>Needed bugs (total): ${bugSequence.length}<br><br>---<br><br>`;
        const counts = new Array(9).fill(0);

        for (const bug of bugSequence) {
            if (bug >= 0 && bug <= 8) {
                counts[bug]++;
            } else {
                console.warn(`Value ${bug} in sequence is out of expected range (0-${8}).`);
            }
        }

        for (let i = 1; i <= 8; ++i) {
            document.getElementById("output").innerHTML += `${Bugs[i]}: ${counts[i]} needed<br>`;
        }

        document.getElementById("output").innerHTML += `<br><br>Order to feed bugs for desired color: <br>`;

        if (bugSequence.length !== 0) { // If there's bugs in the sequence. Probably unnecessary but we be out here.
            let currBug = bugSequence[0]; // Set current bug to the first in the sequence.
            let count = 1;

            for (let i = 1; i < bugSequence.length; ++i) { // Runs through bugs in the sequence
                if (bugSequence[i] === currBug) {
                    ++count; // Add to count if bug stays the same
                }
                else { // If bug changes
                    document.getElementById("output").innerHTML += ` >> ${Bugs[currBug]} x${count}<br>`;
                    // Start counting new bug
                    currBug = bugSequence[i];
                    count = 1;
                }
            }

            document.getElementById("output").innerHTML += ` >> ${Bugs[currBug]} x${count}<br>`;
        } else {
            document.getElementById("output").innerHTML = "No sequence found to reach the desired color. Possible error?";
        }
    } 
}

// end of main() //