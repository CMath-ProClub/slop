// Test TMDb API Connection
// Run with: node test-tmdb.js

require('dotenv').config();
const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

async function testTMDbConnection() {
  console.log('🔍 Testing TMDb API Connection...\n');
  
  // Show which authentication method we're using
  if (TMDB_READ_ACCESS_TOKEN) {
    console.log('✅ Using Read Access Token (Bearer authentication)');
    console.log(`   Token: ${TMDB_READ_ACCESS_TOKEN.substring(0, 20)}...\n`);
  } else if (TMDB_API_KEY) {
    console.log('✅ Using API Key authentication');
    console.log(`   API Key: ${TMDB_API_KEY}\n`);
  } else {
    console.log('❌ No TMDb credentials found in .env file\n');
    return;
  }

  try {
    // Test 1: Search for Breaking Bad
    console.log('Test 1: Searching for "Breaking Bad"...');
    
    const searchConfig = {
      headers: TMDB_READ_ACCESS_TOKEN ? {
        'Authorization': `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      } : {},
      params: {
        query: 'Breaking Bad',
        include_adult: false
      }
    };
    
    if (!TMDB_READ_ACCESS_TOKEN) {
      searchConfig.params.api_key = TMDB_API_KEY;
    }
    
    const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/tv`, searchConfig);
    
    if (searchResponse.data.results && searchResponse.data.results.length > 0) {
      const show = searchResponse.data.results[0];
      console.log('✅ Search successful!');
      console.log(`   Found: ${show.name} (${show.first_air_date?.split('-')[0]})`);
      console.log(`   ID: ${show.id}`);
      console.log(`   Rating: ${show.vote_average}/10\n`);
      
      // Test 2: Get show details
      console.log('Test 2: Getting show details...');
      
      const detailsConfig = {
        headers: TMDB_READ_ACCESS_TOKEN ? {
          'Authorization': `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        } : {},
        params: {
          append_to_response: 'credits'
        }
      };
      
      if (!TMDB_READ_ACCESS_TOKEN) {
        detailsConfig.params.api_key = TMDB_API_KEY;
      }
      
      const detailsResponse = await axios.get(`${TMDB_BASE_URL}/tv/${show.id}`, detailsConfig);
      
      console.log('✅ Details retrieved!');
      console.log(`   Seasons: ${detailsResponse.data.number_of_seasons}`);
      console.log(`   Episodes: ${detailsResponse.data.number_of_episodes}`);
      console.log(`   Status: ${detailsResponse.data.status}\n`);
      
      console.log('🎉 All tests passed! Your TMDb API credentials are working correctly.\n');
    } else {
      console.log('⚠️  Search returned no results\n');
    }
    
  } catch (error) {
    console.log('❌ Error testing TMDb API:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.status_message || error.response.statusText}`);
      
      if (error.response.status === 401) {
        console.log('\n   💡 Tip: Check that your API key or read access token is correct in .env');
      }
    } else {
      console.log(`   ${error.message}`);
    }
    console.log('');
  }
}

testTMDbConnection();
