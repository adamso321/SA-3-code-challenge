document.addEventListener('DOMContentLoaded', function () {
    //function to fetch data of the film from database
    function fetchFilmData() {
    fetch ('http://localhost:3000/films')
        .then((resp) => resp.json())
        .then((data) => {
            //call our function to display the films on the left side
            displayFilm(data);
            if (data.length > 0) {
                displayFilmDetails(data[0].id);
            }
        })
        .catch((error) => console.error('Error fetching film data:', error));
    }
    //function to display film on the left side.
    function displayFilm(films) {
        const filmsListElement = document.getElementById('films');
        filmsListElement.innerHTML = '';
        films.forEach((film) => {
            const li = document.createElement('li');
            li.classList.add('film', 'item');
            li.textContent = film.title;

            //click event listener for each film item
            li.addEventListener('click', () => displayFilmDetails(film.id));
            filmsListElement.appendChild(li);
        });
    }

    //function to display film on the right side
    function displayFilmDetails(filmId) {
        fetch(`http://localhost:3000/films/${filmId}`)
            .then((resp) => resp.json())
            .then((data) => {
                const titleElement = document.getElementById('title');
                const runTimeElement = document.getElementById('runtime');
                const filmInfoElement = document.getElementById('film-info');
                const showTimeElement = document.getElementById('showtime');
                const ticketNumElement = document.getElementById('ticket-num');
                const buyTicketButton = document.getElementById('buy-ticket');

                //update film details
                titleElement.textContent = data.title;
                runTimeElement.textContent = `${data.runtime} minutes`;
                filmInfoElement.textContent = data.description;
                showTimeElement.textContent = data.showtime;
                const availableTickets = data.capacity - data.tickets_sold;
                ticketNumElement.textContent = `${availableTickets} remaining tickets`;

                //update buy tickets button
                if (availableTickets > 0) {
                    buyTicketButton.textContent = 'buy ticket';
                    buyTicketButton.disabled = false;
                } else {
                    buyTicketButton.textContent = 'sold out';
                    buyTicketButton.disabled = true;
                }

                //add event listener to buy ticket button
                buyTicketButton.onclick = () => handleBuyTicket(filmId, availableTickets);
            })
            .catch((error) => console.error('error fetching details:', error));
    }

    //function to handle a buying a ticket
    function handleBuyTicket(filmId, availableTickets) {
        if (availableTickets > 0) {
            const updatedTicketsSold = data.tickets_sold + 1;
            updateTicketsSoldOnServer(filmId, updatedTicketsSold);

            //update tickets count on the frontend
            const ticketNumElement = document.getElementById('ticket-num');
            ticketNumElement.textContent = `${availableTickets - 1} remaining tickets`;
        }
    }

    //function to update tickets sold on the servers
    function updateTicketsSoldOnServer(filmId, updatedTicketsSold) {
        fetch(`http://localhost:3000/films/${filmId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                tickets_sold: updatedTicketsSold
            })
        })
            .then((resp) => resp.json())
            .then((data) => console.log('updated tickets sold on server:', data))
            .catch((error) => console.error('error updating tickets sold on server: ', error));
    }

    //fetch film data when the page loads
    fetchFilmData();
});