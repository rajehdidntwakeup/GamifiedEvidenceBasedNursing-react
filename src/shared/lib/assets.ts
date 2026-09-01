/**
 * Dynamic asset resolvers for documents and images.
 * Uses Vite's glob import to automatically map asset paths without hardcoding filenames.
 */

const pdfModules = import.meta.glob<string>(
  '/src/shared/assets/analytics/**/*.pdf',
  { eager: true, query: '?url', import: 'default' }
)

const abstractModules = import.meta.glob<string>(
  '/src/shared/assets/abstracts/**/*.{png,PNG,jpg,jpeg,webp}',
  { eager: true, query: '?url', import: 'default' }
)

/**
 * Resolves a PDF document URL dynamically from a backend document path or filename.
 *
 * @param docPath - Path or filename from backend (e.g. 'analytics/mission1/1_Zhang_et_al_SystematicReview.pdf')
 * @param fallbackMissionId - Optional mission ID to fall back to if docPath is not provided or not found
 * @returns Resolved asset URL or undefined
 */
export function resolvePdfAsset(docPath?: string, fallbackMissionId?: number): string | undefined {
  if (docPath) {
    if (docPath.startsWith('http://') || docPath.startsWith('https://') || docPath.startsWith('blob:') || docPath.startsWith('data:')) {
      return docPath
    }

    const normalized = docPath.replace(/\\/g, '/').replace(/^\/+/, '')
    const filename = normalized.split('/').pop()

    // 1. Try exact / suffix match with relative path (e.g., 'analytics/mission1/...')
    for (const [key, url] of Object.entries(pdfModules)) {
      if (key.endsWith(normalized)) {
        return url
      }
    }

    // 2. Try match by filename
    if (filename) {
      for (const [key, url] of Object.entries(pdfModules)) {
        if (key.endsWith(`/${filename}`)) {
          return url
        }
      }
    }
  }

  // 3. Fallback by mission ID if specified
  if (fallbackMissionId !== undefined) {
    const missionTag = `/mission${fallbackMissionId}/`
    for (const [key, url] of Object.entries(pdfModules)) {
      if (key.includes(missionTag)) {
        return url
      }
    }
  }

  return undefined
}

/**
 * Resolves an abstract image URL dynamically from a backend document path or filename.
 *
 * @param docPath - Path or filename from backend (e.g. 'abstracts/mission1/1_Abstract_Expertenkommentar.PNG')
 * @returns Resolved image URL or undefined
 */
export function resolveAbstractAsset(docPath?: string): string | undefined {
  if (!docPath) return undefined

  if (docPath.startsWith('http://') || docPath.startsWith('https://') || docPath.startsWith('blob:') || docPath.startsWith('data:')) {
    return docPath
  }

  const normalized = docPath.replace(/\\/g, '/').replace(/^\/+/, '')
  const filename = normalized.split('/').pop()

  for (const [key, url] of Object.entries(abstractModules)) {
    if (key.endsWith(normalized)) {
      return url
    }
  }

  if (filename) {
    for (const [key, url] of Object.entries(abstractModules)) {
      if (key.endsWith(`/${filename}`)) {
        return url
      }
    }
  }

  return undefined
}
