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
  const logoutBtn = document.getElementById("logout-btn");
  const filterInput = document.getElementById("filter-input");

  let allProjects = [];
  let currentPage = 1;
  const itemsPerPage = 5;

  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("access_token");
    alert("Logged out successfully.");
    window.location.href = "login.html";
  });

  function displayProjects(projects) {
    projectsContainer.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProjects = projects.slice(start, end);

    paginatedProjects.forEach((project) => {
      const div = document.createElement("div");
      div.className = "project-card";
      div.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.content}</p>
        <p>Price: ${project.price}</p>
        <p>YouTube: <a href="${project.youtube_link}" target="_blank">${project.youtube_link}</a></p>
        <div class="image-preview">
          ${(project.images || []).map(img => `<img src="${img}" width="100">`).join(" ")}
        </div>
        <button onclick="deleteProject(${project.id})">Delete</button>
        <button onclick="editProject(${project.id}, '${project.title}', \`${project.content}\`, '${project.price}', '${project.youtube_link}')">Edit</button>
      `;
      projectsContainer.appendChild(div);
    });

    renderPagination(projects.length);
  }

  function renderPagination(totalItems) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.disabled = i === currentPage;
      btn.addEventListener("click", () => {
        currentPage = i;
        displayProjects(allProjects);
      });
      pagination.appendChild(btn);
    }
  }

  function fetchProjects() {
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((projects) => {
        allProjects = projects;
        displayProjects(allProjects);
      });
  }

  filterInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    const filtered = allProjects.filter(project =>
      project.title.toLowerCase().includes(keyword) ||
      project.content.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    displayProjects(filtered);
  });

  createForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(createForm);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        createForm.reset();
        fetchProjects();
      });
  });

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
