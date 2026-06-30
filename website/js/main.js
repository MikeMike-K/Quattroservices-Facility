const CONTACTS = {
  general: {
    label: 'Общие вопросы',
    email: 'mr@qsfm.ru',
    phone: null,
    person: null,
    address: null,
  },
  moscow: {
    label: 'Москва',
    email: 'mr@qsfm.ru',
    phone: '+79265765084',
    phoneDisplay: '+7 926 576-50-84',
    person: 'Качин Александр',
    address: 'Москва',
  },
  spb: {
    label: 'Санкт-Петербург',
    email: 'mr@qsfm.ru',
    phone: '+78126556667',
    phoneDisplay: '+7 812 655-66-67',
    person: null,
    address: 'Россия, Санкт-Петербург, Московское шоссе, д. 42, корп. 2, лит. А',
  },
  samara: {
    label: 'Самара',
    email: 'mr@qsfm.ru',
    phone: '+79276998225',
    phoneDisplay: '+7 927 699-82-25',
    person: 'Бугаков Анатолий',
    address: 'Самара',
  },
};

const contactSelect = document.getElementById('contactSelect');
const userName = document.getElementById('userName');
const userMessage = document.getElementById('userMessage');
const btnEmail = document.getElementById('btnEmail');
const btnPhone = document.getElementById('btnPhone');
const contactResult = document.getElementById('contactResult');
const contactResultContent = document.getElementById('contactResultContent');

function getSelectedContact() {
  const key = contactSelect.value;
  if (!key) {
    alert('Пожалуйста, выберите контакт из списка.');
    return null;
  }
  return CONTACTS[key];
}

function buildEmailBody(contact) {
  const name = userName.value.trim();
  const message = userMessage.value.trim();
  const lines = [];
  if (name) lines.push(`Имя: ${name}`);
  lines.push(`Обращение: ${contact.label}`);
  if (contact.person) lines.push(`Контакт: ${contact.person}`);
  lines.push('');
  if (message) {
    lines.push(message);
  } else {
    lines.push('Здравствуйте! Хотел(а) бы получить информацию о ваших услугах.');
  }
  return lines.join('\n');
}

function showResult(html, isPhone) {
  contactResultContent.innerHTML = html;
  contactResult.hidden = false;
  contactResult.classList.toggle('contact-result--phone', isPhone);
  contactResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

btnEmail.addEventListener('click', () => {
  const contact = getSelectedContact();
  if (!contact) return;

  const subject = encodeURIComponent(`Обращение на сайте — ${contact.label}`);
  const body = encodeURIComponent(buildEmailBody(contact));
  const mailto = `mailto:${contact.email}?subject=${subject}&body=${body}`;

  window.location.href = mailto;

  showResult(
    `<h4>Почтовый клиент открыт</h4>
     <p>Письмо будет отправлено на адрес: <a href="mailto:${contact.email}">${contact.email}</a></p>
     <p style="margin-top:8px;font-size:0.85rem;color:#5a6578">Если почтовый клиент не открылся, напишите напрямую на указанный email.</p>`,
    false
  );
});

btnPhone.addEventListener('click', () => {
  const contact = getSelectedContact();
  if (!contact) return;

  if (!contact.phone) {
    showResult(
      `<h4>Телефон для данного контакта</h4>
       <p>Для общих вопросов рекомендуем связаться по email: <a href="mailto:${contact.email}">${contact.email}</a></p>
       <p style="margin-top:12px">Или выберите представительство в Москве, Санкт-Петербурге или Самаре для получения номера телефона.</p>`,
      true
    );
    return;
  }

  let html = `<h4>${contact.label}</h4>`;
  if (contact.person) html += `<p>${contact.person}</p>`;
  if (contact.address && contact.person !== contact.address) {
    html += `<p style="font-size:0.85rem;color:#5a6578">${contact.address}</p>`;
  }
  html += `<div class="phone-display">${contact.phoneDisplay}</div>`;
  html += `<a href="tel:${contact.phone}" class="btn btn--primary btn--sm">Позвонить</a>`;

  showResult(html, true);
});

contactSelect.addEventListener('change', () => {
  contactResult.hidden = true;
});

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
