const OFFICES = [
  {
    id: 'spb',
    name: 'Санкт-Петербург',
    role: 'Головной офис',
    lat: 59.8067,
    lng: 30.3217,
    address: 'Московское шоссе, д. 42, корп. 2, лит. А',
    phone: '+7 812 655-66-67',
    hq: true,
  },
  {
    id: 'moscow',
    name: 'Москва',
    role: 'Представительство',
    lat: 55.7558,
    lng: 37.6173,
    contact: 'Качин Александр',
    phone: '+7 926 576-50-84',
  },
  {
    id: 'samara',
    name: 'Самара',
    role: 'Представительство',
    lat: 53.1959,
    lng: 50.1002,
    contact: 'Бугаков Анатолий',
    phone: '+7 927 699-82-25',
  },
  {
    id: 'novosibirsk',
    name: 'Новосибирск',
    role: 'Обособленное подразделение',
    lat: 55.0084,
    lng: 82.9357,
  },
  {
    id: 'omsk',
    name: 'Омск',
    role: 'Обособленное подразделение',
    lat: 54.9885,
    lng: 73.3242,
  },
  {
    id: 'tolyatti',
    name: 'Тольятти',
    role: 'Обособленное подразделение',
    lat: 53.5078,
    lng: 49.4204,
  },
  {
    id: 'kazan',
    name: 'Казань',
    role: 'Обособленное подразделение',
    lat: 55.7887,
    lng: 49.1221,
  },
  {
    id: 'adygea',
    name: 'Адыгея',
    role: 'Обособленное подразделение',
    lat: 44.6098,
    lng: 40.1006,
  },
];

let mapInstance = null;

function officePopup(office) {
  let html = `<strong>${office.name}</strong><br><span style="opacity:.8">${office.role}</span>`;
  if (office.address) html += `<br>${office.address}`;
  if (office.contact) html += `<br>${office.contact}`;
  if (office.phone) html += `<br><a href="tel:${office.phone.replace(/\s|-/g, '')}">${office.phone}</a>`;
  return html;
}

function initMap() {
  if (mapInstance) return;
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;

  mapInstance = L.map('map', { scrollWheelZoom: false }).setView([58.0, 50.0], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(mapInstance);

  OFFICES.forEach((office) => {
    const marker = L.circleMarker([office.lat, office.lng], {
      radius: office.hq ? 10 : 7,
      color: '#ffffff',
      weight: 2,
      fillColor: office.hq ? '#e8a317' : '#0d4f8b',
      fillOpacity: 0.95,
    }).addTo(mapInstance);

    marker.bindPopup(officePopup(office));
  });

  setTimeout(() => mapInstance.invalidateSize(), 200);
}

function renderOfficeList() {
  const list = document.getElementById('officeList');
  if (!list) return;

  OFFICES.forEach((office) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `office-item${office.hq ? ' office-item--hq' : ''}`;
    item.innerHTML = `
      <span class="office-item__city">${office.name}</span>
      <span class="office-item__role">${office.role}</span>
      ${office.phone ? `<span class="office-item__phone">${office.phone}</span>` : ''}
    `;
    item.addEventListener('click', () => {
      if (!mapInstance) initMap();
      mapInstance.setView([office.lat, office.lng], office.hq ? 12 : 10, { animate: true });
      L.popup()
        .setLatLng([office.lat, office.lng])
        .setContent(officePopup(office))
        .openOn(mapInstance);
      document.querySelectorAll('.office-item').forEach((n) => n.classList.remove('office-item--active'));
      item.classList.add('office-item--active');
    });
    list.appendChild(item);
  });
}

const mapSection = document.getElementById('map-section');
const mapObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        initMap();
        mapObserver.disconnect();
      }
    });
  },
  { rootMargin: '80px' }
);

renderOfficeList();
if (mapSection) mapObserver.observe(mapSection);

document.getElementById('map')?.addEventListener('click', () => {
  if (!mapInstance) initMap();
  mapInstance.scrollWheelZoom.enable();
});
