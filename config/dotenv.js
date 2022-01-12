import dotenv from "dotenv";
const infuraEndpoints = {};
//dotenv.config();

for (const env in dotenv.config().parsed) {
  const networkName = env.slice(0, 6) === "INFURA" ? env.slice(7) : null;

  if (networkName) {
    const networkVal = dotenv.config().parsed[env];
    infuraEndpoints[networkName] = networkVal;
  }
}

export default infuraEndpoints;
