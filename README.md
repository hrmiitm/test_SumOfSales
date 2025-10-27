Sales Summary 756

This is a single-page static site that loads sales.csv and computes the total of the `sales` column for rows where `category` <= 26. The computed total is displayed in the element with id="total-sales" and rounded to 2 decimal places.

Usage

- Place `sales.csv` in the same directory as `index.html` (root of the repository).
- Open `index.html` in a browser (or publish the repo with GitHub Pages).

Files

- index.html — Page (title must be "Sales Summary 756").
- script.js — Fetches `sales.csv`, parses CSV, computes the sum, and writes it into #total-sales.
- style.css — Minimal styling.

Notes

- The script expects `sales.csv` to have headers including `category` and `sales` (case-insensitive).
- Categories are parsed as numbers; non-numeric categories are ignored.
- Sales values may contain currency symbols or commas; those are stripped before parsing.
