
/**
 * 
 * @param {string} tagName 
 * @param {object} attributes 
 * @returns {HTMLElement}
 */
export function createElement(tagName, attributes = {}) {
    
    const element = document.createElement(tagName)

    for (const [attribute, value] of Object.entries(attributes)) {
       if (value !== false && value !== null) {
              element.setAttribute(attribute, value)
       }
    }
    return element
}

/**
 * 
 * @param {string} id 
 * @returns {DocumentFragment}
 */
export function CloneTemplate(id) {
    return document.getElementById(id).content.cloneNode(true)
}