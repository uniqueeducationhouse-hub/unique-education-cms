export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
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
  return { grade: 'F', gpa: 0.0 };
}
