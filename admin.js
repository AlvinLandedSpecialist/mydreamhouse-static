const token = localStorage.getItem('access_token');

if (!token) {
  window.location.href = 'login.html';
}

// 获取项目
fetch('https://mydreamhouse-backend.onrender.com/projects', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => {
    if (!res.ok) throw new Error("请求失败！");
    return res.json();
  })
  .then(data => {
    const projectDiv = document.getElementById('projects');
    if (!data || data.length === 0) {
      projectDiv.innerHTML = '<p>目前还没有项目。</p>';
      return;
    }

    data.forEach(project => {
      const div = document.createElement('div');
      div.className = 'project-card';
      div.innerHTML = `
        <h4>${project.title}</h4>
        <p>${project.content}</p>
        <p>价格: ${project.price}</p>
        <a href="${project.youtube_link}" target="_blank">看视频</a>
        <div class="image-preview">
          ${project.images.map(img => `<img src="${img}" alt="项目图片" style="width: 150px; margin: 5px;">`).join('')}
        </div>
        <hr/>
      `;
      projectDiv.appendChild(div);
    });
  })
  .catch(err => {
    console.error('获取项目失败:', err);
    const projectDiv = document.getElementById('projects');
    projectDiv.innerHTML = '<p style="color:red;">加载项目失败，请稍后重试。</p>';
  });

// 登出函数
function logout() {
  localStorage.removeItem('access_token');
  window.location.href = 'login.html';
}
