

export async function fetchJSON(url, options = {}) {
    const header = {Acceptation : 'application/JSOn',...options}
    const r = await fetch(url, header)
    if (r.ok) {
        return r.json()
    }

    throw new Error('Erreur serveur', {cause : e})
}