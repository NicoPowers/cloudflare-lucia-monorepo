export function getRandomCountryName(): string {
    const countries = [
        "United States",
        "Canada",
        "Mexico",
        "Brazil",
        "Argentina",
        "United Kingdom",
        "Germany",
        "France",
        "Italy",
        "Spain",
        "Russia",
        "China",
        "Japan",
        "India",
        "Australia",
        "South Africa",
        "Egypt",
        "Nigeria",
        "Kenya",
        "Ethiopia",
        "Morocco",
        "Turkey",
        "Saudi Arabia",
        "Iran"];
    return countries[Math.floor(Math.random() * countries.length)];
}