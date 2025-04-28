const apiUrl = 'https://mydreamhouse-backend.onrender.com';
const token = localStorage.getItem('token');

// 如果 token 不存在，自动跳转回登录页
if (!token) {
    alert('No token found, please login again.');
    window.location.href = 'login.html'; // 登录失败时跳转到登录页
}

// 加载项目列表
async function loadProjects() {
    try {
        const response = await fetch(`${apiUrl}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
    let errorData = {};
    try {
        // 尝试解析错误响应
        errorData = await response.json();
    } catch (error) {
        // 如果解析失败，打印日志
        console.error("Error parsing error response:", error);
        errorData = { msg: "Unexpected error occurred." }; // 默认消息
    }

    // 提示错误信息
    alert(`Failed to load projects: ${response.status} ${errorData.msg || ''}`);

    // 如果 token 失效（401），跳转到登录页
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
                window.location.href = 'login.html'; // token 失效时跳转到登录页
            }
            return;
        }

        alert('Project created successfully!');
        projectForm.reset();
        loadProjects(); // 刷新列表
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
            loadProjects(); // 刷新列表
        } else {
            alert(result.msg || '删除失败');
        }
    } catch (error) {
        alert('Error deleting project: ' + error.message);
    }
}

// 登出功能
function logout() {
    localStorage.removeItem('token'); // 删除 token
    window.location.href = 'login.html'; // 跳转回登录页
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    loadProjects(); // 加载项目列表

    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', createProject); // 绑定新项目提交事件
    }
});
