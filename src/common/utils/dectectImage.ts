import vision from "@google-cloud/vision";
import BadRequestException from "../exception/BadRequestException";

const CREDENTIALS = JSON.parse(
  JSON.stringify({
    type: "service_account",
    project_id: "alien-baton-422916-a4",
    private_key_id: "5e0f462fb98d7c7e3c049954d1eaf47cd01c2051",
    private_key: "",
    client_email: "inno-682@alien-baton-422916-a4.iam.gserviceaccount.com",
    client_id: "104857186764304364323",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/inno-682%40alien-baton-422916-a4.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  })
);

const CONFIG = {
  credentials: {
    private_key: CREDENTIALS.private_key,
    client_email: CREDENTIALS.client_email,
  },
};

const client = new vision.ImageAnnotatorClient(CONFIG);

export const detectSafeSearch = async (file_path) => {
  let [result] = await client.safeSearchDetection(file_path);
  return result.safeSearchAnnotation;
};
