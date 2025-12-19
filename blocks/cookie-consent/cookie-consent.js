async function logConsentToBackend(status) {
  const API_URL = 'http://13.200.106.168:4000/api/cookie-consent';

  // Default fallback values
  let city = 'unknown';
  let region = 'unknown';    // state / province
  let country = 'unknown';

  // Fetch approximate location via IP (ipapi.co - free tier, no API key required)
  try {
    const geoResponse = await fetch('https://ipapi.co/json/', { method: 'GET' });
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      city = geoData.city || 'unknown';
      region = geoData.region || 'unknown';
      country = geoData.country_name || 'unknown';
    }
  } catch (error) {
    console.warn('⚠️ Geolocation fetch failed (this is okay on some networks/VPNs)', error);
  }

  const userData = {
    userIp: 'anonymous',
    location: Intl.DateTimeFormat().resolvedOptions().timeZone,
    city: city,
    region: region,
    country: country,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    consentType: status
  };

  // Optional: Uncomment next line during testing to see exact payload in console
  // console.log('🚀 Sending consent payload:', userData);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'U2FsdGVkX1+IAunex0zJueoZQpRBfpUm/DSQSMufK69HpTEh4abfdnhz0fQ+jbSmPrqojCZOhYZ6/mvA28aQxw'
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Consent logged successfully with location data.');
      if (result.id) {
        localStorage.setItem('gmr-privacy-id', result.id);
        console.log('💾 Privacy ID saved:', result.id);
      }
    } else {
      console.error('❌ Consent logging failed (server error):', result);
    }
  } catch (error) {
    console.error('❌ Consent log request failed (network/cors?):', error);
  }
}

export default function decorate(block) {
  // 1. If user already made a choice, hide the banner
  if (localStorage.getItem('gmr-cookie-consent')) {
    const wrapper = block.closest('.cookie-consent-wrapper');
    if (wrapper) wrapper.style.display = 'none';
    return;
  }

  // 2. Read configuration from the block (set in AEM/Franklin)
  const conf = {};
  [...block.children].forEach((row) => {
    const key = row.children[0]?.textContent?.trim().toLowerCase();
    if (key === 'message') {
      conf.message = row.children[1]?.innerHTML || 'We use cookies to enhance your user experience.';
    } else if (key) {
      conf[key] = row.children[1]?.textContent?.trim() || '';
    }
  });

  // 3. Build the UI
  block.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'cookie-consent';

  const msgDiv = document.createElement('div');
  msgDiv.className = 'cookie-message';
  msgDiv.innerHTML = conf.message;

  const btnDiv = document.createElement('div');
  btnDiv.className = 'cookie-buttons';

  // Privacy Policy Link
  if (conf.policylink && conf.policylabel) {
    const policy = document.createElement('a');
    policy.href = conf.policylink;
    policy.textContent = conf.policylabel;
    policy.className = 'cookie-policy-link';
    policy.target = '_blank';
    policy.rel = 'noopener';
    btnDiv.appendChild(policy);
  }

  // Decline Button
  const declineBtn = document.createElement('button');
  declineBtn.className = 'cookie-btn secondary';
  declineBtn.textContent = conf.declinlabel || 'Decline';
  declineBtn.addEventListener('click', () => {
    localStorage.setItem('gmr-cookie-consent', 'declined');
    block.closest('.cookie-consent-wrapper').style.display = 'none';
    logConsentToBackend('declined');
  });

  // Accept Button
  const acceptBtn = document.createElement('button');
  acceptBtn.className = 'cookie-btn primary';
  acceptBtn.textContent = conf.acceptlabel || 'Allow all cookies';
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('gmr-cookie-consent', 'accepted');
    block.closest('.cookie-consent-wrapper').style.display = 'none';
    logConsentToBackend('accepted');
  });

  btnDiv.appendChild(declineBtn);
  btnDiv.appendChild(acceptBtn);

  container.appendChild(msgDiv);
  container.appendChild(btnDiv);
  block.appendChild(container);

  // Show the banner
  const wrapper = block.closest('.cookie-consent-wrapper');
  if (wrapper) wrapper.style.display = 'block';
}