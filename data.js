const quizData = {
  country: "Japan",
  facts: [
    "Dieses Land besteht aus über 6.800 Inseln.",
    "Die pünktlichsten Züge der Welt fahren hier.",
    "Die Hauptstadt ist Tokio."
  ]
};

// All sovereign countries in German — used for the autocomplete dropdown.
// Extend this list when adding new quiz countries so the answer is always findable.
const countries = [
  "Afghanistan", "Ägypten", "Albanien", "Algerien", "Andorra", "Angola",
  "Antigua und Barbuda", "Äquatorialguinea", "Argentinien", "Armenien",
  "Aserbaidschan", "Äthiopien", "Australien", "Bahamas", "Bahrain",
  "Bangladesch", "Barbados", "Belarus", "Belgien", "Belize", "Benin",
  "Bhutan", "Bolivien", "Bosnien und Herzegowina", "Botswana", "Brasilien",
  "Brunei", "Bulgarien", "Burkina Faso", "Burundi", "Chile", "China",
  "Costa Rica", "Dänemark", "Deutschland", "Demokratische Republik Kongo",
  "Dominica", "Dominikanische Republik", "Dschibuti", "Ecuador", "El Salvador",
  "Elfenbeinküste", "Eritrea", "Estland", "Eswatini", "Fidschi", "Finnland",
  "Frankreich", "Gabun", "Gambia", "Georgien", "Ghana", "Grenada",
  "Griechenland", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
  "Honduras", "Indien", "Indonesien", "Irak", "Iran", "Irland", "Island",
  "Israel", "Italien", "Jamaika", "Japan", "Jemen", "Jordanien",
  "Kambodscha", "Kamerun", "Kanada", "Kap Verde", "Kasachstan", "Katar",
  "Kenia", "Kirgisistan", "Kiribati", "Kolumbien", "Komoren", "Kongo",
  "Kosovo", "Kroatien", "Kuba", "Kuwait", "Laos", "Lesotho", "Lettland",
  "Libanon", "Liberia", "Libyen", "Liechtenstein", "Litauen", "Luxemburg",
  "Madagaskar", "Malawi", "Malaysia", "Malediven", "Mali", "Malta",
  "Marokko", "Marshallinseln", "Mauretanien", "Mauritius", "Mexiko",
  "Mikronesien", "Moldau", "Monaco", "Mongolei", "Montenegro", "Mosambik",
  "Myanmar", "Namibia", "Nauru", "Nepal", "Neuseeland", "Nicaragua",
  "Niederlande", "Niger", "Nigeria", "Nordkorea", "Nordmazedonien", "Norwegen",
  "Oman", "Österreich", "Pakistan", "Palau", "Panama", "Papua-Neuguinea",
  "Paraguay", "Peru", "Philippinen", "Polen", "Portugal", "Ruanda",
  "Rumänien", "Russland", "Salomonen", "Sambia", "Samoa", "San Marino",
  "São Tomé und Príncipe", "Saudi-Arabien", "Schweden", "Schweiz", "Senegal",
  "Serbien", "Seychellen", "Sierra Leone", "Simbabwe", "Singapur",
  "Slowakei", "Slowenien", "Somalia", "Spanien", "Sri Lanka",
  "St. Kitts und Nevis", "St. Lucia", "St. Vincent und die Grenadinen",
  "Sudan", "Südafrika", "Südkorea", "Südsudan", "Suriname", "Syrien",
  "Tadschikistan", "Tansania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad und Tobago", "Tschad", "Tschechien", "Tunesien", "Türkei",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "Ungarn", "Uruguay",
  "Usbekistan", "Vanuatu", "Vatikanstadt", "Venezuela",
  "Vereinigte Arabische Emirate", "Vereinigte Staaten", "Vietnam",
  "Zentralafrikanische Republik", "Zypern"
];
