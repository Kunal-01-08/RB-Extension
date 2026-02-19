let enabled = false;

chrome.storage.local.get(["enabled"], (res) => {
  enabled = res.enabled ?? false;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    enabled = changes.enabled.newValue;
    console.log("RBS enabled changed to:", enabled);
  }
});

function replaceAlias(alias) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "Replace_the_alias",
        data: alias,
      },
      (response) => {
        // console.log("data:",response);
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          if (response.ok) {
            resolve(response.data);
          } else {
            resolve("RBS_INVALID." + alias);
          }
        }
      },
    );
  });
}

let isReplacing = false;

document.addEventListener("input", async (e) => {
  if (!enabled || isReplacing) return;
  const el = e.target;
  let text = null;

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    text = el.value;
  } else if (el.isContentEditable) {
    text = el.innerText;
  } else if (el.getAttribute?.("role") === "textbox") {
    text = el.innerText;
  }

  if (text == null) return;
  let userTyped = text.split("RBS.");
  if (userTyped.length >= 2) {
    isReplacing = true;
    console.log(userTyped);
    let x = 1;
    let processedInput = userTyped[0];
    let replace = 0;
    while (x < userTyped.length) {
      let aliasArr = userTyped[x].split(" ");
      if (aliasArr.length >= 2) {
        replace = 1;
        let alias = aliasArr[0];
        console.log("alias:", alias);
        try {
          let data = await replaceAlias(alias);
          console.log("Data: ", data);
          aliasArr[0] = data;
          processedInput = processedInput + aliasArr.join(" ");
        } catch (err) {
          console.log("error: ", err);
        }
      }
      x++;
    }
    if (replace) {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        e.target.value = processedInput;
      } else if (el.isContentEditable) {
        e.target.innerText = processedInput;
      } else if (el.getAttribute?.("role") === "textbox") {
        e.target.innerText = processedInput;
      }
      console.log("After replacement: ", processedInput);
    }
    isReplacing = false;
  }
});
