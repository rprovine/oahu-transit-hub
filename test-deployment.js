// Test script to verify deployment changes
const testDeployment = async () => {
  console.log('Testing Oahu Transit Hub deployment...\n');
  
  // Test production site
  try {
    const response = await fetch('https://oahu-transit-hub.vercel.app/trip-planner');
    const html = await response.text();
    
    // Check for v2.3 marker
    if (html.includes('v2.3')) {
      console.log('✅ Version 2.3 is deployed');
    } else {
      console.log('❌ Old version still showing');
    }
    
    // Check for fixed features
    if (html.includes('Fixed saved locations')) {
      console.log('✅ Fixed saved locations text found');
    }
    
    if (html.includes('savedLocations.home')) {
      console.log('✅ Home button logic updated');
    }
    
    if (html.includes('savedLocations.work')) {
      console.log('✅ Work button logic updated');
    }
    
    // Check cache headers
    const cacheControl = response.headers.get('cache-control');
    const xVersion = response.headers.get('x-version');
    console.log('\nCache headers:');
    console.log('Cache-Control:', cacheControl);
    console.log('X-Version:', xVersion);
    
  } catch (error) {
    console.error('Error testing deployment:', error);
  }
  
  console.log('\n📱 Test the app at: https://oahu-transit-hub.vercel.app/trip-planner');
  console.log('\nTo verify saved locations work:');
  console.log('1. Go to Settings: https://oahu-transit-hub.vercel.app/settings');
  console.log('2. Add a Home address (e.g., "91-1020 Palala St, Ewa Beach, HI")');
  console.log('3. Add a Work address (e.g., "Ala Moana Center, Honolulu, HI")');
  console.log('4. Click "Save Settings"');
  console.log('5. Go to Trip Planner: https://oahu-transit-hub.vercel.app/trip-planner');
  console.log('6. The Home/Work buttons should now be enabled and clickable');
  console.log('7. Autocomplete should work when typing even 1 character');
};

testDeployment();