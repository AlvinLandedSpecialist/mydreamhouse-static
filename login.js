document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://mydreamhouse-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.access_token);
      alert("Login successful!");
      // 一定要和静态文件名一致
      window.location.href = "projects.html";
    } else {
      alert("Login failed: " + (data.msg || response.status));
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred. Please try again.");
  }
});
