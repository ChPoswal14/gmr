// cookie-consent.js - Final Full Version

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
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_HEADER
      },
      body: JSON.stringify(hasConsent ? { id: localStorage.getItem('gmr-privacy-id'), ...payload } : payload)
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
  // Add your GA / Target code here
}

function showPostConsentView() {
  const wrapper = document.querySelector('.cookie-consent-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = `
    <div style="background:#f0f8ff; padding:20px; text-align:center; border-radius:8px;">
      <p>Your preferences have been saved.</p>
      <button id="manage-prefs-btn" style="padding:10px 20px; background:#003366; color:white; border:none; border-radius:6px; cursor:pointer;">
        Manage Preferences
      </button>
    </div>
  `;
  wrapper.style.display = 'block';
  document.getElementById('manage-prefs-btn')?.addEventListener('click', openCustomizeModal);
}

function openCustomizeModal() {
  const conf = {};
  [...document.querySelector('.cookie-consent')?.closest('.block')?.children || []].forEach((row) => {
    const key = row.children[0]?.textContent?.trim().toLowerCase();
    if (key) conf[key] = row.children[1]?.innerHTML || row.children[1]?.textContent?.trim();
  });

  const savedPrefs = JSON.parse(localStorage.getItem('gmr-custom-preferences') || '{}');

  const modal = document.createElement('div');
  modal.id = 'customize-modal';
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:99999;';

  modal.innerHTML = `
    <div style="background:#fff; padding:30px; border-radius:12px; max-width:600px; width:90%; text-align:left; box-shadow:0 8px 30px rgba(0,0,0,0.3);">
      <h2 style="text-align:center; color:#003366;">Customize Cookie Preferences</h2>

      <div style="margin:25px 0;">
        <strong>Essential Cookies</strong><br>
        <small style="color:#666;">Always active – Required for site functionality</small><br>
        <input type="checkbox" checked disabled style="margin-top:8px;">
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="analytics" ${savedPrefs.analytics ? 'checked' : ''}> Analytics Cookies</label><br>
        <small style="color:#666;">${conf.analyticsdesc || 'Help us improve the site'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="marketing" ${savedPrefs.marketing ? 'checked' : ''}> Marketing Cookies</label><br>
        <small style="color:#666;">${conf.marketingdesc || 'Show relevant ads'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="personalization" ${savedPrefs.personalization ? 'checked' : ''}> Personalization Cookies</label><br>
        <small style="color:#666;">${conf.personalizationdesc || 'Tailored content'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="third_party" ${savedPrefs.third_party ? 'checked' : ''}> Third-Party Cookies</label><br>
        <small style="color:#666;">${conf.thirdpartydesc || 'Social media features'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="functional" ${savedPrefs.functional ? 'checked' : ''}> Functional Cookies</label><br>
        <small style="color:#666;">${conf.functionaldesc || 'Remember preferences'}</small>
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

  modal.querySelector('#close-modal').onclick = () => modal.remove();
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  modal.querySelector('#save-prefs').onclick = () => {
    const customPreferences = {
      analytics: document.getElementById('analytics').checked,
      marketing: document.getElementById('marketing').checked,
      personalization: document.getElementById('personalization').checked,
      third_party: document.getElementById('third_party').checked,
      functional: document.getElementById('functional').checked
    };

    const type = (Object.values(customPreferences).every(v => v)) ? 'accepted' :
      (Object.values(customPreferences).every(v => !v)) ? 'declined' : 'custom';

    sendConsent(type, customPreferences);
    modal.remove();
  };

  modal.querySelector('#delete-data').onclick = deleteRecord;
}

export default function decorate(block) {
  const conf = {};
  [...block.children].forEach((row) => {
    const key = row.children[0]?.textContent?.trim().toLowerCase();
    if (key) conf[key] = row.children[1]?.innerHTML || row.children[1]?.textContent?.trim();
  });

  if (localStorage.getItem('gmr-cookie-consent')) {
    showPostConsentView();
    return;
  }

  block.innerHTML = `
    <div class="cookie-consent-wrapper">
      <div class="cookie-consent">
        <div class="cookie-message">
          <p>${conf.message || 'We use cookies to enhance your experience.'}
             <a href="${conf.policylink || '/privacy-policy'}" class="cookie-policy-link" target="_blank" rel="noopener">
               ${conf.policylabel || 'Read Privacy Policy'}
             </a>
          </p>
        </div>
        <div class="cookie-buttons">
          <button class="cookie-btn secondary">${conf.declinlabel || 'Decline'}</button>
          <button class="cookie-btn primary">${conf.acceptlabel || 'Allow all cookies'}</button>
          <button class="cookie-btn customize">${conf.customizelabel || 'Customize'}</button>
        </div>
      </div>
    </div>
  `;

  const allTrue = { analytics: true, marketing: true, personalization: true, third_party: true, functional: true };
  const allFalse = { analytics: false, marketing: false, personalization: false, third_party: false, functional: false };

  block.querySelector('.cookie-btn.primary').addEventListener('click', () => sendConsent('accepted', allTrue));
  block.querySelector('.cookie-btn.secondary').addEventListener('click', () => sendConsent('declined', allFalse));
  block.querySelector('.cookie-btn.customize').addEventListener('click', openCustomizeModal);

  block.querySelector('.cookie-consent-wrapper').style.display = 'block';
}