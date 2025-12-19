// 1. Logging new consent (Accept or Decline) - CREATE record
const LOG_ENDPOINT = 'http://13.200.106.168:4000/api/cookie-consent';

// 2. Withdraw / Update preference - OPTIONAL (if you want to log "withdrawn" in DB)
//    If you don't have this, we handle withdraw client-side only (reset banner)
const WITHDRAW_ENDPOINT = 'http://13.200.106.168:4000/api/cookie-consent/withdraw';  // Can be null if not implemented

// 3. Permanently delete data - DELETE record (REQUIRED for deletion feature)
const DELETE_ENDPOINT = 'http://13.200.106.168:4000/api/cookie-consent/delete';

// Your authorization token (keep as is)
const AUTH_HEADER = 'U2FsdGVkX1+IAunex0zJueoZQpRBfpUm/DSQSMufK69HpTEh4abfdnhz0fQ+jbSmPrqojCZOhYZ6/mvA28aQxw';

// =================================================================

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
    console.warn('⚠️ Geolocation fetch failed', e);
  }
  return { city, region, country };
}

async function logConsent(status) {
  const { city, region, country } = await fetchGeo();

  const payload = {
    userIp: 'anonymous',
    location: Intl.DateTimeFormat().resolvedOptions().timeZone,
    city,
    region,
    country,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    consentType: status
  };

  try {
    const response = await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_HEADER
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Consent logged successfully');

      const savedId = result.id || result.data?.id || result.data?._id || null;
      if (savedId) {
        localStorage.setItem('gmr-privacy-id', savedId);
        console.log('💾 Privacy ID saved:', savedId);
      }

      localStorage.setItem('gmr-cookie-consent', status);
      showPostConsentView(status, savedId);
    } else {
      console.error('❌ Consent logging failed:', result);
      alert('Error saving consent. Please try again.');
    }
  } catch (e) {
    console.error('❌ Network error:', e);
    alert('Network error. Check your connection.');
  }
}

async function deleteConsentRecord(id) {
  if (!id) {
    alert('❌ No Record ID found. Cannot delete.');
    return false;
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

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Data permanently deleted');
      return true;
    } else {
      alert(`❌ Deletion failed: ${result.error || result.message || 'Unknown error'}`);
      return false;
    }
  } catch (e) {
    console.error('❌ Deletion network error:', e);
    alert('❌ Network error during deletion.');
    return false;
  }
}

// Optional: Withdraw consent (mark as withdrawn in DB)
async function withdrawConsent(id) {
  if (!WITHDRAW_ENDPOINT || !id) return false;

  try {
    const response = await fetch(WITHDRAW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_HEADER
      },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      console.log('✅ Consent withdrawn in backend');
      return true;
    }
  } catch (e) {
    console.warn('Withdraw endpoint failed (optional)', e);
  }
  return false;
}

// ... [rest of the code remains exactly the same as previous version: showPostConsentView, openManagementModal, etc.]

function showPostConsentView(currentStatus, savedId) {
  const wrapper = document.querySelector('.cookie-consent-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = `
    <div class="cookie-consent" style="background:#f0f8ff; padding:20px; text-align:center; border-radius:8px;">
      <p style="margin:0 0 15px; font-size:1rem;">
        Your preference: <strong>${currentStatus === 'accepted' ? 'Cookies Allowed' : 'Cookies Declined'}</strong>
      </p>
      <button id="manage-prefs-btn" style="padding:10px 24px; background:#003366; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
        Manage Preferences
      </button>
    </div>
  `;

  wrapper.style.display = 'block';

  document.getElementById('manage-prefs-btn').addEventListener('click', () => {
    openManagementModal(savedId);
  });
}

function openManagementModal(savedId = null) {
  if (document.getElementById('privacy-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'privacy-modal';
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:99999;';

  modal.innerHTML = `
    <div style="background:#fff; padding:30px; border-radius:12px; max-width:520px; width:90%; text-align:center; box-shadow:0 8px 30px rgba(0,0,0,0.3);">
      <h2 style="margin:0 0 15px; color:#003366;">Manage Your Privacy</h2>
      <p style="color:#555; margin-bottom:20px;">Change your cookie preference or permanently delete your data.</p>

      <div style="margin:20px 0;">
        <strong>Your Record ID:</strong><br>
        <input type="text" id="record-id-input" value="${savedId || ''}" readonly
               style="margin-top:8px; width:100%; padding:12px; border:1px solid #ddd; border-radius:6px; background:#f5f5f5; text-align:center; font-family:monospace;" />
      </div>

      <div style="display:flex; gap:15px; flex-wrap:wrap; justify-content:center; margin:25px 0;">
        <button id="change-preference" style="flex:1; min-width:180px; padding:14px; background:#f5a623; color:#000; border:none; border-radius:8px; font-weight:bold;">
          Change Preference<br><small>(Re-show consent banner)</small>
        </button>
        <button id="delete-data" style="flex:1; min-width:180px; padding:14px; background:#d9534f; color:#fff; border:none; border-radius:8px; font-weight:bold;">
          Permanently Delete Data
        </button>
      </div>

      <button id="close-modal" style="padding:10px 20px; background:#ccc; border:none; border-radius:6px; cursor:pointer; margin-top:10px;">
        Close
      </button>

      <div id="modal-status" style="margin-top:20px; min-height:24px; font-weight:bold;"></div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#close-modal').onclick = () => modal.remove();
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  modal.querySelector('#change-preference').onclick = async () => {
    // Optional: call withdraw endpoint if exists
    if (savedId) await withdrawConsent(savedId);

    localStorage.removeItem('gmr-cookie-consent');
    localStorage.removeItem('gmr-privacy-id');
    document.getElementById('modal-status').innerHTML = '<span style="color:green">✅ Preference reset! Reloading...</span>';
    setTimeout(() => location.reload(), 1500);
  };

  modal.querySelector('#delete-data').onclick = async () => {
    const id = document.getElementById('record-id-input').value.trim();
    const statusEl = document.getElementById('modal-status');
    if (!id) {
      statusEl.innerHTML = '<span style="color:red">❌ No Record ID available</span>';
      return;
    }

    statusEl.innerHTML = '<span style="color:#d9534f">Processing deletion...</span>';
    const success = await deleteConsentRecord(id);
    if (success) {
      statusEl.innerHTML = '<span style="color:green">✅ Data permanently deleted! Reloading...</span>';
      localStorage.clear();
      setTimeout(() => location.reload(), 2000);
    }
  };
}

export default function decorate(block) {
  const consent = localStorage.getItem('gmr-cookie-consent');
  const savedId = localStorage.getItem('gmr-privacy-id');

  if (consent) {
    showPostConsentView(consent, savedId);
    return;
  }

  block.innerHTML = `
    <div class="cookie-consent-wrapper">
      <div class="cookie-consent">
        <div class="cookie-message">
          <p>We use cookies to enhance your user experience.
             <a href="/privacy-policy" class="cookie-policy-link" target="_blank" rel="noopener">Read Privacy Policy</a>
          </p>
        </div>
        <div class="cookie-buttons">
          <button class="cookie-btn secondary">Decline</button>
          <button class="cookie-btn primary">Allow all cookies</button>
        </div>
      </div>
    </div>
  `;

  block.querySelector('.cookie-btn.secondary').addEventListener('click', () => logConsent('declined'));
  block.querySelector('.cookie-btn.primary').addEventListener('click', () => logConsent('accepted'));

  const wrapper = block.querySelector('.cookie-consent-wrapper');
  if (wrapper) wrapper.style.display = 'block';
}