import dotenv from 'dotenv';

dotenv.config();

export const PORT = 4500;
export const CLIENT_URL ='http://localhost:4200';
export const DATABASE_URL = 'mongodb://127.0.0.1:27017/aya_ecommerce';
export const JWT_SECRET =  'supersecretjwt';
export const STRIPE_SECRET ='sk_test_51R6q6lRvr7CocWURjbPMWk2XstUnzfufabbKS4pB4pMtFuxQmb71dJLTLFfX0IgmysZAvOLIsucicWJ0V9tnFWmp00aiHdOZtT';
export const STRIPE_WEBHOOK_SECRET ='whsec_45065cbf8f30ad16d07531f6f58e14b2c5ab30869121b3eb8d96c62e634800d5';