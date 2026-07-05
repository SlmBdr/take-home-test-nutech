import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;

async function runTests() {
  console.log('🏁 Starting PPOB Backend API Integration Tests...\n');
  console.log(`Target Server: ${baseUrl}`);

  const testEmail = `tester-${Math.floor(Math.random() * 100000)}@nutech-integrasi.com`;
  const testPassword = 'securePassword123';
  let jwtToken = '';

  try {
    // ----------------------------------------------------
    // TEST 1: Register New User
    // ----------------------------------------------------
    console.log('🧪 Test 1: Register User (Success case)...');
    const registerRes = await fetch(`${baseUrl}/registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        first_name: 'John',
        last_name: 'Doe',
        password: testPassword,
      }),
    });
    const registerJson = await registerRes.json() as any;
    console.log('Response:', registerJson);
    if (registerRes.status !== 200 || registerJson.status !== 0) {
      throw new Error(`Registration failed: ${registerJson.message}`);
    }
    console.log('✅ Register User Success\n');

    // ----------------------------------------------------
    // TEST 2: Register Validation Failures
    // ----------------------------------------------------
    console.log('🧪 Test 2: Register Validation (Invalid email format)...');
    const regValRes = await fetch(`${baseUrl}/registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid-email',
        first_name: 'John',
        last_name: 'Doe',
        password: testPassword,
      }),
    });
    const regValJson = await regValRes.json() as any;
    console.log('Response:', regValJson);
    if (regValRes.status !== 400 || regValJson.status !== 102) {
      throw new Error('Expected 400 Bad Request with status 102 for invalid email format.');
    }
    console.log('✅ Email Validation Handled Successfully\n');

    // ----------------------------------------------------
    // TEST 3: Login User (Success)
    // ----------------------------------------------------
    console.log('🧪 Test 3: Login User...');
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    const loginJson = await loginRes.json() as any;
    console.log('Response:', loginJson);
    if (loginRes.status !== 200 || loginJson.status !== 0 || !loginJson.data.token) {
      throw new Error(`Login failed: ${loginJson.message}`);
    }
    jwtToken = loginJson.data.token;
    console.log('✅ Login Success (Token received)\n');

    // ----------------------------------------------------
    // TEST 4: Get Profile (Auth Required)
    // ----------------------------------------------------
    console.log('🧪 Test 4: Get Profile...');
    const profileRes = await fetch(`${baseUrl}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });
    const profileJson = await profileRes.json() as any;
    console.log('Response:', profileJson);
    if (profileRes.status !== 200 || profileJson.status !== 0) {
      throw new Error(`Profile fetch failed: ${profileJson.message}`);
    }
    console.log('✅ Fetch Profile Success\n');

    // ----------------------------------------------------
    // TEST 5: Update Profile
    // ----------------------------------------------------
    console.log('🧪 Test 5: Update Profile...');
    const updateRes = await fetch(`${baseUrl}/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        first_name: 'John Edited',
        last_name: 'Doe Edited',
      }),
    });
    const updateJson = await updateRes.json() as any;
    console.log('Response:', updateJson);
    if (updateRes.status !== 200 || updateJson.status !== 0) {
      throw new Error(`Profile update failed: ${updateJson.message}`);
    }
    console.log('✅ Update Profile Success\n');

    // ----------------------------------------------------
    // TEST 6: Get Banners (Public)
    // ----------------------------------------------------
    console.log('🧪 Test 6: Get Banners (Public)...');
    const bannerRes = await fetch(`${baseUrl}/banner`, { method: 'GET' });
    const bannerJson = await bannerRes.json() as any;
    console.log('Response length:', bannerJson.data?.length || 0);
    if (bannerRes.status !== 200 || bannerJson.status !== 0) {
      throw new Error(`Banner fetch failed: ${bannerJson.message}`);
    }
    console.log('✅ Fetch Banners Success\n');

    // ----------------------------------------------------
    // TEST 7: Get Services (Auth Required)
    // ----------------------------------------------------
    console.log('🧪 Test 7: Get Services (Private)...');
    const serviceRes = await fetch(`${baseUrl}/services`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });
    const serviceJson = await serviceRes.json() as any;
    console.log('Response count:', serviceJson.data?.length || 0);
    if (serviceRes.status !== 200 || serviceJson.status !== 0) {
      throw new Error(`Services fetch failed: ${serviceJson.message}`);
    }
    console.log('✅ Fetch Services Success\n');

    // ----------------------------------------------------
    // TEST 8: Get Balance
    // ----------------------------------------------------
    console.log('🧪 Test 8: Get Initial Balance...');
    const balanceRes = await fetch(`${baseUrl}/balance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });
    const balanceJson = await balanceRes.json() as any;
    console.log('Response:', balanceJson);
    if (balanceRes.status !== 200 || balanceJson.status !== 0) {
      throw new Error(`Balance inquiry failed: ${balanceJson.message}`);
    }
    console.log('✅ Fetch Balance Success\n');

    // ----------------------------------------------------
    // TEST 9: Top Up Balance
    // ----------------------------------------------------
    console.log('🧪 Test 9: Perform Top Up...');
    const topupRes = await fetch(`${baseUrl}/topup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        top_up_amount: 150000,
      }),
    });
    const topupJson = await topupRes.json() as any;
    console.log('Response:', topupJson);
    if (topupRes.status !== 200 || topupJson.status !== 0 || topupJson.data.balance !== 150000) {
      throw new Error(`Top Up failed or incorrect balance returned: ${topupJson.message}`);
    }
    console.log('✅ Top Up Balance Success\n');

    // ----------------------------------------------------
    // TEST 10: Make Payment Transaction (PLN - 10000)
    // ----------------------------------------------------
    console.log('🧪 Test 10: Make Payment Transaction (PLN - 10000)...');
    const paymentRes = await fetch(`${baseUrl}/transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        service_code: 'PLN',
      }),
    });
    const paymentJson = await paymentRes.json() as any;
    console.log('Response:', paymentJson);
    if (paymentRes.status !== 200 || paymentJson.status !== 0 || paymentJson.data.total_amount !== 10000) {
      throw new Error(`Payment failed: ${paymentJson.message}`);
    }
    console.log('✅ Payment Transaction Success\n');

    // ----------------------------------------------------
    // TEST 11: Get Balance After Payment (Should be 140000)
    // ----------------------------------------------------
    console.log('🧪 Test 11: Verify Balance after deduction...');
    const verifyBalRes = await fetch(`${baseUrl}/balance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });
    const verifyBalJson = await verifyBalRes.json() as any;
    console.log('Response:', verifyBalJson);
    if (verifyBalJson.data.balance !== 140000) {
      throw new Error(`Expected balance 140000, got ${verifyBalJson.data.balance}`);
    }
    console.log('✅ Balance Verification Success\n');

    // ----------------------------------------------------
    // TEST 12: Fetch Transaction History
    // ----------------------------------------------------
    console.log('🧪 Test 12: Get Transaction History...');
    const historyRes = await fetch(`${baseUrl}/transaction/history?limit=3`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });
    const historyJson = await historyRes.json() as any;
    console.log('Records returned:', historyJson.data?.records?.length || 0);
    if (historyRes.status !== 200 || historyJson.status !== 0 || historyJson.data.records.length !== 2) {
      throw new Error(`History inquiry failed or returned incorrect record size: ${historyJson.message}`);
    }
    console.log('✅ Fetch History Success\n');

    console.log('🎉 All integration tests passed successfully! 🎉');
  } catch (error: any) {
    console.error('\n❌ Test run failed with error:', error.message);
    process.exit(1);
  }
}

// Check if running directly
runTests();
