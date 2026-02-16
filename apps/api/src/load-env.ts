/**
 * Load root .env before any config is read (monorepo: api runs from apps/api, root is ../../)
 */
import { config } from "dotenv";
import path from "path";

const rootEnv = path.resolve(process.cwd(), "../../.env");
config({ path: rootEnv });
