export const featureFlags = {
    // Load feature flags from environment variables
    loadFromEnvironment: (): Record<string, boolean> => {
      const featureFlagsConfig: Record<string, boolean> = {
        userAuthentication: process.env.USER_AUTHENTICATION === 'true',
        // Add more feature flags as needed
      };
      return featureFlagsConfig;
    },
  
    // Apply feature flags
    apply: (config: Record<string, boolean>, featureFlagsConfig: Record<string, boolean>): Record<string, boolean> => {
      return {
        ...config,
        ...featureFlagsConfig,
      };
    },
  };
  