// API Testing Script
// Run with: node test-api.js

const API_BASE = 'http://localhost:3001';

async function testEndpoint(name, method, path, expectedStatus = 200) {
  try {
    const response = await fetch(`${API_BASE}${path}`, { method });
    const status = response.status;
    const success = status === expectedStatus;
    console.log(`${success ? '✓' : '✗'} ${name}: ${status} (expected ${expectedStatus})`);
    return success;
  } catch (error) {
    console.log(`✗ ${name}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Finance Tracker API\n');
  console.log('='.repeat(50));

  let passed = 0;
  let failed = 0;

  // Health check
  console.log('\n📊 Health Check');
  if (await testEndpoint('Health endpoint', 'GET', '/health', 200)) passed++; else failed++;

  // Unauthenticated requests (should return 401)
  console.log('\n🔒 Authentication Tests (should fail without token)');
  if (await testEndpoint('Get organizations (no auth)', 'GET', '/api/organizations/me', 401)) passed++; else failed++;
  if (await testEndpoint('Get transactions (no auth)', 'GET', '/api/transactions?organizationId=test', 401)) passed++; else failed++;
  if (await testEndpoint('Get budgets (no auth)', 'GET', '/api/budgets?organizationId=test', 401)) passed++; else failed++;
  if (await testEndpoint('Get recurring (no auth)', 'GET', '/api/recurring-transactions?organizationId=test', 401)) passed++; else failed++;
  if (await testEndpoint('Get members (no auth)', 'GET', '/api/members?organizationId=test', 401)) passed++; else failed++;
  if (await testEndpoint('Get invitations (no auth)', 'GET', '/api/invitations?organizationId=test', 401)) passed++; else failed++;

  // Invalid routes (should return 404)
  console.log('\n🚫 Invalid Routes (should return 404)');
  if (await testEndpoint('Invalid route', 'GET', '/api/invalid', 404)) passed++; else failed++;
  if (await testEndpoint('Invalid nested route', 'GET', '/api/transactions/invalid/nested', 404)) passed++; else failed++;

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`\n📈 Test Results: ${passed} passed, ${failed} failed`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log('✅ All API tests passed!');
  } else {
    console.log('❌ Some tests failed. Check the output above.');
  }
}

runTests().catch(console.error);
