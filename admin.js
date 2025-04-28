// admin.js

const apiUrl = 'https://mydreamhouse-backend.onrender.com';
const token = localStorage.getItem('token');

// 如果 token 不存在，自动跳转回登录页
if (!token) {
    alert('No token found, please login again.');
    window.location.href = 'login.html';
}

// 加载项目列表
async function loadProjects() {
    try {
        const response = await fetch(`${apiUrl}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Failed to load projects: ${response.status} ${errorData.msg || ''}`);
            if (response.status === 401) {
                window.location.href = 'login.html';
            }
            return;
        }

        const projects = await response.json();
        displayProjects(projects);
    } catch (error) {
        alert('Error loading projects: ' + error.message);
    }
}

// 显示项目
function displayProjects(projects) {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

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
}

// 提交新项目
async function createProject(event) {
    event.preventDefault();
    const projectForm = document.getElementById('project-form');
    const formData = new FormData(projectForm);

    try {
        const response = await fetch(`${apiUrl}/projects`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Failed to create project: ${response.status} ${errorData.msg || ''}`);
            if (response.status === 401) {
                window.location.href = 'login.html';
            }
            return;
        }

        alert('Project created successfully!');
        projectForm.reset();
        loadProjects();
    } catch (error) {
        alert('Error creating project: ' + error.message);
    }
}

// 删除项目
async function deleteProject(projectId) {
    if (!confirm('确定要删除这个项目吗？')) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/projects/${projectId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();

        if (response.ok) {
            alert('删除成功！');
            loadProjects();
        } else {
            alert(result.msg || '删除失败');
        }
    } catch (error) {
        alert('Error deleting project: ' + error.message);
    }
}

// 登出功能
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    loadProjects();

    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', createProject);
    }
});
