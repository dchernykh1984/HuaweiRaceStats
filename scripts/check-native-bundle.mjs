import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { labelFor, uiTexts } from "../lib/i18n/index.js";

const UI = { ru: uiTexts("ru") };

const source = readFileSync(
  "entry/build/default/intermediates/loader_out_lite/default/js/MainAbility/pages/index/index.js",
  "utf8"
);
let page;
const persisted = {};
let writable = true;
let requests = 0;
let terminated = 0;
let holdReplies = false;
let heldReply = null;
const context = {
  console,
  _c(type, properties = {}, children = []) {
    const value = properties.attrs && properties.attrs.value;
    const events = Object.keys(properties.onBubbleEvents || {});
    return { type, value: typeof value === "function" ? value() : value, events, children };
  },
  _i(condition, render) {
    return condition() ? render() : null;
  },
  _l(source, render) {
    return source().map(render);
  },
  setTimeout: () => 1,
  clearTimeout() {},
  requireNative(name) {
    if (name === "system.app") return { terminate: () => terminated++ };
    if (name === "system.device")
      return {
        getInfo: ({ success }) =>
          success({ windowWidth: 466, windowHeight: 466, screenShape: "circle", language: "ru" }),
      };
    if (name === "system.storage")
      return {
        get: ({ key, success }) => success(key in persisted ? persisted[key] : ""),
        // Lite storage limits: keys up to 32 characters, values under 128 bytes.
        set: ({ key, value, success, fail }) => {
          if (!writable || key.length > 32 || Buffer.byteLength(value) >= 128) {
            fail();
            return;
          }
          persisted[key] = value;
          success();
        },
      };
    if (name === "system.fetch")
      return {
        fetch: ({ success }) => {
          requests++;
          const reply = () =>
            success({
              code: 200,
              data: { stats: { place_abs: "17", qty_abs: "84", future: "ignored" } },
            });
          if (holdReplies) heldReply = reply;
          else reply();
        },
      };
    throw new Error("Unexpected native module: " + name);
  },
  ViewModel: function (options) {
    Object.assign(this, options, JSON.parse(JSON.stringify(options.data)));
    page = this;
  },
};

// Exercise the actual SDK bundle with ES5 numeric builtins and no Node require.
runInNewContext(
  "Number.isFinite = undefined; Number.isInteger = undefined; Number.isSafeInteger = undefined; Number.isNaN = undefined;",
  context
);
runInNewContext(source, context);
page.onInit();
assert.equal(page.screen, "stats");
assert.equal(page.bands[0].cells[0].value, "17/84");
assert.equal(requests, 1);
assert.match(JSON.stringify(page.render()), /17\/84/);
// A stray tap must not leave the results: settings open on a long press.
assert.deepEqual(page.render().children[0].events, ["longpress", "swipe"]);
page.openSettings();
assert.match(JSON.stringify(page.render()), new RegExp(UI.ru.title));
assert.equal(page.rowChoices[0].label, UI.ru.field + " 1: " + labelFor("ru", "place_abs"));
for (let i = 0; i < 10; i++) page.changeCount(1);
// The round watch draws at most 9 fields, so settings offer no 10th.
assert.equal(page.config.rowCount, "9");
assert.equal(page.rowChoices.length, 9);
for (let i = 0; i < 4; i++) page.changeCount(-1);
page.chooseRow(0);
page.chooseMetric(15);
assert.equal(page.config.rowMetric0, "15");
page.edit("siteUrl");
page.typeKey("/");
assert.equal(page.editText, "...niversalbicycle.team/");
page.backToSettings();
page.edit("competitionId");
assert.match(JSON.stringify(page.render()), new RegExp(UI.ru.raceId));
page.clear();
page.typeKey("5");
page.typeKey("3");
page.typeKey("3");
page.acceptEdit();
writable = false;
page.applySettings();
assert.equal(page.screen, "settings");
assert.equal(page.error, UI.ru.saveFailed);
writable = true;
holdReplies = true;
page.applySettings();
assert.equal(persisted.competitionId, "533");
assert.equal(persisted.rowMetric0, "15");
assert.equal(page.screen, "stats");
// A different race starts empty instead of showing the previous rider's standing.
assert.equal(page._stats, null);
heldReply();
assert.equal(page._stats.place_abs, "17");
page.openSettings();
page.changeCount(1);
page.applySettings();
// Changing only the fields keeps the standing while the next reply is pending.
assert.equal(page._stats.place_abs, "17");
holdReplies = false;
heldReply();
page.openSettings();
page.edit("bib");
page.swipeBack({ direction: "left" });
assert.equal(page.screen, "edit");
page.swipeBack({ direction: "right" });
assert.equal(page.screen, "settings");
page.swipeBack({ direction: "right" });
assert.equal(page.screen, "stats");
page.swipeBack({ direction: "right" });
assert.equal(terminated, 1);
page.onHide();
const hiddenRequests = requests;
page._poller.refresh();
assert.equal(requests, hiddenRequests);
page.onShow();
assert.equal(requests, hiddenRequests + 1);
page.onDestroy();
console.log(
  "Compiled Huawei bundle: imports, dashboard, keyboard, settings persistence, swipe back and page lifecycle passed."
);
