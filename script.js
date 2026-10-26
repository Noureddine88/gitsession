const manifestUrl = './participants/manifest.json';
const participantDir = './participants';

const searchInput = document.querySelector('#searchInput');
const cityFilter = document.querySelector('#cityFilter');
const activityFilter = document.querySelector('#activityFilter');
const participantsGrid = document.querySelector('#participantsGrid');
const emptyState = document.querySelector('#emptyState');
const resultCount = document.querySelector('#resultCount');

const websiteConfig = {
  repoUrl: 'https://github.com/your-org/mtc-lbs-git-workshop',
  forkUrl: 'https://github.com/your-org/mtc-lbs-git-workshop/fork',
  gitDocsUrl: 'https://docs.github.com/en/get-started/using-git'
};

const repoLink = document.querySelector('#repoLink');
const forkLink = document.querySelector('#forkLink');
const gitDocsLink = document.querySelector('#gitDocsLink');

repoLink.href = websiteConfig.repoUrl;
forkLink.href = websiteConfig.forkUrl;
gitDocsLink.href = websiteConfig.gitDocsUrl;

let allParticipants = [];

function createParticipantCard(participant) {
  const card = document.createElement('article');
  card.className = 'participant-card';

  card.innerHTML = `
    <span class="badge">Member</span>
    <h3>${escapeHtml(participant.name)}</h3>
    <div class="meta-row">
      <span class="meta-label">City</span>
      <span>${escapeHtml(participant.city)}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Focus</span>
      <span>${escapeHtml(participant.fundact)}</span>
    </div>
  `;

  return card;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCity = cityFilter.value;
  const selectedActivity = activityFilter.value;

  const filteredParticipants = allParticipants.filter((participant) => {
    const matchesText =
      !searchTerm ||
      participant.name.toLowerCase().includes(searchTerm) ||
      participant.city.toLowerCase().includes(searchTerm) ||
      participant.fundact.toLowerCase().includes(searchTerm);

    const matchesCity = selectedCity === 'all' || participant.city === selectedCity;
    const matchesActivity =
      selectedActivity === 'all' || participant.fundact === selectedActivity;

    return matchesText && matchesCity && matchesActivity;
  });

  renderParticipants(filteredParticipants);
}

function renderParticipants(participants) {
  participantsGrid.innerHTML = '';

  if (!participants.length) {
    emptyState.classList.remove('hidden');
    resultCount.textContent = '0 participants';
    return;
  }

  emptyState.classList.add('hidden');
  resultCount.textContent = `${participants.length} participant${participants.length === 1 ? '' : 's'}`;

  participants.forEach((participant) => {
    participantsGrid.appendChild(createParticipantCard(participant));
  });
}

function populateFilters() {
  const cities = [...new Set(allParticipants.map((p) => p.city))].sort();
  cities.forEach((city) => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });

  const activities = [...new Set(allParticipants.map((p) => p.fundact))].sort();
  activities.forEach((activity) => {
    const option = document.createElement('option');
    option.value = activity;
    option.textContent = activity;
    activityFilter.appendChild(option);
  });
}

async function loadParticipants() {
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      throw new Error(`Manifest request failed with status ${response.status}`);
    }

    const manifest = await response.json();
    const participantFiles = Array.isArray(manifest.participants) ? manifest.participants : [];

    const loadedParticipants = [];

    for (const item of participantFiles) {
      try {
        const fileResponse = await fetch(`${participantDir}/${item.file}`);
        if (!fileResponse.ok) {
          throw new Error(`HTTP ${fileResponse.status}`);
        }

        const text = await fileResponse.text();
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('JSON root must be an object');
        }

        const { name, city, fundact } = parsed;

        if (typeof name !== 'string' || typeof city !== 'string' || typeof fundact !== 'string') {
          throw new Error('Missing required fields: name, city, fundact');
        }

        loadedParticipants.push({
          file: item.file,
          name,
          city,
          fundact
        });
      } catch (error) {
        console.error(`Invalid JSON in ${item.file}:`, error);
      }
    }

    allParticipants = loadedParticipants;
    populateFilters();
    applyFilters();

    if (!allParticipants.length) {
      emptyState.classList.remove('hidden');
      resultCount.textContent = '0 participants';
    }
  } catch (error) {
    console.error('Unable to load participant manifest:', error);
    emptyState.classList.remove('hidden');
    resultCount.textContent = '0 participants';
  }
}

searchInput.addEventListener('input', applyFilters);
cityFilter.addEventListener('change', applyFilters);
activityFilter.addEventListener('change', applyFilters);

loadParticipants();
