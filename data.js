const quizData = {
  country: "Niederlande",
  flag: "🇳🇱",
  wikiPage: "niederlande.html",
  hints: {
    geografisch: {
      label: "Geografisch",
      icon: "🌍",
      facts: [
        "Große Teile dieses Landes liegen unterhalb des Meerespiegels.",
        "Es grenzt an Deutschland, Belgien und die Nordsee.",
        "Die Hauptstadt heißt Amsterdam, aber die Regierung sitzt in Den Haag."
      ]
    },
    promiwelt: {
      label: "Promiwelt",
      icon: "⭐",
      facts: [
        "Der Maler Rembrandt van Rijn wurde hier geboren.",
        "Die DJs Tiësto und Martin Garrix kommen aus diesem Land.",
        "Fußballlegende Johan Cruyff gilt als größter Sportler dieses Landes."
      ]
    },
    meme: {
      label: "Meme",
      icon: "😂",
      facts: [
        "Dieses Land ist berühmt dafür, dass jeder sein Fahrrad überall hinbringt – auch durch Flüsse.",
        "Die Menschen hier sind weltweit bekannt für ihre direkte, unverblümte Art.",
        "Orangefarbene Fankleidung bei Sportevents ist hier ein nationales Erkennungszeichen."
      ]
    },
    kleidung: {
      label: "Kleidung",
      icon: "👗",
      facts: [
        "Das traditionelle Schuhwerk dieses Landes sind Holzschuhe, genannt Klompen.",
        "Das blau-weiße Delfter Muster ist ein ikonisches nationales Designsymbol.",
        "Bei Nationalfeiertagen tragen die Menschen hier traditionell komplett Orange."
      ]
    }
  }
};

// All sovereign countries in German — used for the autocomplete dropdown.
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
