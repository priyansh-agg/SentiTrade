const parseOrigins = () => {
  const raw = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";

  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const getAllowedOrigins = () => {
  const origins = parseOrigins();

  if (process.env.NODE_ENV !== "production") {
    return Array.from(new Set([...origins, "http://localhost:5173", "http://127.0.0.1:5173"]));
  }

  return origins;
};

const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

module.exports = { corsOptions, getAllowedOrigins };
