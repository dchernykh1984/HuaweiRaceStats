// Localized metric labels: the concise labels the Garmin data field ships, plus
// Kazakh, kept at most 12 characters so they fit a row on the round watch screen.
// Each language is one "|"-separated string in METRICS order (place_abs,
// place_group, gap_prev_abs, ... qty_next_pack_abs): the page bundle is compiled
// in a 48 KB JerryScript heap, where one string per language costs far less than
// an object of 19 separate strings. This file legitimately holds non-ASCII text
// and is excluded from the ASCII guard.
//
// To add a language: add its string with a label for every metric (the
// locale-completeness unit test fails otherwise) and it becomes available.
// To add a metric: append its label to every string, in METRICS order.
export const LABELS = {
  en: "Place abs|Place gr|Gap ahd abs|Gap bhd abs|Gap ldr abs|Dynam ah abs|Dynam bh abs|Dynam ld abs|Gap ahd gr|Gap bhd gr|Gap ldr gr|Dynam ah gr|Dynam bh gr|Dynam ld gr|Laps|Gap ahd pack|Gap bhd pack|Size ahd pk|Size bhd pk",
  ru: "Место абс|Место гр|Отрыв вп абс|Отрыв сз абс|Отрыв лд абс|Динам вп абс|Динам сз абс|Динам лд абс|Отрыв вп гр|Отрыв сз гр|Отрыв лд гр|Динам вп гр|Динам сз гр|Динам лд гр|Круги|Отрыв вп пач|Отрыв сз пач|Число вп пач|Число сз пач",
  de: "Platz abs|Platz gr|Abst ah abs|Abst bh abs|Abst ld abs|Dynam ah abs|Dynam bh abs|Dynam ld abs|Abst ah gr|Abst bh gr|Abst ld gr|Dynam ah gr|Dynam bh gr|Dynam ld gr|Runden|Abst v Pulk|Abst h Pulk|Zahl v Pulk|Zahl h Pulk",
  fr: "Place abs|Place gr|Écart ah abs|Écart bh abs|Écart ld abs|Dynam ah abs|Dynam bh abs|Dynam ld abs|Écart ah gr|Écart bh gr|Écart ld gr|Dynam ah gr|Dynam bh gr|Dynam ld gr|Tours|Écart av pq|Écart ar pq|Nb av pq|Nb ar pq",
  it: "Posiz abs|Posiz gr|Dist ah abs|Dist bh abs|Dist ld abs|Dynam ah abs|Dynam bh abs|Dynam ld abs|Dist ah gr|Dist bh gr|Dist ld gr|Dynam ah gr|Dynam bh gr|Dynam ld gr|Giri|Dist ant pk|Dist post pk|Num ant pk|Num post pk",
  es: "Puesto abs|Puesto gr|Difer ah abs|Difer bh abs|Difer ld abs|Dynam ah abs|Dynam bh abs|Dynam ld abs|Difer ah gr|Difer bh gr|Difer ld gr|Dynam ah gr|Dynam bh gr|Dynam ld gr|Vueltas|Dif del paq|Dif det paq|Num del paq|Num det paq",
  pt: "Posição abs|Posição gr|Difer ah abs|Difer bh abs|Difer ld abs|Dynam ah abs|Dynam bh abs|Dynam ld abs|Difer ah gr|Difer bh gr|Difer ld gr|Dynam ah gr|Dynam bh gr|Dynam ld gr|Voltas|Dif fr bl|Dif trás bl|Tam fr bl|Tam trás bl",
  nl: "Plaats abs|Plaats gr|Gat ah abs|Gat bh abs|Gat ld abs|Dynam ah abs|Dynam bh abs|Dynam ld abs|Gat ah gr|Gat bh gr|Gat ld gr|Dynam ah gr|Dynam bh gr|Dynam ld gr|Ronden|Gat voor pk|Gat acht pk|Aantal v pk|Aantal a pk",
  pl: "Miejsce abs|Miejsce gr|Dyst ah abs|Dyst bh abs|Dyst ld abs|Dynam ah abs|Dynam bh abs|Dynam ld abs|Dyst ah gr|Dyst bh gr|Dyst ld gr|Dynam ah gr|Dynam bh gr|Dynam ld gr|Okrążenia|Odst prz pak|Odst tył pak|Licz prz pak|Licz tył pak",
  cs: "Pozice abs|Pozice gr|Rozd ah abs|Rozd bh abs|Rozd ld abs|Dynam ah abs|Dynam bh abs|Dynam ld abs|Rozd ah gr|Rozd bh gr|Rozd ld gr|Dynam ah gr|Dynam bh gr|Dynam ld gr|Kola|Odst vpř bal|Odst vz bal|Poč vpř bal|Poč vzad bal",
  kk: "Орын абс|Орын тп|Айыр ал абс|Айыр ар абс|Айыр лд абс|Динам ал абс|Динам ар абс|Динам лд абс|Айыр ал тп|Айыр ар тп|Айыр лд тп|Динам ал тп|Динам ар тп|Динам лд тп|Айналым|Айыр ал лек|Айыр ар лек|Саны ал лек|Саны ар лек",
};
