const token = localStorage.getItem('access_token');

if (!token) {
  window.location.href = 'login.html';
}

fetch('https://mydreamhouse-backend.onrender.com/projects', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  const projectDiv = document.getElementById('projects');
  if (data.length === 0) {
    projectDiv.innerHTML = '<p>目前还没有项目。</p>';
    return;
  }

  data.forEach(project => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h4>${project.title}</h4>
      <p>${project.content}</p>
      <p>价格: ${project.price}</p>
      <a href="${project.youtube_link}" target="_blank">看视频</a>
      <hr/>
    `;
    projectDiv.appendChild(div);
  });
})
.catch(err => {
  console.error('获取项目失败:', err);
});

function logout() {
  localStorage.removeItem('access_token');
  window.location.href = 'login.html';
}
