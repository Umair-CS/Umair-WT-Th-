// ==========================================
//  EVENT HORIZON — script.js
// ==========================================

// --- Set footer year ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- Predefined events array ---
let events = [
  {
    id: 1,
    name: "Tech Summit Peshawar 2025",
    date: "2025-09-15",
    description: "Annual technology conference bringing together developers, entrepreneurs, and innovators from across Pakistan."
  },
  {
    id: 2,
    name: "IEEE Workshop on AI",
    date: "2025-07-22",
    description: "Hands-on workshop covering fundamentals of Artificial Intelligence and Machine Learning hosted by UET IEEE student branch."
  },
  {
    id: 3,
    name: "Web Dev Bootcamp",
    date: "2024-11-05",
    description: "Three-day intensive bootcamp on modern web development covering HTML, CSS, and JavaScript essentials."
  },
  {
    id: 4,
    name: "Hackathon 2025",
    date: "2025-08-10",
    description: "24-hour hackathon where teams compete to build innovative solutions to real-world problems."
  },
  {
    id: 5,
    name: "UET Open Day",
    date: "2025-06-20",
    description: "Annual open day event for prospective students to explore departments, labs, and student societies at UET Peshawar."
  },
  {
    id: 6,
    name: "Startup Pitch Night",
    date: "2024-12-18",
    description: "Networking event where student startups pitch ideas to a panel of industry mentors and investors."
  }
];

// --- DOM references ---
const container    = document.getElementById('events-container');
const addBtn       = document.getElementById('add-btn');
const nameInput    = document.getElementById('event-name');
const dateInput    = document.getElementById('event-date');
const descInput    = document.getElementById('event-desc');
const warningBox   = document.getElementById('form-warning');
const searchInput  = document.getElementById('search-input');
const noResults    = document.getElementById('no-results');

// --- Utility: is date in the past? ---
function isPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

// --- Utility: format date nicely ---
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

// --- Utility: sort events by date ascending ---
function sortEvents(arr) {
  return [...arr].sort((a, b) => new Date(a.date) - new Date(b.date));
}

// --- Render events (filtered) ---
function renderEvents(filterText = '') {
  container.innerHTML = '';

  const sorted = sortEvents(events);
  const query = filterText.toLowerCase().trim();

  const filtered = sorted.filter(ev => {
    return (
      ev.name.toLowerCase().includes(query) ||
      ev.date.includes(query) ||
      formatDate(ev.date).toLowerCase().includes(query)
    );
  });

  if (filtered.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  filtered.forEach(ev => {
    const past = isPast(ev.date);
    const card = document.createElement('div');
    card.className = 'event-card' + (past ? ' past' : '');
    card.dataset.id = ev.id;

    card.innerHTML = `
      <span class="card-badge ${past ? 'badge-past' : 'badge-upcoming'}">
        ${past ? '✓ Past' : '● Upcoming'}
      </span>
      <div class="card-name">${escapeHTML(ev.name)}</div>
      <div class="card-date">📅 ${formatDate(ev.date)}</div>
      <div class="card-desc">${escapeHTML(ev.description)}</div>
      <div class="card-footer">
        <button class="btn btn-delete" data-id="${ev.id}">Delete</button>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach delete listeners
  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteEvent(Number(btn.dataset.id)));
  });
}

// --- Escape HTML to prevent XSS ---
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- Add event ---
addBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const date = dateInput.value;
  const desc = descInput.value.trim();

  // Validation
  if (!name || !date || !desc) {
    warningBox.classList.remove('hidden');
    return;
  }

  warningBox.classList.add('hidden');

  const newEvent = {
    id: Date.now(),
    name,
    date,
    description: desc
  };

  events.push(newEvent);

  // Clear inputs
  nameInput.value = '';
  dateInput.value = '';
  descInput.value = '';

  // Re-render with current search filter
  renderEvents(searchInput.value);
});

// --- Delete event ---
function deleteEvent(id) {
  events = events.filter(ev => ev.id !== id);
  renderEvents(searchInput.value);
}

// --- Search / filter ---
searchInput.addEventListener('input', () => {
  renderEvents(searchInput.value);
});

// --- Hide warning when user starts typing ---
[nameInput, dateInput, descInput].forEach(el => {
  el.addEventListener('input', () => {
    if (nameInput.value.trim() && dateInput.value && descInput.value.trim()) {
      warningBox.classList.add('hidden');
    }
  });
});

// --- Initial render ---
renderEvents();
