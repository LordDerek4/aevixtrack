export function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL);
}
