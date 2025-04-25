const token = localStorage.getItem('access_token');

if (!token) {
  window.location.href = 'login.html';
}

document.getElementById('projectForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const price = document.getElementById('price').value;
  const youtube_link = document.getElementById('youtube_link').value;

  fetch('https://mydreamhouse-backend.onrender.com/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title,
      content,
      price,
      youtube_link
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('message').textContent = data.msg || '提交成功';
    document.getElementById('projectForm').reset();
  })
  .catch(err => {
    console.error('提交失败:', err);
    document.getElementById('message').textContent = '提交失败，请稍后再试';
  });
});

function logout() {
  localStorage.removeItem('access_token');
  window.location.href = 'login.html';
}
