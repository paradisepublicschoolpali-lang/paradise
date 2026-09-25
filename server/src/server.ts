import { app } from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🏛️ Paradise Public School - ERP Backend Server`);
  console.log(`  🚀 Server running on: http://localhost:${PORT}`);
  console.log(`  📡 Health Endpoint:   http://localhost:${PORT}/health`);
  console.log(`  🔐 Auth Endpoint:     http://localhost:${PORT}/api/auth/login`);
  console.log(`  🌍 Environment:       ${config.nodeEnv}`);
  console.log(`=======================================================`);
});
