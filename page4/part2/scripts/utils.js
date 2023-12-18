async function fetchJsonData(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Network response was not ok, status: ${response.status}`);
  }
  return response.json();
}

function setRedirectLink(address, id) {
  if (id !== null) {
    const contentUrl = `${window.location.origin}/${address}.html`;
    const contentId = id;
    const contentParams = new URLSearchParams({
      id: JSON.stringify(contentId),
    });

    return `${contentUrl}?${contentParams.toString()}`;
  } else {
    const contentUrl = `${window.location.origin}/${address}.html`;
    return `${contentUrl}`;
  }
}

const stopPropagationHandler = (event) => {
  event.stopPropagation();
};

export { fetchJsonData, setRedirectLink, stopPropagationHandler };