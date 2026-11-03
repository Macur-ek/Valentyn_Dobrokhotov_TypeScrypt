# Elektro-Bud — analiza wymagań

## 1. Opis problemu

Firma Elektro-Bud przechowuje w magazynie wiele produktów
elektrycznych, takich jak przewody, osprzęt, zabezpieczenia
i oświetlenie.

Ręczne prowadzenie ewidencji może utrudniać szybkie
sprawdzenie ilości towaru, odnalezienie produktu
oraz zauważenie braków.

Celem projektu jest wykonanie prostej aplikacji webowej,
która pozwala pracownikowi prowadzić podstawową
ewidencję produktów w jednym miejscu.

Projekt jest demonstracyjnym fragmentem systemu magazynowego.

## 2. Zakres projektu

Aplikacja realizuje:
- wyświetlanie produktów,
- dodawanie produktów,
- edycję produktów,
- usuwanie produktów,
- wyszukiwanie,
- filtrowanie po kategorii,
- obliczanie wartości magazynu,
- kontrolę niskiego stanu.

Dane przechowywane są w localStorage.

## 3. Wymagania funkcjonalne

1. System wyświetla listę produktów.
2. Użytkownik może dodać produkt.
3. Użytkownik może edytować produkt.
4. Użytkownik może usunąć produkt.
5. System umożliwia wyszukiwanie po nazwie i SKU.
6. System umożliwia filtrowanie po kategorii.
7. System oblicza wartość magazynu.
8. System informuje o niskim stanie produktów.
9. System zapisuje dane w localStorage.
10. System sprawdza poprawność wprowadzonych danych.

## 4. Wymagania niefunkcjonalne

1. Logika aplikacji napisana jest w TypeScript.
2. Kod podzielony jest na moduły.
3. Interfejs jest responsywny.
4. Kod posiada czytelne nazwy i komentarze.
5. Aplikacja działa w przeglądarce internetowej.
6. Formularz posiada walidację danych.

## 5. Ograniczenia

- Brak logowania użytkowników.
- Brak bazy danych na serwerze.
- Dane przechowywane są lokalnie.
- Brak synchronizacji między urządzeniami.

## 6. Kryteria akceptacji

- Widoczna jest przykładowa lista produktów.
- Można dodawać nowe produkty.
- Można edytować produkty.
- Można usuwać produkty.
- Wyszukiwarka działa poprawnie.
- Filtr kategorii działa poprawnie.
- Statystyki aktualizują się po zmianach.
- Dane pozostają po odświeżeniu strony.