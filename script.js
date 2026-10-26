const manifestUrl = './participants/manifest.json';
const participantDir = './participants';
const searchInput = document.querySelector('#searchInput');
const participantsGrid = document.querySelector('#participantsGrid');
const emptyState = document.querySelector('#emptyState');
const resultCount = document.querySelector('#resultCount');

let allParticipants = [];

function createParticipantCard(participant) {
  const card = document.createElement('article');
  card.className = 'participant-card';

  const heading = document.createElement('h2');
  heading.textContent = participant.name;

  const details = document.createElement('dl');
  for (const [label, value] of [
    ['City', participant.city],
    ['Interest', participant.fundact]
  ]) {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    details.append(row);
  }

  card.append(heading, details);
  return card;
}

function renderParticipants() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase();
  const visibleParticipants = allParticipants.filter((participant) =>
    [participant.name, participant.city, participant.fundact]
      .some((value) => value.toLocaleLowerCase().includes(searchTerm))
  );

  participantsGrid.replaceChildren(
    ...visibleParticipants.map(createParticipantCard)
  );

  emptyState.classList.toggle('hidden', visibleParticipants.length > 0);
  resultCount.textContent =
    `${visibleParticipants.length} participant${visibleParticipants.length === 1 ? '' : 's'}`;
}

async function loadParticipants() {
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      throw new Error(`Manifest request failed with status ${response.status}`);
    }

    const manifest = await response.json();
    if (!manifest || !Array.isArray(manifest.participants)) {
      throw new Error('Manifest must contain a participants array');
    }

    const results = await Promise.all(
      manifest.participants.map(async ({ file }) => {
        try {
          if (typeof file !== 'string' || file.includes('/') || file.includes('\\')) {
            throw new Error('Invalid participant filename');
          }
          const fileResponse = await fetch(`${participantDir}/${encodeURIComponent(file)}`);
          if (!fileResponse.ok) {
            throw new Error(`HTTP ${fileResponse.status}`);
          }
          const participant = await fileResponse.json();
          if (
            !participant ||
            typeof participant.name !== 'string' ||
            typeof participant.city !== 'string' ||
            typeof participant.fundact !== 'string'
          ) {
            throw new Error('Required string fields: name, city, fundact');
          }
          return participant;
        } catch (error) {
          console.error(`Could not load participant file "${file}":`, error);
          return null;
        }
      })
    );

    allParticipants = results.filter(Boolean);
    renderParticipants();
  } catch (error) {
    console.error('Unable to load participant manifest:', error);
    resultCount.textContent = 'Participants could not be loaded';
    emptyState.textContent = 'The participant list could not be loaded. Please try again later.';
    emptyState.classList.remove('hidden');
  }
}

searchInput.addEventListener('input', renderParticipants);
loadParticipants();
