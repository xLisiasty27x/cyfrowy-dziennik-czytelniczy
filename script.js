// Dane początkowe (rekordy startowe zgodnie z wymogiem danych w pliku/tablicy)
let ksiazki = JSON.parse(localStorage.getItem('ksiazki')) || [
    { id: 1, tytul: "Wiedźmin: Ostatnie Życzenie", autor: "Andrzej Sapkowski", status: "Przeczytane", data: "2026-10-01" },
    { id: 2, tytul: "Hobbit", autor: "J.R.R. Tolkien", status: "W trakcie", data: "2026-11-05" },
    { id: 3, tytul: "Solaris", autor: "Stanisław Lem", status: "Do przeczytania", data: "2026-11-15" }
];

// Automatyczne ustawienie dzisiejszej daty w formularzu (Poprawne wartości domyślne)
document.addEventListener('DOMContentLoaded', () => {
    const dzis = new Date().toISOString().split('T')[0];
    const dataInput = document.getElementById('data');
    if (dataInput) dataInput.value = dzis;
    
    renderujliste();
});

// Zmiana ekranów (Model oś i szprychy)
function zmienEkran(idEkranu) {
    document.querySelectorAll('.ekran').forEach(e => e.classList.add('ukryty'));
    document.getElementById(`ekran-${idEkranu}`).classList.remove('ukryty');

    document.querySelectorAll('.navbar nav button').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`btn-${idEkranu}`);
    if (btn) btn.classList.add('active');

    if (idEkranu === 'katalog') {
        renderujliste();
    }
}

// Renderowanie listy w katalogu
function renderujliste() {
    const kontener = document.getElementById('lista-ksiazek');
    kontener.innerHTML = '';

    if (ksiazki.length === 0) {
        kontener.innerHTML = '<p class="placeholder-info">Brak książek w katalogu.</p>';
        return;
    }

    ksiazki.forEach((ksiazka, index) => {
        const div = document.createElement('div');
        div.className = 'ksiazka-item';
        div.innerHTML = `
            <div>
                <strong>${ksiazka.tytul}</strong><br>
                <small>${ksiazka.autor}</small>
            </div>
            <span>[${ksiazka.status}]</span>
        `;
        div.onclick = () => pokazSzczegoly(index);
        kontener.appendChild(div);
    });
}

// Wyświetlanie szczegółów (Uszczegółowienie w jednym oknie)
function pokazSzczegoly(index) {
    const k = ksiazki[index];
    const panel = document.getElementById('panel-szczegolow');
    panel.innerHTML = `
        <h3>Szczegóły lektury</h3>
        <p><strong>Tytuł:</strong> ${k.tytul}</p>
        <p><strong>Autor:</strong> ${k.autor}</p>
        <p><strong>Status:</strong> ${k.status}</p>
        <p><strong>Data dodania:</strong> ${k.data}</p>
        <br>
        <button class="btn-secondary" onclick="usunKsiazke(${index})" style="background-color: #fee2e2; color: #991b1b;">Usuń pozycję</button>
    `;
}

// Dodawanie książki z walidacją (Zlokalizowane komunikaty błędów)
function dodajKsiazke(e) {
    e.preventDefault();
    
    const tytulInput = document.getElementById('tytul');
    const autorInput = document.getElementById('autor');
    const statusInput = document.getElementById('status');
    const dataInput = document.getElementById('data');

    let poprawnie = true;

    // Czyszczenie błędów
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

    if (!tytulInput.value.trim()) {
        document.querySelector('[id-error="tytul"]').textContent = 'Tytuł jest wymagany!';
        poprawnie = false;
    }

    if (!autorInput.value.trim()) {
        document.querySelector('[id-error="autor"]').textContent = 'Autor jest wymagany!';
        poprawnie = false;
    }

    if (!poprawnie) return;

    const nowaKsiazka = {
        id: Date.now(),
        tytul: tytulInput.value.trim(),
        autor: autorInput.value.trim(),
        status: statusInput.value,
        data: dataInput.value
    };

    ksiazki.push(nowaKsiazka);
    localStorage.setItem('ksiazki', JSON.stringify(ksiazki));

    // Reset formularza i przejście do katalogu
    tytulInput.value = '';
    autorInput.value = '';
    zmienEkran('katalog');
}

// Usuwanie książki
function usunKsiazke(index) {
    ksiazki.splice(index, 1);
    localStorage.setItem('ksiazki', JSON.stringify(ksiazki));
    document.getElementById('panel-szczegolow').innerHTML = '<p class="placeholder-info">Wybierz książkę z listy po lewej, aby zobaczyć szczegóły.</p>';
    renderujliste();
}