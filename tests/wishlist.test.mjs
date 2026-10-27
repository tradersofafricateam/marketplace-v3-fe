import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import * as zustand from "zustand";
import * as middleware from "zustand/middleware";
import * as React from "react";
import * as jsx from "react/jsx-runtime";
import * as icons from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

function load(file, mocks, storage) {
  const code = ts.transpileModule(fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const compiled = { exports: {} };
  new Function("require", "module", "exports", "localStorage", code)((name) => {
    assert.ok(name in mocks, `Unexpected dependency: ${name}`);
    return mocks[name];
  }, compiled, compiled.exports, storage);
  return compiled.exports;
}
function storageHarness() {
  const data = new Map();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
}
const store = (storage) => load("src/store/wishlistStore.ts", {
  zustand, "zustand/middleware": middleware,
}, storage).useWishlistStore;

test("local wishlist toggles product IDs in shared state and persists only IDs", async () => {
  const storage = storageHarness();
  const wishlist = store(storage);
  await wishlist.persist.rehydrate();
  let notifications = 0;
  const unsubscribe = wishlist.subscribe(() => notifications++);
  wishlist.getState().toggleProduct("product-a");
  wishlist.getState().toggleProduct("product-b");
  assert.deepEqual(wishlist.getState().savedProductIds, ["product-a", "product-b"]);
  assert.deepEqual(JSON.parse(storage.getItem("tofa-local-wishlist")), {
    state: { savedProductIds: ["product-a", "product-b"] }, version: 1,
  });
  wishlist.getState().toggleProduct("product-a");
  assert.deepEqual(wishlist.getState().savedProductIds, ["product-b"]);
  assert.equal(notifications, 3);
  unsubscribe();
});

test("persisted IDs are restored after explicit hydration without changing the initial server snapshot", async () => {
  const storage = storageHarness();
  const first = store(storage);
  await first.persist.rehydrate();
  first.getState().toggleProduct("saved-on-browser");
  const refreshed = store(storage);
  assert.deepEqual(refreshed.getState().savedProductIds, []);
  assert.equal(refreshed.persist.hasHydrated(), false);
  await refreshed.persist.rehydrate();
  assert.deepEqual(refreshed.getState().savedProductIds, ["saved-on-browser"]);
  assert.deepEqual(refreshed.getInitialState().savedProductIds, []);
});

test("malformed persisted state cannot introduce duplicate/non-string IDs", async () => {
  const storage = storageHarness();
  storage.setItem("tofa-local-wishlist", JSON.stringify({ version: 1, state: { savedProductIds: ["a", "a", 7, null] } }));
  const wishlist = store(storage);
  await wishlist.persist.rehydrate();
  assert.deepEqual(wishlist.getState().savedProductIds, ["a"]);
});

test("blocked browser storage still allows in-memory toggling", async () => {
  const unavailable = () => { throw new Error("Storage unavailable"); };
  const wishlist = store({ getItem: unavailable, setItem: unavailable, removeItem: unavailable });
  await wishlist.persist.rehydrate();
  assert.doesNotThrow(() => wishlist.getState().toggleProduct("a"));
  assert.deepEqual(wishlist.getState().savedProductIds, ["a"]);
  wishlist.getState().toggleProduct("a");
  assert.deepEqual(wishlist.getState().savedProductIds, []);
});

test("wishlist server markup is unsaved even with restored client data, with accessible local-only labels", async () => {
  const storage = storageHarness();
  storage.setItem("tofa-local-wishlist", JSON.stringify({ version: 1, state: { savedProductIds: ["a"] } }));
  const wishlist = store(storage);
  await wishlist.persist.rehydrate();
  const messages = JSON.parse(fs.readFileSync(new URL("../messages/en.json", import.meta.url))).ProductCatalogue;
  const Button = load("src/components/atoms/WishlistButton/WishlistButton.tsx", {
    react: React, "react/jsx-runtime": jsx, "lucide-react": icons,
    "@/store/wishlistStore": { useWishlistStore: wishlist },
    "next-intl": { useTranslations: () => (key, values) => messages[key].replace("{name}", values?.name ?? "") },
  }).default;
  const html = renderToStaticMarkup(React.createElement(Button, { productId: "a", productName: "Bananas" }));
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /aria-label="Save Bananas on this browser"/);
  assert.match(html, /Saved only in this browser, not to your account/);
  assert.doesNotMatch(html, /disabled/);
});
