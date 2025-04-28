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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Load projects failed:', response.status, errorData);
      alert(`Failed to load projects: ${response.status} ${errorData.msg || ''}`);
      if (response.status === 401) window.location.href = 'login.html';
      return;
    }

    const projects = await response.json();
    displayProjects(projects);
  } catch (e) {
    console.error('Fetch error:', e);
    alert('Error loading projects: ' + e.message);
  }
}

function displayProjects(projects) {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';
  projects.forEach(p => {
    projectList.insertAdjacentHTML('beforeend', `
      <div class="project-item">
        <h3>${p.title}</h3>
        <p>¥${p.price}</p>
        <p>${p.content}</p>
        ${p.cover_photo_url ? `<img src="${apiUrl}${p.cover_photo_url}" width="200">` : ''}
        <br>
        ${p.images?.map(i=>`<img src="${apiUrl}${i.image_url}" width="100" style="margin:5px;">`).join('')}
        <br>
        <button onclick="deleteProject(${p.id})">删除项目</button>
        <hr>
      </div>
    `);
  });
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
