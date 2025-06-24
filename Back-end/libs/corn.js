import cron from "node-cron";
import axios from "axios";
import moment from "moment-timezone";

const API_URL = process.env.FRONTEND_URL_R;

cron.schedule("*/5 8-23 * * *", async () => {
  const nowIST = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  console.log(`⏱️ Running health check at ${nowIST} IST`);

  try {
    await axios.get(`${API_URL}/api/auth/v1/health-check`);
    console.log("✅ Health check successful");
  } catch (err) {
    console.error("❌ Health check failed:", err.message);
  }
}, {
  timezone: "Asia/Kolkata"
});
