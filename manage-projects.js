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
    const paginationContainer = document.getElementById("pagination");
    const imagePreview = document.getElementById("image-preview");

    let currentPage = 1;
const itemsPerPage = 6;

function fetchProjects(page = 1) {
  fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((projects) => {
      const totalPages = Math.ceil(projects.length / itemsPerPage);
      const paginatedProjects = projects.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      );

      projectsContainer.innerHTML = "";

      paginatedProjects.forEach((project) => {
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

      renderPaginationControls(totalPages);
    });
}

function renderPaginationControls(totalPages) {
  const paginationContainer = document.getElementById("pagination-controls");
  paginationContainer.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} onclick="changePage(${currentPage - 1})">上一页</button>
    <span> 第 ${currentPage} 页 / 共 ${totalPages} 页 </span>
    <button ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(${currentPage + 1})">下一页</button>
  `;
}

window.changePage = function (newPage) {
  currentPage = newPage;
  fetchProjects(currentPage);
};

    // 登出功能
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("access_token");
        alert("Logged out successfully.");
        window.location.href = "login.html";
    });

    // 获取所有项目
    function fetchProjects(page = 1) {
        fetch(`${apiUrl}?page=${page}&per_page=${projectsPerPage}`, {
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
                    <div class="image-preview">
                        ${project.images.map(img => `<img src="${img}" alt="Image">`).join('')}
                    </div>
                    <button onclick="deleteProject(${project.id})">Delete</button>
                    <button onclick="editProject(${project.id}, '${project.title}', \`${project.content}\`, '${project.price}', '${project.youtube_link}')">Edit</button>
                `;
                projectsContainer.appendChild(div);
            });
            renderPagination(projects.length);
        });
    }

    // 分页渲染
    function renderPagination(totalProjects) {
        const totalPages = Math.ceil(totalProjects / projectsPerPage);
        paginationContainer.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.addEventListener("click", () => {
                currentPage = i;
                fetchProjects(currentPage);
            });
            paginationContainer.appendChild(button);
        }
    }

    // 创建项目
    createForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(createForm);
        const projectData = Object.fromEntries(formData);

        const imageFiles = document.getElementById("images").files;
        const images = [];
        for (let i = 0; i < imageFiles.length; i++) {
            images.push(imageFiles[i]);
        }

        // Assuming image upload function is already in place
        const formDataWithImages = new FormData();
        formDataWithImages.append("title", projectData.title);
        formDataWithImages.append("content", projectData.content);
        formDataWithImages.append("price", projectData.price);
        formDataWithImages.append("youtube_link", projectData.youtube_link);

        for (let i = 0; i < images.length; i++) {
            formDataWithImages.append("images", images[i]);
        }

        fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formDataWithImages,
        })
        .then((res) => res.json())
        .then(() => {
            createForm.reset();
            fetchProjects(currentPage);
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
            .then(() => fetchProjects(currentPage));
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
        .then(() => fetchProjects(currentPage));
    };

    // 文件预览
    document.getElementById("images").addEventListener("change", function () {
        imagePreview.innerHTML = "";
        const files = this.files;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(files[i]);
        }
    });

    // 过滤项目
    filterInput.addEventListener("input", function () {
        const searchText = filterInput.value.toLowerCase();
        const projectCards = document.querySelectorAll(".project-card");
        projectCards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const content = card.querySelector("p").textContent.toLowerCase();
            if (title.includes(searchText) || content.includes(searchText)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });

    fetchProjects(currentPage);
});
