import "../../common/runtime.js";
import app from "@system.app";
import device from "@system.device";
import { loadConfig, saveConfig, requestStats } from "../../common/platform.js";
import { defaultConfig, configError, sameRider } from "../../common/lib/config.js";
import { createPoller } from "../../common/lib/polling.js";
import { dashboardBands, screenFor } from "../../common/lib/dashboard.js";
import { editorKeys, appendKey, visibleTail, settingLine } from "../../common/lib/editor.js";
import { METRICS } from "../../common/lib/metrics.js";
import { maxFields } from "../../common/lib/layout.js";
import { resolveRowMetrics } from "../../common/lib/settings.js";
import { resolveLanguage, labelFor, uiTexts } from "../../common/lib/i18n/index.js";

const EDIT_TITLES = { siteUrl: "siteUrl", competitionId: "raceId", bib: "bibNumber" };

export default {
  data: {
    screen: "stats",
    bands: [],
    config: defaultConfig(),
    rowChoices: [],
    metricChoices: [],
    language: "en",
    ui: uiTexts("en"),
    height: 466,
    editTitle: "",
    editValue: "",
    editText: "",
    raceLine: "",
    bibLine: "",
    siteLine: "",
    keyRows: [],
    error: "",
    saving: false,
  },

  onInit() {
    this._alive = true;
    this._visible = true;
    this._stats = null;
    this._device = screenFor(null);
    this.updateDashboard();
    device.getInfo({
      success: (info) => {
        if (!this._alive) return;
        this._device = screenFor(info);
        this.height = this._device.height;
        this.language = resolveLanguage(info.language);
        this.ui = uiTexts(this.language);
        this.updateDashboard();
      },
    });
    loadConfig((config) => {
      if (!this._alive) return;
      this.config = config;
      this.configurePoller();
    });
  },

  onShow() {
    this._visible = true;
    if (this._poller && this.screen === "stats") this._poller.start();
  },

  onHide() {
    this._visible = false;
    if (this._poller) this._poller.stop();
  },

  onDestroy() {
    this._alive = false;
    if (this._poller) this._poller.stop();
  },

  // Lite pages receive no back event, so a right swipe steps back and leaves the
  // app from the results, as Huawei watch apps do.
  swipeBack(event) {
    if (!event || event.direction !== "right") return;
    if (this.screen === "stats") app.terminate();
    else if (this.saving) return;
    else if (this.screen === "settings") this.cancelSettings();
    else this.screen = "settings";
  },

  configurePoller(keepStats = false) {
    if (this._poller) this._poller.stop();
    if (!keepStats) this._stats = null;
    this._poller = createPoller(
      this.config,
      requestStats,
      (stats) => {
        if (!this._alive) return;
        this._stats = stats;
        this.updateDashboard();
      },
      this._stats
    );
    this.updateDashboard();
    if (this._visible && this.screen === "stats") this._poller.start();
  },

  updateDashboard() {
    this.bands = dashboardBands(
      resolveRowMetrics(this.config),
      this._stats,
      this.language,
      this._device
    );
  },

  openSettings() {
    if (!this._poller) return;
    this._poller.stop();
    this._saved = JSON.stringify(this.config);
    this.config = JSON.parse(this._saved);
    this.error = "";
    this.updateRows();
    this.screen = "settings";
  },

  updateRows() {
    this.raceLine = settingLine(this.ui.race, this.config.competitionId);
    this.bibLine = settingLine(this.ui.bib, this.config.bib);
    this.siteLine = settingLine(this.ui.site, this.config.siteUrl);
    this.rowChoices = resolveRowMetrics(this.config).map((metric, index) => ({
      index,
      label: this.ui.field + " " + (index + 1) + ": " + labelFor(this.language, metric),
    }));
  },

  changeCount(delta) {
    if (this.saving) return;
    const limit = maxFields(this._device.round);
    const count = Math.max(1, Math.min(limit, Number(this.config.rowCount) + Number(delta)));
    this.config.rowCount = String(count);
    this.updateRows();
  },

  edit(field) {
    if (this.saving) return;
    this._field = field;
    this.editTitle = this.ui[EDIT_TITLES[field]];
    this.setEdit(this.config[field]);
    const keys = editorKeys(field);
    const rows = [];
    for (let i = 0; i < keys.length; i += 6) rows.push({ keys: keys.slice(i, i + 6) });
    this.keyRows = rows;
    this.screen = "edit";
  },

  setEdit(value) {
    this.editValue = value;
    this.editText = visibleTail(value);
  },
  typeKey(key) {
    this.setEdit(appendKey(this.editValue, key, this._field));
  },
  erase() {
    this.setEdit(this.editValue.slice(0, -1));
  },
  clear() {
    this.setEdit("");
  },
  acceptEdit() {
    this.config[this._field] = this.editValue;
    this.updateRows();
    this.screen = "settings";
  },
  backToSettings() {
    this.screen = "settings";
  },

  chooseRow(index) {
    if (this.saving) return;
    this._editingRow = index;
    this.metricChoices = METRICS.map((metric, index) => ({
      index,
      label: labelFor(this.language, metric),
    }));
    this.screen = "metrics";
  },

  chooseMetric(index) {
    this.config["rowMetric" + this._editingRow] = String(index);
    this.updateRows();
    this.screen = "settings";
  },

  cancelSettings() {
    if (this.saving) return;
    this.config = JSON.parse(this._saved);
    this.screen = "stats";
    this.updateDashboard();
    if (this._visible) this._poller.start();
  },

  applySettings() {
    if (this.saving) return;
    const error = configError(this.config);
    this.error = error ? this.ui[error] : "";
    if (error) return;
    this.saving = true;
    saveConfig(this.config, (saved) => {
      if (!this._alive) return;
      this.saving = false;
      if (!saved) {
        this.error = this.ui.saveFailed;
        return;
      }
      this.screen = "stats";
      this.configurePoller(sameRider(JSON.parse(this._saved), this.config));
    });
  },
};
