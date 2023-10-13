import * as fs from 'fs';
import * as readlineSync from 'readline-sync';
import { featureFlags } from './featureFlags/featureFlags';
import { abTesting } from './abTesting/abTesting';

interface User {
  username: string;
  password: string;
}

interface Configuration {
  features: {
    userAuthentication: boolean;
    // Add more features as needed
  };
}

const configFilePath: string = './config/config.json';
const userFilePath: string = './users/users.json';

// Function to read and parse a JSON configuration file
function readConfigFile(filePath: string): Promise<Configuration> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const config: Configuration = JSON.parse(data);
          resolve(config);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

// Function to read and parse a JSON user file
function readUserFile(filePath: string): Promise<User[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const users: User[] = JSON.parse(data);
          resolve(users);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}


readConfigFile(configFilePath)
  .then((config) => {
    console.log('Configuration:', config);

    // Load feature flags from environment variables
    const featureFlagsConfig = featureFlags.loadFromEnvironment();

    // Apply feature flags
    const applyFeatureFlags = featureFlags.apply(config.features, featureFlagsConfig);

    // Feature: User Authentication
    if (config.features.userAuthentication && applyFeatureFlags) {
      
      console.log('User Authentication feature is enabled.');
      performUserAuthentication(userFilePath);
    } else {
      console.log('User Authentication feature is disabled.');
    }
    // A/B Testing
    abTesting.runAOrBTest();
    // Use other configuration settings in your application
  })
  .catch((err) => {
    console.error('Error reading or parsing the configuration file:', err);
  });


  function performUserAuthentication(userFilePath: string) {
    const username = readlineSync.question('Enter your username: ');
    const password = readlineSync.question('Enter your password: ', {
      hideEchoBack: true, // This hides the password as the user types
    });
  
    // Read user credentials from the users.json file
    readUserFile(userFilePath)
      .then((users) => {
        const foundUser = users.find((user) => user.username === username && user.password === password);
        if (foundUser) {
          console.log('Authentication successful. Welcome, ' + username + '!');
        } else {
          console.log('Authentication failed. Invalid username or password.');
        }
      })
      .catch((err) => {
        console.error('Error reading user file:', err);
      });
  }