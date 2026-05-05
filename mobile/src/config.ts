// ══════════════════════════════════════════════
// Cambiá IS_LOCAL a false para usar AWS
// Cambiá IS_LOCAL a true para desarrollo local
// ══════════════════════════════════════════════

const IS_LOCAL = false;

const LOCAL_URL = 'http://127.0.0.1:8000';
const AWS_URL   = 'https://qeznnpvn51.execute-api.us-east-2.amazonaws.com';

export const BACKEND_URL = IS_LOCAL ? LOCAL_URL : AWS_URL;