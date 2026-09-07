export function exportToCsv(filename: string, rows: Record<string, any>[]): void {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = Object.keys(rows[0]);

  const csvContent =
    '\uFEFF' + // UTF-8 BOM for Excel
    keys.join(separator) +
    '\n' +
    rows
      .map((row) =>
        keys
          .map((key) => {
            let cell = row[key] === null || row[key] === undefined ? '' : row[key];
            if (typeof cell === 'object') {
              cell = JSON.stringify(cell);
            }
            cell = String(cell).replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator)
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}