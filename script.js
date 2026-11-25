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
        <p><strong>Status:</strong> <span id="aktualny-status-tekst">${k.status}</span></p>
        <p><strong>Data dodania:</strong> ${k.data}</p>

        <div class="form-group" style="margin-top: 14px;">
            <label for="select-status-${index}">Zmień status czytania</label>
            <select id="select-status-${index}">
                <option value="Do przeczytania" ${k.status === 'Do przeczytania' ? 'selected' : ''}>Do przeczytania</option>
                <option value="W trakcie" ${k.status === 'W trakcie' ? 'selected' : ''}>W trakcie</option>
                <option value="Przeczytane" ${k.status === 'Przeczytane' ? 'selected' : ''}>Przeczytane</option>
            </select>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px;">
            <button class="btn-primary" onclick="zmienStatus(${index})">Edytuj status</button>
            <button class="btn-secondary" onclick="usunKsiazke(${index})" style="background-color: #fee2e2; color: #991b1b;">Usuń pozycję</button>
        </div>
        <small id="status-potwierdzenie" style="display: block; margin-top: 8px; color: #166534;"></small>
    `;
}

// Zmiana statusu książki i zapis w localStorage
function zmienStatus(index) {
    const select = document.getElementById(`select-status-${index}`);
    if (!select) return;

    ksiazki[index].status = select.value;
    localStorage.setItem('ksiazki', JSON.stringify(ksiazki));

    renderujliste();
    pokazSzczegoly(index);

    const potwierdzenie = document.getElementById('status-potwierdzenie');
    if (potwierdzenie) {
        potwierdzenie.textContent = `Zapisano status: ${select.value}`;
    }
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