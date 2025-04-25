// manage-projects.js

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  function loadProjects() {
    axios
      .get("https://mydreamhouse-backend.onrender.com/projects", { headers })
      .then((response) => {
        const projects = response.data;
        const container = document.getElementById("projects-list");
        container.innerHTML = "";

        projects.forEach((project) => {
          const div = document.createElement("div");
          div.className = "card mb-3";
          div.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">${project.title}</h5>
              <p class="card-text">${project.content}</p>
              <p class="card-text"><strong>Price:</strong> ${project.price}</p>
              <p class="card-text"><a href="${project.youtube_link}" target="_blank">YouTube Video</a></p>
              <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">Delete</button>
            </div>
          `;
          container.appendChild(div);
        });
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
        alert("Failed to load projects.");
      });
  }

  window.deleteProject = function (id) {
    if (confirm("Are you sure to delete this project?")) {
      axios
        .delete(`https://mydreamhouse-backend.onrender.com/projects/${id}`, { headers })
        .then(() => {
          alert("Project deleted.");
          loadProjects();
        })
        .catch((error) => {
          console.error("Error deleting project:", error);
          alert("Failed to delete.");
        });
    }
  };

  document.getElementById("project-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const youtube_link = document.getElementById("youtube_link").value;
    const content = document.getElementById("content").value;

    axios
      .post(
        "https://mydreamhouse-backend.onrender.com/projects",
        { title, price, youtube_link, content },
        { headers }
      )
      .then(() => {
        alert("Project created successfully.");
        document.getElementById("project-form").reset();
        loadProjects();
      })
      .catch((error) => {
        console.error("Error creating project:", error);
        alert("Failed to create project.");
      });
  });

  loadProjects();
});
