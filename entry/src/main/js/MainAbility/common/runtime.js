// HarmonyOS Lite implements ES5; keep the shared numeric checks available.
if (!Number.isFinite)
  Number.isFinite = function (value) {
    return typeof value === "number" && isFinite(value);
  };
if (!Number.isInteger)
  Number.isInteger = function (value) {
    return Number.isFinite(value) && Math.floor(value) === value;
  };
if (!Number.isSafeInteger)
  Number.isSafeInteger = function (value) {
    return Number.isInteger(value) && Math.abs(value) <= 9007199254740991;
  };
if (!Number.isNaN)
  Number.isNaN = function (value) {
    return value !== value;
  };
