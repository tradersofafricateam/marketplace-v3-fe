import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

function load(file, mocks = {}) {
  const code = ts.transpileModule(
    fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const compiled = { exports: {} };
  new Function("require", "module", "exports", code)(
    (name) => {
      if (!(name in mocks)) throw new Error(`Unexpected import ${name}`);
      return mocks[name];
    },
    compiled,
    compiled.exports,
  );
  return compiled.exports;
}

function requestInterceptor(token) {
  let fulfilled;
  let defaults;
  const instance = {
    interceptors: {
      request: {
        use(next) {
          fulfilled = next;
        },
      },
    },
  };
  load("src/lib/axiosInstance.ts", {
    axios: {
      default: {
        create: (options) => {
          defaults = options;
          return instance;
        },
      },
    },
    "@/lib/helpers/cookie": { readCookie: () => token },
  });
  return { fulfilled, defaults };
}

test("anonymous API requests omit the Authorization header", () => {
  const headers = { Authorization: "" };
  const config = requestInterceptor(null).fulfilled({ headers });
  assert.equal("Authorization" in config.headers, false);
});

test("authenticated API requests still send the bearer token", () => {
  const config = requestInterceptor("test-token").fulfilled({ headers: {} });
  assert.equal(config.headers.Authorization, "Bearer test-token");
});

test("the API client does not force JSON content type onto GET requests", () => {
  const { defaults } = requestInterceptor(null);
  assert.equal(defaults.headers, undefined);
});

test("public product GETs do not force a CORS preflight", async () => {
  const calls = [];
  const api = load("src/features/products/api/index.ts", {
    "@/lib/axiosInstance": {
      axiosInstance: {
        get: async (...args) => {
          calls.push(args);
          if (args[0] === "/products/") {
            return {
              data: {
                success: true,
                data: [{ id: "p" }],
                pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
              },
            };
          }
          return { data: { success: true, data: { id: "p" } } };
        },
      },
    },
  });

  await api.getPublicProducts({ lang: "en" });
  await api.getPublicProduct("p", "en");

  assert.equal(calls.length, 2);
  for (const [, config] of calls) {
    assert.equal(config.headers, undefined);
  }
});
