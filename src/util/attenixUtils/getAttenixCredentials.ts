export default function getAttenixCredentials(): [string, string] {
    return [process.env.ATTENIX_USERNAME || '', process.env.ATTENIX_PASSWORD || '']
}