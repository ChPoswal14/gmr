// cookie-consent.js - FINAL FULL VERSION (Fixed for AEM Authoring + Full Features)

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
  } catch (e) {
    console.warn('Geolocation fetch failed', e);
  }
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
      alert('Error saving preferences. Please try again.');
    }
  } catch (e) {
    alert('Network error. Check your connection.');
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
  // Google Analytics Consent Mode
  if (window.gtag) {
    gtag('consent', 'update', {
      'analytics_storage': prefs.analytics ? 'granted' : 'denied'
    });
  }

  // Adobe Target (example using Opt-In if available)
  if (window.adobe?.optIn) {
    if (prefs.personalization) {
      adobe.optIn.approve(['target']);
    } else {
      adobe.optIn.deny(['target']);
    }
  }
}

function showPostConsentView() {
  const wrapper = document.querySelector('.cookie-consent-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = `
    <div style="background:#f0f8ff; padding:20px; text-align:center; border-radius:8px; color:#000;">
      <p style="margin:0 0 15px;">Your preferences have been saved.</p>
      <button id="manage-prefs-btn" style="padding:10px 24px; background:#003366; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
        Manage Preferences
      </button>
    </div>
  `;
  wrapper.style.display = 'block';
  document.getElementById('manage-prefs-btn')?.addEventListener('click', openCustomizeModal);
}

function openCustomizeModal() {
  // Re-read config every time modal opens (critical for authoring changes)
  const conf = {};
  const rows = document.querySelectorAll('.cookie-consent.block > div > div');
  rows.forEach((row) => {
    const cells = row.querySelectorAll('div');
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase().replace(/\s+/g, '');
      const value = cells[1];
      if (key === 'message') {
        conf.message = value.innerHTML.trim();
      } else if (key.includes('desc')) {
        conf[key] = value.innerHTML.trim();
      } else {
        conf[key] = value.textContent.trim();
      }
    }
  });

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
        <small style="color:#666;">${conf.analyticsdesc || 'Help us improve the site with usage data'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="marketing" ${savedPrefs.marketing ? 'checked' : ''}> Marketing Cookies</label><br>
        <small style="color:#666;">${conf.marketingdesc || 'Show relevant advertisements'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="personalization" ${savedPrefs.personalization ? 'checked' : ''}> Personalization Cookies</label><br>
        <small style="color:#666;">${conf.personalizationdesc || 'Tailored content and experiences'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="third_party" ${savedPrefs.third_party ? 'checked' : ''}> Third-Party Cookies</label><br>
        <small style="color:#666;">${conf.thirdpartydesc || 'Social media and sharing features'}</small>
      </div>

      <div style="margin:20px 0;">
        <label><input type="checkbox" id="functional" ${savedPrefs.functional ? 'checked' : ''}> Functional Cookies</label><br>
        <small style="color:#666;">${conf.functionaldesc || 'Remember your preferences'}</small>
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

    const type = Object.values(customPreferences).every(v => v) ? 'accepted' :
      Object.values(customPreferences).every(v => !v) ? 'declined' : 'custom';

    sendConsent(type, customPreferences);
    modal.remove();
  };

  modal.querySelector('#delete-data').onclick = deleteRecord;
}

export default function decorate(block) {
  // Robust config reading - works in AEM Author, Preview, and Live
  const conf = {};
  const rows = block.querySelectorAll(':scope > div');
  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length >= 2) {
      const keyCell = cells[0];
      const valueCell = cells[1];
      const key = keyCell.textContent.trim().toLowerCase().replace(/\s+/g, '');
      if (key === 'message') {
        conf.message = valueCell.innerHTML.trim();
      } else if (key.includes('desc')) {
        conf[key] = valueCell.innerHTML.trim();
      } else {
        conf[key] = valueCell.textContent.trim();
      }
    }
  });

  // Fallback defaults
  conf.message = conf.message || 'We use cookies and similar technologies to enhance your experience.';
  conf.policylabel = conf.policylabel || 'Read Privacy Policy';
  conf.policylink = conf.policylink || '/privacy-policy';
  conf.acceptlabel = conf.acceptlabel || 'Allow all cookies';
  conf.declinlabel = conf.declinlabel || 'Decline';
  conf.customizelabel = conf.customizelabel || 'Customize';

  if (localStorage.getItem('gmr-cookie-consent')) {
    showPostConsentView();
    return;
  }

  block.innerHTML = `
    <div class="cookie-consent-wrapper">
      <div class="cookie-consent">
        <div class="cookie-message">
          <p>${conf.message}
             <a href="${conf.policylink}" class="cookie-policy-link" target="_blank" rel="noopener">
               ${conf.policylabel}
             </a>
          </p>
        </div>
        <div class="cookie-buttons">
          <button class="cookie-btn secondary">${conf.declinlabel}</button>
          <button class="cookie-btn primary">${conf.acceptlabel}</button>
          <button class="cookie-btn customize">${conf.customizelabel}</button>
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