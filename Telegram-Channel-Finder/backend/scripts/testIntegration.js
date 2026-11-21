// Integration & Verification Test Suite for Telegram Channel Finder

const BASE_URL = 'http://127.0.0.1:5000';

async function runTests() {
  console.log('🧪 Starting Telegram Channel Finder End-to-End Verification...\n');
  let cookieHeader = '';

  // Test 1: API Health
  console.log('--- Test 1: Health Check ---');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData = await healthRes.json();
  console.log('Health Response:', healthData);
  if (healthData.status !== 'online') throw new Error('Health check failed');
  console.log('✅ Test 1 Passed: API is online.\n');

  // Test 2: Categories
  console.log('--- Test 2: Categories Fetching ---');
  const catRes = await fetch(`${BASE_URL}/api/channels/categories`);
  const catData = await catRes.json();
  console.log(`Fetched ${catData.categories?.length} categories:`, catData.categories?.map(c => c.name).join(', '));
  if (!catData.categories || catData.categories.length === 0) throw new Error('Categories fetch failed');
  const techCategory = catData.categories[0];
  console.log('✅ Test 2 Passed: Categories loaded.\n');

  // Test 3: Public Settings
  console.log('--- Test 3: Public Settings ---');
  const settingsRes = await fetch(`${BASE_URL}/api/settings/public`);
  const settingsData = await settingsRes.json();
  console.log('Public Settings:', settingsData.settings);
  if (!settingsData.settings?.sponsorship_email || !settingsData.settings?.developer_email) {
    throw new Error('Public settings failed');
  }
  console.log('✅ Test 3 Passed: Public settings retrieved.\n');

  // Test 4: Channel Submission (Public)
  console.log('--- Test 4: Channel Submission ---');
  const submitPayload = {
    name: 'Tech Innovations Hub',
    telegram_url: 'https://t.me/techinnovationshub',
    description: 'Premier daily community for artificial intelligence, software engineering, and bleeding edge tech innovations.',
    category_id: techCategory.id,
    keywords: 'technology, ai, software, engineering, coding',
    language: 'English'
  };

  const submitRes = await fetch(`${BASE_URL}/api/channels/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submitPayload)
  });
  const submitData = await submitRes.json();
  console.log('Submit Response:', submitData);
  if (!submitData.success) throw new Error(`Submission failed: ${submitData.message}`);
  const submittedChannelId = submitData.channelId;
  console.log(`✅ Test 4 Passed: Channel submitted as pending (ID: ${submittedChannelId}).\n`);

  // Test 5: Verify Pending Channel is NOT in public search
  console.log('--- Test 5: Public Search (Pending Exclusion) ---');
  const searchBeforeRes = await fetch(`${BASE_URL}/api/channels/search?q=Innovations`);
  const searchBeforeData = await searchBeforeRes.json();
  console.log(`Search result count before approval: ${searchBeforeData.total}`);
  const foundBefore = searchBeforeData.channels?.some(c => c.id === submittedChannelId);
  if (foundBefore) throw new Error('Security flaw: Pending channel appeared in public search!');
  console.log('✅ Test 5 Passed: Pending channel is correctly excluded from public search.\n');

  // Test 6: Admin Login
  console.log('--- Test 6: Admin Login Authentication ---');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'silkroad2.o',
      password: 'silkroad3.o'
    })
  });

  const rawCookies = loginRes.headers.get('set-cookie');
  if (rawCookies) {
    cookieHeader = rawCookies.split(';')[0];
  }
  const loginData = await loginRes.json();
  console.log('Login Response:', loginData);
  if (!loginData.success) throw new Error(`Admin login failed: ${loginData.message}`);
  console.log('Cookie received:', cookieHeader);
  console.log('✅ Test 6 Passed: Admin authenticated successfully.\n');

  // Test 7: Admin Session Verification (/api/auth/me)
  console.log('--- Test 7: Session Verification (/api/auth/me) ---');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookieHeader }
  });
  const meData = await meRes.json();
  console.log('Me Response:', meData);
  if (!meData.authenticated || meData.user?.username !== 'silkroad2.o') {
    throw new Error('Session check failed');
  }
  console.log('✅ Test 7 Passed: Session correctly validated.\n');

  // Test 8: Admin Pending Submissions List
  console.log('--- Test 8: Admin Submissions List ---');
  const pendingRes = await fetch(`${BASE_URL}/api/admin/submissions/pending`, {
    headers: { Cookie: cookieHeader }
  });
  const pendingData = await pendingRes.json();
  console.log(`Pending count: ${pendingData.total}`);
  const hasSub = pendingData.submissions?.some(s => s.id === submittedChannelId);
  if (!hasSub) throw new Error('Submitted channel not found in pending list');
  console.log('✅ Test 8 Passed: Submitted channel found in admin pending review.\n');

  // Test 9: Admin Approve Submission
  console.log('--- Test 9: Admin Approve Channel ---');
  const approveRes = await fetch(`${BASE_URL}/api/admin/submissions/${submittedChannelId}/approve`, {
    method: 'POST',
    headers: { Cookie: cookieHeader }
  });
  const approveData = await approveRes.json();
  console.log('Approve Response:', approveData);
  if (!approveData.success) throw new Error(`Approval failed: ${approveData.message}`);
  console.log('✅ Test 9 Passed: Channel approved successfully.\n');

  // Test 10: Public Search After Approval (Weighted Scoring Test)
  console.log('--- Test 10: Public Weighted Search Verification ---');
  const searchAfterRes = await fetch(`${BASE_URL}/api/channels/search?q=Innovations`);
  const searchAfterData = await searchAfterRes.json();
  console.log(`Search result count after approval: ${searchAfterData.total}`);
  const foundChan = searchAfterData.channels?.find(c => c.id === submittedChannelId);
  if (!foundChan) throw new Error('Approved channel not returned in search!');
  console.log(`Found channel "${foundChan.name}" with relevance score: ${foundChan.relevance_score}`);
  if (foundChan.relevance_score <= 0) throw new Error('Relevance scoring did not calculate properly');
  console.log('✅ Test 10 Passed: Relevance scoring and search matching verified.\n');

  // Test 11: Add to Top 100 Sponsored Directory
  console.log('--- Test 11: Add to Top 100 Sponsored ---');
  const addSponRes = await fetch(`${BASE_URL}/api/admin/sponsored`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader
    },
    body: JSON.stringify({
      channel_id: submittedChannelId,
      badge_text: 'Verified Partner',
      notes: 'Initial test partner'
    })
  });
  const addSponData = await addSponRes.json();
  console.log('Add Sponsored Response:', addSponData);
  if (!addSponData.success) throw new Error(`Add sponsored failed: ${addSponData.message}`);
  console.log('✅ Test 11 Passed: Added to Top 100 Sponsored directory.\n');

  // Test 12: Feature in Top 10 Orbit
  console.log('--- Test 12: Feature in Top 10 Featured Orbit ---');
  const sponListRes = await fetch(`${BASE_URL}/api/admin/sponsored`, {
    headers: { Cookie: cookieHeader }
  });
  const sponListData = await sponListRes.json();
  const sponsoredRecord = sponListData.sponsored?.find(s => s.channel_id === submittedChannelId);
  if (!sponsoredRecord) throw new Error('Could not find sponsored record');

  const featRes = await fetch(`${BASE_URL}/api/admin/featured/${sponsoredRecord.id}`, {
    method: 'POST',
    headers: { Cookie: cookieHeader }
  });
  const featData = await featRes.json();
  console.log('Set Featured Response:', featData);
  if (!featData.success) throw new Error(`Set featured failed: ${featData.message}`);
  console.log('✅ Test 12 Passed: Featured in Top 10 Orbit successfully.\n');

  // Test 13: Verify Public Featured & Sponsored Endpoints
  console.log('--- Test 13: Public Featured & Sponsored Endpoints ---');
  const pubFeatRes = await fetch(`${BASE_URL}/api/sponsored/featured`);
  const pubFeatData = await pubFeatRes.json();
  console.log(`Public Featured count: ${pubFeatData.count}`);

  const pubSponRes = await fetch(`${BASE_URL}/api/sponsored/top100`);
  const pubSponData = await pubSponRes.json();
  console.log(`Public Top 100 count: ${pubSponData.count}`);

  if (pubFeatData.count === 0 || pubSponData.count === 0) {
    throw new Error('Public sponsored or featured directory did not return channel');
  }
  console.log('✅ Test 13 Passed: Featured Orbit and Top 100 endpoints working.\n');

  // Test 14: Admin Dashboard Stats
  console.log('--- Test 14: Dashboard Statistics ---');
  const statsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: { Cookie: cookieHeader }
  });
  const statsData = await statsRes.json();
  console.log('Dashboard Stats:', statsData.stats);
  if (!statsData.success) throw new Error('Dashboard stats failed');
  console.log('✅ Test 14 Passed: Statistics retrieved accurately.\n');

  // Test 15: Frontend Index HTML Serving
  console.log('--- Test 15: Frontend Availability ---');
  const frontendRes = await fetch('http://127.0.0.1:5173');
  const frontendHtml = await frontendRes.text();
  if (!frontendHtml.includes('Telegram Channel Finder')) {
    throw new Error('Frontend does not serve expected HTML');
  }
  console.log('✅ Test 15 Passed: Frontend is responsive on http://127.0.0.1:5173.\n');

  console.log('═══════════════════════════════════════════════════════');
  console.log('🎉 ALL 15 INTEGRATION & VERIFICATION TESTS PASSED! 🎉');
  console.log('═══════════════════════════════════════════════════════');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});

