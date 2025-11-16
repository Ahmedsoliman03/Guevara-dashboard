export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB").format(new Date(dateString));
}
