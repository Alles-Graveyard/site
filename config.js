const dev = process.env.NODE_ENV === "development";

export default {
    apiUrl: `${dev ? "http://localhost" : "https://alles.cx"}/api`,
    dev
};