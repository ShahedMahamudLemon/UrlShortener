document
  .getElementById("urlForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const longUrl = document.getElementById("longUrl").value;

    const resultDiv = document.getElementById("result");
    const alertDiv = document.getElementById("alert");

    resultDiv.innerHTML = "";
    alertDiv.innerHTML = "";

    try {
      const response = await fetch("/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        alertDiv.innerHTML = `<p style="color: red;">Error: ${
          data.error || "An error occurred"
        }</p>`;
      } else {
        if (data.message === "URL already shortened") {
          alertDiv.innerHTML = `<p>This URL is already shortened:</p> <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
        } else {
          resultDiv.innerHTML = `<p>Shortened URL:</p> <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
        }
      }
    } catch (error) {
      alertDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
  });
