let enabled = false;

chrome.storage.local.get(["enabled"], (res) => {
  enabled = res.enabled ?? false;
});

function initialise() {
  chrome.runtime.sendMessage(
    {
      type: "Check_login_status",
    },
    (response) => {
      if (response.loggedIn) {
        Login.style.display = "none";

        chrome.storage.local.get(["enabled"], (result) => {
          console.log(result.enabled);
          if (result.enabled === true) {
            Start.style.display = "none";
            End.style.display = "block";
          } else {
            Start.style.display = "block";
            End.style.display = "none";
          }
        });
      } else {
         chrome.storage.local.set({ enabled: false });
        Login.style.display = "block";
        Start.style.display = "none";
        End.style.display = "none";
      }
    },
  );
}

initialise();

Start.addEventListener("click", () => {
  Start.style.display = "none";
  End.style.display = "block";
  enabled = true;
  chrome.storage.local.set({ enabled: true });
});

End.addEventListener("click", () => {
  End.style.display = "none";
  Start.style.display = "block";
  enabled = false;
  chrome.storage.local.set({ enabled: false });
});
