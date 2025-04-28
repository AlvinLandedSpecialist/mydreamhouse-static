document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://mydreamhouse-backend.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // 登录成功：储存 Token
      localStorage.setItem("token", data.access_token);  // 存储 Token（不需要 stringify）

      alert("Login successful!");

      // ✅ 登录成功后跳转到管理页面 admin.html
      window.location.href = "admin.html"; // 已更新为 admin.html
    } else {
      // 登录失败：提示错误信息
      alert("Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
});
