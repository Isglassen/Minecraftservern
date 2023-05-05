# OtiriaVoting

OtiriaVoting är en discord bot som håller i Otirias röstningar. På denna sidan kommer jag beskriva hur den fungerar i detalj. Du kan hitta källkoden [här](https://github.com/Isglassen/OtiriaVoting)

[Här](https://discord.com/api/oauth2/authorize?client_id=1090992070325452868&permissions=309237827648&scope=applications.commands%20bot) kan du bjuda in botten till en server

## Interface

Denna sektionen kommer gå igenom hur det går till att använda boten

### Skapande

För att skapa en röstning är steg 1 alltid att använda `/skapa-röstning` (`/create-vote`), alla kommandon relaterade till att skapa en röstning är vanligtviss låste bakom **Manage Roles** i discord, men det går att ställa in andra regler för olika roller i **Serverinställningar** > **Integrationer**

Detta kommer lägga till röstningen i databasen och skicka ett statusmeddelande i kanalen du använde det. Kanalen borde vara privat då alla som kan se meddelandet kan starta röstningen. Det är viktigt att detta inte tas bort, eftersom röstningar inte kan startas utan meddelandet, och boten kan inte skapa ett nytt.

`/skapa-röstning` har följande parametrar:

| Alternativ        | Engelskt namn   | Beskrivning                                 | Typ           | Standardvärde |
| ----------------- | --------------- | ------------------------------------------- | ------------- | :-----------: |
| `namn`            | `name`          | Det namn röstningen ska ha                  | Text, max 64  |               |
| `beskrivning`     | `description`   | Den beskrivning röstningen ska ha           | Text, max 512 |               |
| `röstnings-kanal` | `vote-channel`  | Den kanal som röstningen ska hållas i       | Textkanal     |               |
| `rösträtt`        | `voting-rights` | Den roll som krävs för att rösta            | Roll          |  `@everyone`  |
| `ping`            | `ping`          | Den roll som omnämns när röstningen startar | Roll          |    *Ingen*    |
| `live-resultat`   | `live-result`   | Ifall resultaten ska synas under röstningen | Boolean       |    `False`    |
| `start-tid`       | `start-time`    | Den timestamp som röstningen ska starta     | Heltal        |    *Ingen*    |
| `slut-tid`        | `end-time`      | Den timestamp som röstningen ska sluta      | Heltal        |    *Ingen*    |

Om det inte finns ett standardvärde anget så måste ett värde anges

### Automatiska start & slut

Automatiska start/slut tider ska anges som en unix timestamp i sekunder, som går att generera för ett datum på t.ex. [unixtimestamp.com](https://www.unixtimestamp.com) eller [epochconverter.com](https://epochconverter.com)

Boten kommer automatiskt starta eller avsluta röstningen ca. varje 30 sekunder, och borde kolla sekund 0 och 30 i varje minut vid optimala omständigheter. Om en röstning är inställd till att sluta eller börja tidigare än nuvarande tiden när boten kollar kommer den automatiskt låtsas trycka på knappen åt dig. Om du t.ex. inte har tillräckligt många alternativ kommer boten inte starta röstningen eftersom det inte går.

Om boten varit av kommer den vänta 10 minuter innan den börjar kolla dessa. Detta är så att man kan ändra tiderna ifall man ändrat sig medans boten var nere, specielt ifall man vill förlänga deadlinen på grund av botens inaktivitet

### Röstnings id

Boten skiljer på röstningar med hjälp av två saker: serverns discord id och röstningens id.
Röstningens id är egentligen bara den tid då röstningen skapades.

Som alternativ till kommandon finns det 3 sätt att ange id:t:

- `{server-id}.{röstnings-id}`. Detta är det egentligen korrekta formatet.
- `{röstnings-id}`. Om du skriver in bara `röstnings-id`:t kommer autokorrekt förstå det och ge dig röstningar med id:n som börjar så
- Ett av autokorrekt alternativen, som har formatet `{namn}: {tid skapad} ({sista 3 siffrorna i id:t})`.
  - Du kan inte skriva in detta själv, utan måste använda autokorrekten eftersom discord konverterar detta till det första formated i hemlighet

### Ändra parametrarna

Alla dessa parametrarna kan ändras så länge röstningen inte startat genom att använda följande kommandon.

| Alternativ        | Svenskt namn          | Engelskt namn           |
| ----------------- | --------------------- | ----------------------- |
| `namn`            | `/ändra-namn`         | `/change-name`          |
| `beskrivning`     | `/ändra-beskrivning`  | `/change-description`   |
| `röstnings-kanal` | `/ändra-kanal`        | `/change-channel`       |
| `rösträtt`        | `/ändra-rösträtt`     | `/change-voting-rights` |
| `ping`            | `/ändra-ping`         | `/change-ping`          |
| `live-resultat`   | `/sätt-live-resultat` | `/set-live-result`      |
| `start-tid`       | `/ändra-start`        | `/change-start`         |
| `slut-tid`        | `/ändra-slut`         | `/change-end`           |

De har alla två alternativ:

- `röstnings-id` (`vote-id`)
  - Röstningens id
- Ett alternativ som har samma begränsningar som respektive alternativ till `/skapa-röstning`
  - `rösträtt` och `live-resultat` går dock inte att lämna tomma

### Alternativ

En röstning går inte att starta utan minst 2 alternativ, så nu ska jag gå igenom hur man ändrar alternativen.

`/lägg-till-alternativ` (`/add-choice`) lägger till ett alternativ till röstningen.

Det första alternativet till detta kommandot är `röstnings-id`, precis som ovan.

Därefter krävs ett `alternativ-namn` (`choice-name`) på max 32 tecken, och en `alternativ-beskrivning` (`choice-description`) på max 256 tecken.
Namnet måste också vara unikt för röstningen, och en röstning kan som högst ha 25 alternativ

Om du gjort fel när du laggt till ett alternativ och behöver ändra det måste du tra bort det och sen skapa det på nytt.

`/ta-bort-alternativ` (`/remove-choice`) tar bort ett alternativ från en röstning. Det behöver `röstnings-id`:t och `alternativ-namn`et.
Om du skriver in `röstnings-id` innan `alternativ-namn` så kommer du även få autokorrekt för namnet.

### Andra kommandon

För att se hur röstningen ska se ut innan du startar den kan du använda `/förhandsgranska` (`/preview`).
Detta kommandot fungerar även ifall röstningen egentligen inte ska kunna starta, så som att du har för få alternativ

När en röstning är avslutat kan vem som helst få ett ephemeral meddelande med röstningens resultat genom att använda `/få-resultat` (`få-resultat`) med `röstnings-id`:t.
Detta gör det enklare att verifiera hur en röstning gick ifall orginal meddelandet har försvunnit.

### Styra röstningar

När du är redo för att starta röstningen kan du trycka på *Starta röstning* knappen under statusmeddelandet och boten kommer då skicka en röstning i rätt kanal. Alla med rätt roll kan då använda menyn på det meddelandet för att välja ett alternativ. Det går att ändra sig så länge röstningen fortfarande pågår.

För att avsluta röstningen kan du trycka på *Avsluta röstning* knappan under statusmeddelandet och boten kommer då svara på röstningens meddelande utan ping om att röstningen är avslutat, samt ändra röstningens meddelande för att reflektera detta.

## Behind the scenes

Så hur fungerar allt detta egentligen?

Det kommer snart, för jag orkar inte skriva mer idag

TODO
