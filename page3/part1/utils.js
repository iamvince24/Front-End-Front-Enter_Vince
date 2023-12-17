async function fetchJsonData(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Network response was not ok, status: ${response.status}`);
  }
  return response.json();
}

export { fetchJsonData };
