// cookie-consent.js - FINAL FIXED VERSION (Customize button works + Authoring fixed)

const LOG_ENDPOINT = 'http://13.200.106.168:4000/api/cookie-consent';
const UPDATE_ENDPOINT = 'http://13.200.106.168:4000/api/cookie-consent/update';
const DELETE_ENDPOINT = 'http://13.200.106.168:4000/api/cookie-consent/delete';

const AUTH_HEADER = 'U2FsdGVkX1+IAunex0zJueoZQpRBfpUm/DSQSMufK69HpTEh4abfdnhz0fQ+jbSmPrqojCZOhYZ6/mvA28aQxw';

async function fetchGeo() {
  let city = 'unknown', region = 'unknown', country = 'unknown';
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      city = data.city || 'unknown';
      region = data.region || 'unknown';
      country = data.country_name || 'unknown';
    }
  } catch (e) {}
  return { city, region, country };
}

async function sendConsent(consentType, customPreferences) {
  const { city, region, country } = await fetchGeo();

  const payload = {
    userIp: 'anonymous',
    location: Intl.DateTimeFormat().resolvedOptions().timeZone,
    city,
    region,
    country,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    consentType,
    customPreferences
  };

  const hasConsent = localStorage.getItem('gmr-cookie-consent');
  const url = hasConsent ? UPDATE_ENDPOINT : LOG_ENDPOINT;

  try {
    const body = hasConsent
      ? JSON.stringify({ id: localStorage.getItem('gmr-privacy-id'), ...payload })
      : JSON.stringify(payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_HEADER
      },
      body
    });

    const result = await response.json();

    if (response.ok) {
      if (!hasConsent) {
        const savedId = result.id || result.data?.id || result.data?._id;
        if (savedId) localStorage.setItem('gmr-privacy-id', savedId);
      }
      localStorage.setItem('gmr-cookie-consent', consentType === 'declined' ? 'declined' : 'accepted');
      localStorage.setItem('gmr-custom-preferences', JSON.stringify(customPreferences));
      applyConsents(customPreferences);
      showPostConsentView();
    } else {
      alert('Error saving preferences.');
    }
  } catch (e) {
    alert('Network error.');
  }
}

async function deleteRecord() {
  const id = localStorage.getItem('gmr-privacy-id');
  if (!id) {
    alert('No record found to delete.');
    return;
  }

  try {
    const response = await fetch(DELETE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_HEADER
      },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      localStorage.clear();
      alert('Your data has been permanently deleted.');
      location.reload();
    } else {
      alert('Deletion failed.');
    }
  } catch (e) {
    alert('Network error during deletion.');
  }
}

function applyConsents(prefs) {
  if (window.gtag) {
    gtag('consent', 'update', { 'analytics_storage': prefs.analytics ? 'granted' : 'denied' });
  }
  if (window.adobe?.optIn) {
    prefs.personalization ? adobe.optIn.approve(['target']) : adobe.optIn.deny(['target']);
  }
}

function showPostConsentView() {
  const existingWrapper = document.querySelector('.cookie-consent-wrapper');
  if (existingWrapper) existingWrapper.remove();

  const wrapper = document.createElement('div');
  wrapper.className = 'cookie-consent-wrapper';
  wrapper.innerHTML = `
    <div class="cookie-consent post-consent">
      <p>Your preferences have been saved.</p>
      <button id="manage-prefs-btn">Manage Preferences</button>
    </div>
  `;
  document.body.appendChild(wrapper);

  const manageBtn = document.getElementById('manage-prefs-btn');
  if (manageBtn) {
    manageBtn.addEventListener('click', openCustomizeModal);
  }
}

function getBlockConfig() {
  const conf = {};
  const block = document.querySelector('.cookie-consent.block');
  if (!block) return conf;

  const propElements = block.querySelectorAll('[data-aue-prop]');
  propElements.forEach(el => {
    const prop = el.getAttribute('data-aue-prop');
    if (prop === 'message') {
      conf.message = el.innerHTML.trim();
    } else if (prop === 'policyLabel') {
      conf.policylabel = el.textContent.trim();
    } else if (prop === 'policyLink') {
      const link = el.querySelector('a');
      conf.policylink = link ? link.getAttribute('href') : '#';
      conf.policylabel = conf.policylabel || (link ? link.textContent.trim() : 'policy');
    } else if (prop === 'acceptLabel') {
      conf.acceptlabel = el.textContent.trim();
    } else if (prop === 'declineLabel') {
      conf.declinlabel = el.textContent.trim();
    } else if (prop === 'customizeLabel') {
      conf.customizelabel = el.textContent.trim();
    } else if (prop.includes('Desc')) {
      conf[prop] = el.innerHTML.trim();
    }
  });

  return conf;
}

function openCustomizeModal() {
  console.log('Customize modal opened'); // Debug log - check DevTools Console

  const conf = getBlockConfig();

  const savedPrefs = JSON.parse(localStorage.getItem('gmr-custom-preferences') || '{}');

  const modal = document.createElement('div');
  modal.id = 'customize-modal';
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:99999;';

  modal.innerHTML = `
    <div style="background:#fff; padding:30px; border-radius:12px; max-width:600px; width:90%; box-shadow:0 8px 30px rgba(0,0,0,0.3);">
      <h2 style="text-align:center; color:#003366; margin-bottom:20px;">Customize Cookie Preferences</h2>

      <div style="margin:25px 0;">
        <strong>Essential Cookies</strong><br>
        <small style="color:#666;">Always active – Required for site functionality</small><br>
        <input type="checkbox" checked disabled style="margin-top:8px;">
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="analytics" ${savedPrefs.analytics ? 'checked' : ''}> Analytics Cookies</label><br>
        <small style="color:#666;">${conf.analyticsdesc || 'Anaylytics'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="marketing" ${savedPrefs.marketing ? 'checked' : ''}> Marketing Cookies</label><br>
        <small style="color:#666;">${conf.marketingdesc || 'Marketing'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="personalization" ${savedPrefs.personalization ? 'checked' : ''}> Personalization Cookies</label><br>
        <small style="color:#666;">${conf.personalizationdesc || 'Personalisation'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="third_party" ${savedPrefs.third_party ? 'checked' : ''}> Third-Party Cookies</label><br>
        <small style="color:#666;">${conf.thirdpartydesc || 'Third Party'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="functional" ${savedPrefs.functional ? 'checked' : ''}> Functional Cookies</label><br>
        <small style="color:#666;">${conf.functionaldesc || 'This is cookies custom preferences'}</small>
      </div>

      <div style="text-align:center; margin-top:30px;">
        <button id="save-prefs" style="padding:12px 30px; background:#f5a623; color:#000; border:none; border-radius:8px; font-weight:bold;">
          Save Preferences
        </button>
        <button id="delete-data" style="padding:12px 30px; background:#d9534f; color:#fff; border:none; border-radius:8px; margin-left:15px;">
          Delete My Data
        </button>
        <button id="close-modal" style="margin-left:15px; padding:12px 30px; background:#ccc; border:none; border-radius:8px;">
          Cancel
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Attach events after modal is added
  const closeBtn = modal.querySelector('#close-modal');
  if (closeBtn) closeBtn.onclick = () => modal.remove();

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  const saveBtn = modal.querySelector('#save-prefs');
  if (saveBtn) {
    saveBtn.onclick = () => {
      const customPreferences = {
        analytics: document.getElementById('analytics').checked,
        marketing: document.getElementById('marketing').checked,
        personalization: document.getElementById('personalization').checked,
        third_party: document.getElementById('third_party').checked,
        functional: document.getElementById('functional').checked
      };

      const type = Object.values(customPreferences).every(v => v) ? 'accepted' :
        Object.values(customPreferences).every(v => !v) ? 'declined' : 'custom';

      sendConsent(type, customPreferences);
      modal.remove();
    };
  }

  const deleteBtn = modal.querySelector('#delete-data');
  if (deleteBtn) deleteBtn.onclick = deleteRecord;
}

export default function decorate(block) {
  const conf = getBlockConfig();

  if (localStorage.getItem('gmr-cookie-consent')) {
    showPostConsentView();
    return;
  }

  // Create and append wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'cookie-consent-wrapper';

  wrapper.innerHTML = `
    <div class="cookie-consent">
      <div class="cookie-message">
        <p>${conf.message || 'This is Cookie Banner'}
           <a href="${conf.policylink || '#'}" class="cookie-policy-link" target="_blank" rel="noopener">
             ${conf.policylabel || 'policy'}
           </a>
        </p>
      </div>
      <div class="cookie-buttons">
        <button class="cookie-btn secondary">${conf.declinlabel || 'DECLINE'}</button>
        <button class="cookie-btn primary">${conf.acceptlabel || 'ALLOW ALL'}</button>
        <button class="cookie-btn customize">${conf.customizelabel || 'Customise'}</button>
      </div>
    </div>
  `;

  block.parentNode.insertBefore(wrapper, block.nextSibling);

  const allTrue = { analytics: true, marketing: true, personalization: true, third_party: true, functional: true };
  const allFalse = { analytics: false, marketing: false, personalization: false, third_party: false, functional: false };

  const primaryBtn = wrapper.querySelector('.cookie-btn.primary');
  if (primaryBtn) primaryBtn.addEventListener('click', () => sendConsent('accepted', allTrue));

  const secondaryBtn = wrapper.querySelector('.cookie-btn.secondary');
  if (secondaryBtn) secondaryBtn.addEventListener('click', () => sendConsent('declined', allFalse));

  const customizeBtn = wrapper.querySelector('.cookie-btn.customize');
  if (customizeBtn) {
    customizeBtn.addEventListener('click', () => {
      console.log('Customize button clicked'); // Debug
      openCustomizeModal();
    });
  }

  wrapper.style.display = 'block';

  // Hide config table in live mode
  if (!document.body.classList.contains('aue')) {
    block.style.display = 'none';
  }
}