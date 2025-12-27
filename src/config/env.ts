import Constants from 'expo-constants';

interface Config {
  nodeEnv: string;
  apiUrl: string;
  enableMockLogin: boolean;
}

const getConfig = (): Config => {
  const extra = Constants.expoConfig?.extra || {};

  // Configuração manual - Mude aqui para alternar entre dev/prod
  const isDev = true; // Mude para false em produção

  return {
    nodeEnv: isDev ? 'development' : 'production',
    apiUrl: extra.apiUrl || 'http://localhost:3000/api',
    enableMockLogin: isDev, // true em dev, false em prod
  };
};

export const config = getConfig();

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
