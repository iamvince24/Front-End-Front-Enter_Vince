function setRedirectLink(address, id, idname) {
  if (id !== null) {
    const contentUrl = `${window.location.origin}/${address}.html`;
    const contentId = id;
    // const contentParams = new URLSearchParams({
    //   ${idname}: JSON.stringify(contentId),
    // });
    const contentParams = new URLSearchParams();
    if (idname !== null) {
      contentParams.append(idname, JSON.stringify(contentId));
    }

    return `${contentUrl}?${contentParams.toString()}`;
  } else {
    const contentUrl = `${window.location.origin}/${address}.html`;
    return `${contentUrl}`;
  }
}

const stopPropagationHandler = (event) => {
  event.stopPropagation();
};

export { setRedirectLink, stopPropagationHandler };
