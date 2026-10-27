// Localized words of the on-watch settings screens for the same languages as
// LABELS. Each language is one "|"-separated string in UI_KEYS order: the page
// bundle is compiled in a 48 KB JerryScript heap, and one string per language
// costs far less there than an object of separate strings. Budgets (checked by
// the unit tests) keep the words on the 360 px menu rows. This file
// legitimately holds non-ASCII text.
export const UI_KEYS = [
  "title",
  "race",
  "bib",
  "site",
  "fields",
  "field",
  "save",
  "saving",
  "cancel",
  "erase",
  "clear",
  "done",
  "back",
  "metric",
  "siteUrl",
  "raceId",
  "bibNumber",
  "badSite",
  "badRace",
  "badBib",
  "saveFailed",
];

export const UI = {
  en: "Race settings|Race|Bib|Site|Fields|Field|Save|Saving...|Cancel|Delete|Clear|Done|Back|Choose metric|Site URL|Race ID|Bib number|Use an http(s):// site URL|Invalid race ID|Enter a bib number|Could not save. Please retry.",
  ru: "Настройки гонки|Гонка|Номер|Сайт|Поля|Поле|Сохранить|Сохранение...|Отмена|Стереть|Очистить|Готово|Назад|Выбор показателя|Адрес сайта|ID гонки|Стартовый номер|Нужен адрес http(s)://|Неверный ID гонки|Введите номер|Не сохранено. Повторите.",
  de: "Renneinstellungen|Rennen|Startnr.|Website|Felder|Feld|Speichern|Speichern...|Abbrechen|Löschen|Leeren|Fertig|Zurück|Messwert wählen|Website-URL|Renn-ID|Startnummer|URL mit http(s):// angeben|Ungültige Renn-ID|Startnummer eingeben|Speichern fehlgeschlagen",
  fr: "Réglages course|Course|Dossard|Site|Champs|Champ|Enregistrer|Enregistrement...|Annuler|Effacer|Vider|OK|Retour|Choisir la donnée|URL du site|ID de course|Numéro de dossard|URL http(s):// requise|ID de course invalide|Saisir le dossard|Échec de l'enregistrement",
  it: "Impostazioni gara|Gara|Pettorale|Sito|Campi|Campo|Salva|Salvataggio...|Annulla|Cancella|Svuota|Fatto|Indietro|Scegli metrica|URL del sito|ID gara|Numero pettorale|Serve un URL http(s)://|ID gara non valido|Inserisci il pettorale|Salvataggio non riuscito",
  es: "Ajustes de carrera|Carrera|Dorsal|Sitio|Campos|Campo|Guardar|Guardando...|Cancelar|Borrar|Vaciar|Listo|Atrás|Elegir métrica|URL del sitio|ID de carrera|Número de dorsal|Use una URL http(s)://|ID de carrera no válido|Introduce el dorsal|No se pudo guardar",
  pt: "Ajustes da corrida|Corrida|Dorsal|Site|Campos|Campo|Guardar|A guardar...|Cancelar|Apagar|Limpar|Concluir|Voltar|Escolher métrica|URL do site|ID da corrida|Número do dorsal|Use um URL http(s)://|ID da corrida inválido|Introduza o dorsal|Não foi possível guardar",
  nl: "Wedstrijdinstellingen|Wedstrijd|Rugnr.|Site|Velden|Veld|Opslaan|Opslaan...|Annuleren|Wissen|Leegmaken|Klaar|Terug|Kies meetwaarde|Site-URL|Wedstrijd-ID|Rugnummer|Gebruik een http(s)://-URL|Ongeldig wedstrijd-ID|Vul het rugnummer in|Opslaan mislukt",
  pl: "Ustawienia wyścigu|Wyścig|Numer|Strona|Pola|Pole|Zapisz|Zapisywanie...|Anuluj|Usuń|Wyczyść|Gotowe|Wstecz|Wybierz metrykę|Adres strony|ID wyścigu|Numer startowy|Podaj adres http(s)://|Nieprawidłowe ID wyścigu|Podaj numer startowy|Nie udało się zapisać",
  cs: "Nastavení závodu|Závod|Číslo|Web|Pole|Pole|Uložit|Ukládání...|Zrušit|Smazat|Vymazat vše|Hotovo|Zpět|Vyberte údaj|Adresa webu|ID závodu|Startovní číslo|Zadejte adresu http(s)://|Neplatné ID závodu|Zadejte startovní číslo|Uložení se nezdařilo",
  kk: "Жарыс баптаулары|Жарыс|Нөмір|Сайт|Өрістер|Өріс|Сақтау|Сақталуда...|Болдырмау|Өшіру|Тазалау|Дайын|Артқа|Көрсеткішті таңдау|Сайт мекенжайы|Жарыс ID|Старт нөмірі|http(s):// мекенжайы керек|Жарыс ID қате|Нөмірді енгізіңіз|Сақтау сәтсіз аяқталды",
};
