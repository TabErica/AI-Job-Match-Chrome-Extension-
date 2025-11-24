// Content Script to extract job description
// This runs in the context of the web page

(function() {
  function getJobDescription() {
    // Priority list of selectors for common job boards
    const selectors = [
      '.jobs-description', // LinkedIn
      '.job-details', // LinkedIn
      '#jobDescriptionText', // Indeed
      '[data-testid="job-description"]', // Glassdoor/Various
      '.job-description', // Generic
      'article', // Semantic HTML
      'main' // Semantic HTML
    ];

    let text = '';

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        text = element.innerText;
        break;
      }
    }

    // Fallback to body if nothing specific found, but try to avoid nav/footer noise if possible
    if (!text) {
      text = document.body.innerText;
    }

    // Clean up whitespace
    return text.replace(/\s+/g, ' ').trim().substring(0, 10000); // Limit length for token safety
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_JD') {
      const jd = getJobDescription();
      sendResponse({ jd: jd });
    }
    return true; // Keep channel open
  });
})();