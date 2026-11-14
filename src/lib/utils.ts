export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount || 0);
  return `Rs. ${rounded.toLocaleString('en-PK')}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateGrade(percentage: number): { grade: string; gpa: number } {
  if (percentage >= 90) return { grade: 'A+', gpa: 4.0 };
  if (percentage >= 80) return { grade: 'A', gpa: 3.7 };
  if (percentage >= 70) return { grade: 'B', gpa: 3.0 };
  if (percentage >= 60) return { grade: 'C', gpa: 2.0 };
  if (percentage >= 50) return { grade: 'D', gpa: 1.0 };
  if (percentage >= 40) return { grade: 'E', gpa: 0.7 };
  return { grade: 'F', gpa: 0.0 };
}

// Convert numbers (e.g., 3850) to Pakistani currency words
export function numberToWordsPKR(num: number): string {
  const val = Math.floor(Math.abs(num || 0));
  if (val === 0) return 'Zero Rupees Only';

  const units = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertSection(n: number): string {
    if (n === 0) return '';
    if (n < 20) return units[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + units[n % 10] : '') + ' ';
    return units[Math.floor(n / 100)] + ' Hundred ' + (n % 100 !== 0 ? convertSection(n % 100) : '');
  }

  // Pakistani numbering terms: Crore (1,00,00,000), Lakh (1,00,000), Thousand (1,000)
  const crore = Math.floor(val / 10000000);
  const lakh = Math.floor((val % 10000000) / 100000);
  const thousand = Math.floor((val % 100000) / 1000);
  const remainder = val % 1000;

  let words = '';
  if (crore > 0) words += convertSection(crore) + 'Crore ';
  if (lakh > 0) words += convertSection(lakh) + 'Lakh ';
  if (thousand > 0) words += convertSection(thousand) + 'Thousand ';
  if (remainder > 0) words += convertSection(remainder);

  return `${words.trim()} Rupees Only`;
}
