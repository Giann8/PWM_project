# Progetto tecnologie e linguaggi web

## Documentazione

Il progetto è una web app per la gestione di carte collezionabili ([maghi](https://hp-api.onrender.com/)), realizzata con Node.js, Express, MongoDB e frontend in HTML/JS/Bootstrap.

### Requisiti

- [Docker e Docker-Compose](https://docs.docker.com/get-started/) installati;
- [Node.js](https://nodejs.org/en/download) (per l'avvio senza Docker);
- [MongoDB](https://www.mongodb.com/docs/manual/installation/) (per l'avvio senza Docker);
- Connessione wifi (anche se con hosting locale) per poter effettuare il collegamento all'apposita API e a bootstrap.

### Avvio con Docker

1. scaricare il file

2. Eseguire i seguenti comandi nel terminale:
3. ``` cd <nome-directory> && docker-compose up --build ``` o semplicemente ```docker-compose up --build``` se già all'interno della directory, per avviare in background utilizzare ```docker-compose up -d --build```, eventuali log possono essere visualizzati successivamente attraverso i comandi presenti nell'apposita [Documentazione](https://docs.docker.com/reference/cli/docker/container/)

4. L'applicazione sarà disponibile su [http://localhost:3000](http://localhost:3000).



### Funzionalità implementate

- **Registrazione/Login**
- **Gestione carte**: visualizzazione, vendita, scambio carte maghi
- **Pacchetti**: acquisto, apertura e gestione pacchetti di carte
- **Profilo utente**: modifica dati, cambio password/email/username, scelta del mago preferito
- **Mercato**: offerte di scambio tra utenti

---

## Esempi di funzionamento

1. Login e registrazione:
    ![Schermata_home_unlogged](./Images/Screenshot%202025-06-05%20alle%2010.35.41.png)

    ![Schermata_login](./Images/login.png)

    ![Schermata_SignIn](./Images/SignIn.png)

    ![User_page_logged](./Images/User_page.png)

2. Shop(monete e pacchetti):
    ![Shop_logged](./Images/Shop_logged.png)

    ![Acquisto_logged](./Images/Acquisto_monete_e_pacchetti.png)
	    Se non loggati si viene reindirizzati alla pagina di login in ambo i casi.

    ![Pacchetti_acquistati](./Images/Bought_package.png)
    I pacchetti acquistati sono disponibili all'apertura in una pagina dedicata, si possono aprire singolarmente o tutti insieme.

3. Scambio carte:
    ![Scambio_carte_unlogged](./Images/ExChange_unlogged.png)
    Gli scambi presenti non possono essere effettuati se sloggati.

    ![Scambio_carte_logged](./Images/ExChange_logged.png)
      Eventuali scambi possono essere creati ed eliminati, non si possono accettare i propri scambi.

    ![Creatore_scambi](./Images/ExChange_creator.png)

    Quando uno scambio viene accettato in caso di esito positivo le carte vengono spostate tra gli utenti, qualsiasi errore (dovuto a carte doppie in richiesta o in offerta, o a problemi interni al server) porterà alla restituzione di tutte le carte.

    Es.
    ![PreScambio](./Images/Esempio_doppio_scambio.png)
    ![Scambio](./Images/Doppio_Scambio_creato.png)
    ![Scambio_accettato_con_successo](./Images/Scambio_accettato.png)

    Come possiamo vedere sotto, non possono essere creati scambi che hanno doppioni tra le carte richieste o tra quelle offerte.
    ![Scambi_doppi_richieste](./Images/Test_doppia_richiesta.png)
    ![Richiesta_fallita](./Images/Errore_doppia_richiesta.png)
    ![Offerta](./Images/Test_doppia_offerta.png)
    ![Offerta_fallita](./Images/Errore_doppia_offerta.png)

4. album carte:
    ![TutteLeCarte](./Images/Cards.png)
    
    Oltre all'album è presente una pagina che mostra tutte le carte disponibili.

    ![Album](./Images/Album.png)
    
    Eventuali carte possedute saranno mostrate con un pulsante per la vendita(si può vendere una carta singola ogni volta che il pulsante viene cliccato)

    ![CartaPosseduta](./Images/CartaPosseduta.png)
    
    Sia dall'album che dalla pagina delle carte presenti sul sito possiamo accedere ad alcune informazioni, ma solo se possediamo tali carte

    ![CartaNonPosseduta](./Images/CartaNonPosseduta.png)
    ![CartaPreferita](./Images/Card_favourite.png)
    Per esempio, in questo caso non possediamo la carta, quindi l'immagine risulta grigia e le informazioni non vengono fornite.
    Possiamo però cambiare il nostro personaggio preferito indipendentemente dal fatto di possederlo o meno.

## API

L'API del sito è disponibile (successivamente al lancio dell'applicazione) [qui](http://localhost:3001/api-docs)
