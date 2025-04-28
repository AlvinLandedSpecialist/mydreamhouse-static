const apiUrl = 'https://mydreamhouse-backend.onrender.com';
const token = localStorage.getItem('token');

if (!token) {
  alert('No token, please login.');
  window.location.href = 'login.html';
}

async function loadProjects() {
    try {
        const response = await fetch(`${apiUrl}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const responseData = await response.json();
        console.log('Response data:', responseData); // 打印返回的数据

        if (!response.ok) {
            alert(`Failed to load projects: ${response.status} ${responseData.msg || ''}`);
            if (response.status === 401) {
                window.location.href = 'login.html'; // token 失效时跳转到登录页
            }
            return;
        }

        const projects = Array.isArray(responseData) ? responseData : []; // 如果返回的不是数组，使用空数组
        displayProjects(projects);
    } catch (error) {
        alert('Error loading projects: ' + error.message);
    }
}

function displayProjects(projects) {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    if (Array.isArray(projects) && projects.length > 0) { // 确保 projects 是数组且有内容
        projects.forEach(project => {
            const div = document.createElement('div');
            div.className = 'project-item';
            div.innerHTML = `
                <h3>${project.title}</h3>
                <p>价格: $${project.price}</p>
                <p>${project.content}</p>
                ${project.cover_photo_url ? `<img src="${apiUrl}${project.cover_photo_url}" width="200">` : ''}
                <br>
                ${project.images && project.images.length > 0 ? project.images.map(img => `<img src="${apiUrl}${img.image_url}" width="100" style="margin:5px;">`).join('') : ''}
                <br>
                <button onclick="deleteProject(${project.id})">删除项目</button>
                <hr>
            `;
            projectList.appendChild(div);
        });
    } else {
        alert("No projects available.");
    }
}

async function deleteProject(id) {
  if (!confirm('确定删除？')) return;
  const res = await fetch(`${apiUrl}/projects/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const j = await res.json();
  if (res.ok) loadProjects();
  else alert('Delete failed: ' + j.msg);
}

document.getElementById('project-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const res = await fetch(`${apiUrl}/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd
  });
  const j = await res.json();
  if (res.ok) {
    alert('Created!');
    e.target.reset();
    loadProjects();
  } else alert('Create failed: ' + j.msg);
});

document.addEventListener('DOMContentLoaded', loadProjects);
