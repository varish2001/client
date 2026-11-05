import assert from "node:assert/strict";
import test from "node:test";
import { normalizeApiBaseUrl } from "../src/lib/api.js";

test("normalizeApiBaseUrl in production defaults to Render backend", () => {
  const result = normalizeApiBaseUrl(undefined, true);
  assert.equal(result, "https://server-5yzz.onrender.com/api");
});

test("normalizeApiBaseUrl in production with empty string defaults to Render backend", () => {
  const result = normalizeApiBaseUrl("", true);
  assert.equal(result, "https://server-5yzz.onrender.com/api");
});

test("normalizeApiBaseUrl in production protects against relative /api", () => {
  const result = normalizeApiBaseUrl("/api", true);
  assert.equal(result, "https://server-5yzz.onrender.com/api");
});

test("normalizeApiBaseUrl with base URL appends /api without duplicates", () => {
  assert.equal(
    normalizeApiBaseUrl("https://server-5yzz.onrender.com", true),
    "https://server-5yzz.onrender.com/api"
  );
  assert.equal(
    normalizeApiBaseUrl("https://server-5yzz.onrender.com/", true),
    "https://server-5yzz.onrender.com/api"
  );
  assert.equal(
    normalizeApiBaseUrl("https://server-5yzz.onrender.com/api", true),
    "https://server-5yzz.onrender.com/api"
  );
  assert.equal(
    normalizeApiBaseUrl("https://server-5yzz.onrender.com/api/", true),
    "https://server-5yzz.onrender.com/api"
  );
});

test("normalizeApiBaseUrl in development defaults to localhost", () => {
  const result = normalizeApiBaseUrl(undefined, false);
  assert.equal(result, "http://localhost:5000/api");
});
