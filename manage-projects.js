document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("access_token");
  const apiUrl = "https://mydreamhouse-backend.onrender.com/projects";

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  const projectsContainer = document.getElementById("projects-container");
  const createForm = document.getElementById("create-project-form");

  // 获取所有项目
  function fetchProjects() {
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((projects) => {
        projectsContainer.innerHTML = "";
        projects.forEach((project) => {
          const div = document.createElement("div");
          div.className = "project-card";
          div.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.content}</p>
            <p>Price: ${project.price}</p>
            <p>YouTube: <a href="${project.youtube_link}" target="_blank">${project.youtube_link}</a></p>
            <button onclick="deleteProject(${project.id})">Delete</button>
            <button onclick="editProject(${project.id}, '${project.title}', \`${project.content}\`, '${project.price}', '${project.youtube_link}')">Edit</button>
          `;
          projectsContainer.appendChild(div);
        });
      });
  }

  // 创建项目
  createForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(createForm);
    const projectData = Object.fromEntries(formData);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    })
      .then((res) => res.json())
      .then(() => {
        createForm.reset();
        fetchProjects();
      });
  });

  // 删除项目
  window.deleteProject = function (id) {
    if (confirm("Are you sure you want to delete this project?")) {
      fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then(() => fetchProjects());
    }
  };

  // 编辑项目
  window.editProject = function (id, title, content, price, youtube_link) {
    const newTitle = prompt("New title:", title);
    const newContent = prompt("New content:", content);
    const newPrice = prompt("New price:", price);
    const newYoutube = prompt("New YouTube link:", youtube_link);

    if (!newTitle || !newContent || !newPrice) {
      alert("All fields must be filled.");
      return;
    }

    fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        price: newPrice,
        youtube_link: newYoutube,
      }),
    })
      .then((res) => res.json())
      .then(() => fetchProjects());
  };

  fetchProjects();
});
