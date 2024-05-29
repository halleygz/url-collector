document.getElementById('input-btn').addEventListener('click', saveInput);
document.getElementById('tab-btn').addEventListener('click', saveTab);
document.getElementById('alltab-btn').addEventListener('click', saveAllTabs);
document.getElementById('delete-btn').addEventListener('click', deleteAll);
document.getElementById('export-btn').addEventListener('click', exportUrls);

function saveInput() {
  const inputEl = document.getElementById('input-el');
  if (inputEl.value) {
    addUrl(inputEl.value);
    inputEl.value = '';
  }
}

function saveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    addUrl(tabs[0].url);
  });
}

function saveAllTabs() {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(tab => addUrl(tab.url));
  });
}

function deleteAll() {
  localStorage.clear();
  renderUrls();
}

function exportUrls() {
  const urls = getUrls();
  const blob = new Blob([JSON.stringify(urls, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'urls.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function addUrl(url) {
  const urls = getUrls();
  urls.push(url);
  localStorage.setItem('urls', JSON.stringify(urls));
  renderUrls();
}

function getUrls() {
  const urls = localStorage.getItem('urls');
  return urls ? JSON.parse(urls) : [];
}

function renderUrls() {
  const olEl = document.getElementById('ol-el');
  olEl.innerHTML = '';
  const urls = getUrls();
  urls.forEach(url => {
    const li = document.createElement('li');
    li.textContent = url;
    olEl.appendChild(li);
  });
}

// Initial render
renderUrls();