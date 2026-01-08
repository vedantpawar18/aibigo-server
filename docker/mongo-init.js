// MongoDB initialization script
// This runs when the MongoDB container is first created

db = db.getSiblingDB('aibigo');

// Create collections with validation (optional)
// Collections will be created automatically when first document is inserted

print('Database "aibigo" initialized');
