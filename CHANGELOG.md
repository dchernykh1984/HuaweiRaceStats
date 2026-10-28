# Changelog

## [1.1.0](https://github.com/dchernykh1984/HuaweiRaceStats/compare/huawei-race-stats-v1.0.0...huawei-race-stats-v1.1.0) (2026-10-28)


### Features

* **i18n:** translate the watch settings screens into every supported language ([43bb577](https://github.com/dchernykh1984/HuaweiRaceStats/commit/43bb5775dc8f20792efcdc70ab083bd3de334a64))


### Bug Fixes

* **app:** open settings on a long press so a stray tap keeps polling ([37fabf8](https://github.com/dchernykh1984/HuaweiRaceStats/commit/37fabf851203e360fea7fe21afb6e4ad259b2a74))
* **app:** step back on a right swipe because Lite pages get no back event ([6ec9e5d](https://github.com/dchernykh1984/HuaweiRaceStats/commit/6ec9e5db93c043185a520e504458240db47fb384))
* **editor:** drop URL keys that site validation always rejects ([d9db6f9](https://github.com/dchernykh1984/HuaweiRaceStats/commit/d9db6f90d918411022e6ae610464a55766443022))
* **editor:** show the end of a long value where typing happens ([63910bf](https://github.com/dchernykh1984/HuaweiRaceStats/commit/63910bf9bf7c04a2288e34a921cb371e2ac563de))
* **i18n:** detect the watch language without String.replace, which Lite lacks ([a6bba6e](https://github.com/dchernykh1984/HuaweiRaceStats/commit/a6bba6e4c88442b235391c10873ca031c72b35a5))
* **settings:** keep the site and bib rows on one line instead of wrapping ([d349936](https://github.com/dchernykh1984/HuaweiRaceStats/commit/d3499366016d08c5a44b45b8c67d0b9310c84351))
* **settings:** offer only as many fields as the screen shape draws ([981e044](https://github.com/dchernykh1984/HuaweiRaceStats/commit/981e0445025ff8ec0924199a608d9ae41fe7ee38))
* **settings:** store each setting under its own key within the Lite storage limit ([8c52c8d](https://github.com/dchernykh1984/HuaweiRaceStats/commit/8c52c8df9978b53fd0ac715163bca4fee34210c7))


### Performance Improvements

* **i18n:** pack metric labels into one string per language for the 48 KB compile heap ([c2b8749](https://github.com/dchernykh1984/HuaweiRaceStats/commit/c2b874966e206609260160aa91605f35ffd93ab5))

## 1.0.0 (2026-10-27)


### Features

* add Huawei Lite Wearable race stats app ([1a61462](https://github.com/dchernykh1984/HuaweiRaceStats/commit/1a61462de0e007f97e875f70475191dfe8dd9a12))
