// Simple test to verify local authentication works
// This file can be deleted after testing

// Test local user storage functions
const LOCAL_USERS_KEY = 'mock_ai_users'

const testUsers = [
  {
    id: 'local_test_1',
    email: 'test@example.com',
    password: 'password123',
    user_metadata: {
      full_name: 'Test User',
      avatar_url: 'https://ui-avatars.com/api/?name=Test%20User&background=random&color=fff&size=128'
    },
    created_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString()
  }
]

// Save test user
localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(testUsers))

console.log('Test user created:', testUsers[0].email)
console.log('You can now sign in with: test@example.com / password123')

// Verify storage
const storedUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]')
console.log('Stored users:', storedUsers.length)