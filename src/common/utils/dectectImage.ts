import vision from "@google-cloud/vision";

const CREDENTIALS = JSON.parse(
  JSON.stringify({
    type: "service_account",
    project_id: "alien-baton-422916-a4",
    private_key_id: "5e0f462fb98d7c7e3c049954d1eaf47cd01c2051",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDFT23rpb/RpI7e\nc4nFJ+ojH9MBVNfzgenxWKcKL+J5oDHDYflzivGfVY5O4R7nf5SLQE87IQndBOy0\nbVLiXh0rE2rFun8HgsObFcSQihetNfFztnhPOAyrkdX3WJb3TPAAbitQlrBkz6pC\nRqYgpmZa+KHx/zu4vyU0Qbpyn/b+MVD+HOD78qo764D5301hoOG3LrIQMsxo7C+B\n8DbpN9CvRxuzZS0fQ33106a1oc50DnPgArbv8Fb0bvoUB4UZHIkXBjTqvLv6Zeyc\ncUDZH2IdY3zcmRj91p5ks+LxmfQsxK+D6q90X0zPorL5+t5AKp1CwL7K8ibD41Ms\nprx/fvh3AgMBAAECggEABIspilbPndRuxSOe+rnKaVL8c8LlktdyhjAW706epf4G\nN1bEZ6CS+NV/s0RO3GDdOv8DnrvKM4XqAiukUCR/rR7Dg4MhwBAG+3AbDdhdkYu0\n9YewVI6uCANnNyIZ897t20IDiwBgASpLuZP76QjmltYJO1PifFohJrIUHjtIdPOu\nX5o329aziibzxGhbilnC8C5IsgjRL2r+TTxNrqf3reWIMjITCRFOWGBnrHwxrIfE\nYTs1PjtJ1MAEPPA4TS7FeRsZPxXxk7agzepOUVRrv3yQcLt9QKDNsBIKRwxin9aw\nJuTvG4J7RRd8J3tvr7WwcgJDrsOjg26wBPHP1r0qtQKBgQD4mlOVsHLxTSWG7DFm\n0DRYAxg1sY5l3r9R6xz8hbroPkcQtmQdImOC/zy2597Wz2blvm+WWhJ4nF+B7rWN\n8fDXjYb2/LavOt4HronGcvPk/KbFgg6GN4o326ACXwttkDBp3Rvuve2EKIraBiEt\nrPaXo58g8H4qmlFyzJVOkKZ0ewKBgQDLLmTSvB+BmgQo7GHjDin3NZ6FlrsmduuT\nyh7P7KL9VDZH0Y+un9TbJ6exe71Xs1ZnCB2Ff0zv82HwlzvfcxiVbXe360b9kWKL\nW3dtHd30ZLvv3/7beCygSaAopnXtrjIrxN/FpDjwRvRaYsXmNbrZ/jrb56Eza+Os\ns1QaPX8hNQKBgG+cYbBPopshBpsXiWpeSVHGOeVJTOQBaCWwB7h7lZlU9HTVXgcS\nfFjAnJKFcS9BuDGnGNQIpkhN9DcSY6JRn842dQSIGsB7Dlmmi6Zzz3nb0EfWBw1M\n/Bnt2V2XLDtJQ+MTaMn7rRnrVcNigxzNjXww8m1Ia2xXEgAXR2UZXhHnAoGAVMOV\nImmDR2FGrP/40m3dShnfeWHpz+E65JwlAJ97W+5e+tVNeQ+LEKbZiezSkBzsRe2X\ny1LReSVzTZj6TH1K20Qg9uS76BtYHkVZbHdSWpwP38H2I/9dtr0giPTxK+hJXAM1\nS9H4Qx2G4ZJld2Yg/sLWMVnP4ZD4GdtykcPoHqUCgYBhugneb3Yw2VzR72/oR4HX\nFZBC21zn6Cjg4UDytcuZQLXY6VxjlXyBvxjtarjzngcDDrA9F/kBgH9bpqs/pMYU\nC24WCelsSBUlEUzGpVSfxXb32OtD4JOorVdd8AGBzbynIw5AIxUG+Bwt0jUM4har\nPgY4C6NVydxnvxhzW221Gw==\n-----END PRIVATE KEY-----\n",
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
  const detections = result.safeSearchAnnotation;
  return [
    detections?.adult,
    detections?.spoof,
    detections?.medical,
    detections?.violence,
    detections?.racy,
  ];
};
