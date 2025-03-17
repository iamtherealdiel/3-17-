/**
 * Sets the document title with the provided page name
 * @param pageName The name of the current page
 */
export const setDocumentTitle = (pageName: string): void => {
  document.title = pageName ? `${pageName} - MediaTiger` : 'MediaTiger';
};