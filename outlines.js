function setup() {
  let text = document.getElementById("user-text");
  text.value = "";
  text.focus();
  addHeadings();
}
setup();

function addHeadings() {
  let textButton = document.getElementById("text-button");

  textButton.addEventListener("click", function() {
    let text = document.getElementById("user-text");
    text.focus();

    let container = document.getElementById("headings-div");
    let headings = [];

    let headingText = [
      "Type the document title.",
      "Type each main heading on a new line.",
      "2nd Level Headings. Place blank line between subheading groups. Type a dash to skip a heading. (see example to the left)",
      "3rd Level Headings",
      "4th Level Headings",
      "5th Level Headings (Leapfrog Words)",
      "6th Level Headings (Quotations)",
      "Done"
    ];

    // determine heading type to add
    let headingNumber = headingText.indexOf(text.placeholder);
    let headingType = "h" + headingNumber.toString();
    let parentHeadingType = "h" + (headingNumber - 1).toString();
    let parents = document.querySelectorAll(parentHeadingType);

    // process title
    if (headingType === "h0") {
      let titleElement = document.createElement("p");
      titleElement.classList.add("title");
      titleElement.textContent += text.value; // user-generated content
      container.appendChild(titleElement);
      text.value = "";
      text.placeholder = headingText[headingNumber + 1];
      document.querySelector("#first").hidden = false;
      return;
    }

    // process headings
    headings = text.value.split("\n");
    let parentNumbers = [], parentNumber = 0;

    if (text.value && parents.length > 0) {
      // if there are parent headings, figure out which to add each heading to
      for (let i = 0; i < headings.length; i++) {
        if (headings[i] != "") {
          if (parentNumbers[parentNumber]) { parentNumbers[parentNumber].push(headings[i]); }
          else { parentNumbers[parentNumber] = [headings[i]]; }
        }
        else { parentNumber++; }
      }

      // add each new heading to the current parent
      for (let i = 0; i < parentNumbers.length; i++) {
        let currentParent = parents[i];
        let currentHeadings = parentNumbers[i];

        // add elements in reverse order since they are added adjacent to parent
        for (let j = (currentHeadings.length - 1); j >= 0; j--) {
          // do not add current heading if it is a dash (placeholder)
          if (currentHeadings[j] === "\-") { continue; }

          let currentElement = document.createElement(headingType);
          currentElement.innerHTML = "\&emsp\;".repeat(parseInt(headingType[1] - 1)); // preserve spacing upon copy
          currentElement.textContent += currentHeadings[j]; // user-generated content
          currentParent.parentNode.insertBefore(currentElement, currentParent.nextSibling);
        }
      }
    } else if (text.value) {
      // if there are no parent headings, add all current headings to the container
      for (let i = 0; i < headings.length; i++) {
        if (headings[i] != "") {
          // add heading if it is not blank
          let element = document.createElement(headingType);
          element.textContent = headings[i];
          container.appendChild(element);
        }
      }
    } else {
      console.log("no headings to add");
    }

    // clear text area, replace placeholder
    if (headingNumber + 1 < 7) {
      text.value = "";
      text.placeholder = headingText[headingNumber + 1];
    }

    // hide elements when they are no longer needed
    if (headingType === "h1") {
      document.querySelector("#first").hidden = true;
      document.querySelector("#second").hidden = false;
    } else if (headingType === "h2") {
      document.querySelector("#second").hidden = true;
    } else if (headingType === "h6") {
      let containerAll = document.getElementById("container-all");
      containerAll.parentNode.removeChild(containerAll);
    }
  }, false);
}
