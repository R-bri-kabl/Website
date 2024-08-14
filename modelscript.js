// Fetch the list of models from the GitHub repository
fetch('https://api.github.com/repos/R-bri-kabl/MDLS/contents/Models')
.then(response => response.json())
.then(models => {
    const container = document.getElementById('modelsContainer');
    container.innerHTML = '';

    models.forEach(model => {
        if (model.type === 'dir') {
            const modelDir = model.name;

            // Fetch the info.ofbd file for each model
            fetch(`https://raw.githubusercontent.com/R-bri-kabl/MDLS/main/Models/${modelDir}/info.ofbd`)
                .then(response => response.text())
                .then(data => {
                    const nameMatch = data.match(/name="(.+?)"/);
                    const priceMatch = data.match(/price="(.+?)"/);
                    const userMatch = data.match(/user="(.+?)"/);
                    const userLinkMatch = data.match(/user_link="(.+?)"/);
                    const partsMatch = data.match(/parts="(.+?)"/);
                    const partsLinkMatch = data.match(/parts_link="(.+?)"/);
                    const themeMatch = data.match(/theme="(.+?)"/);
                    const likesMatch = data.match(/likes="(.+?)"/);
                    const viewsMatch = data.match(/views="(.+?)"/);
                    const detailsMatch = data.match(/sdetails="(.+?)"/);
                    const descriptionMatch = data.match(/description="(.+?)"/);
                    const modelLinkMatch = data.match(/model_link="(.+?)"/);
                    const zipLinkMatch = data.match(/zip_link="(.+?)"/); // Extract the zip_link

                    const modelName = nameMatch ? nameMatch[1] : modelDir;
                    const modelPrice = priceMatch ? priceMatch[1] : 'N/A';
                    const modelUser = userMatch ? userMatch[1] : 'Unknown';
                    const modelUserLink = userLinkMatch ? userLinkMatch[1] : '#';
                    const modelParts = partsMatch ? partsMatch[1] : 'Unknown';
                    const modelPartsLink = partsLinkMatch ? partsLinkMatch[1] : '#';
                    const modelTheme = themeMatch ? themeMatch[1] : 'Unknown';
                    const modelLikes = likesMatch ? likesMatch[1] : '0';
                    const modelViews = viewsMatch ? viewsMatch[1] : '0';
                    const modelDetails = detailsMatch ? detailsMatch[1] : 'No details available';
                    const modelDescription = descriptionMatch ? descriptionMatch[1] : 'No description available';
                    const modelLink = modelLinkMatch ? modelLinkMatch[1] : '#';
                    const zipLink = zipLinkMatch ? zipLinkMatch[1] : '#'; // Assign the zip link

                    const maxWords = 10;
                    const words = modelDetails.split(/\s+/);
                    const truncatedDetails = words.length > maxWords 
                        ? words.slice(0, maxWords).join(' ') + `... <a class="learn-more" href="${modelLink}" target="_blank">learn more</a>` 
                        : modelDetails;

                    const modelDiv = document.createElement('div');
                    modelDiv.classList.add('model-card');

                    const imageUrl = `https://raw.githubusercontent.com/R-bri-kabl/MDLS/main/Models/${modelDir}/main.png`;
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = `${modelName} image`;
                    modelDiv.appendChild(img);

                    modelDiv.innerHTML += `
                        <div class="model-info">
                            <div>
                                <h1>${modelName}</h1>
                                <p class="text-muted"><a href="${modelUserLink}" target="_blank">${modelUser}</a> · <strike>${modelPrice}</strike> FREE · <a href="${modelPartsLink}" target="_blank">${modelParts}</a> pieces</p>
                                <p class="text-muted">${modelLikes} <i class="fa-duotone fa-solid fa-thumbs-up"></i>‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎${modelViews} <i class="fa-duotone fa-solid fa-eye"></i></p>
                                <p class="text-muted">${truncatedDetails}</p>
                            </div>
                            <div class="buttons">
                                <button type="button" class="more-info-btn" data-name="${modelName}" data-description="${modelDescription}" data-details="${modelDetails}"><i class="fa-duotone fa-solid fa-circle-info"></i>‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎Info</button>
                                <button type="button" class="images-btn" data-dir="${modelDir}"><i class="fa-duotone fa-solid fa-images"></i>‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎Images</button>
                                <button type="button" class="download-btn" data-zip="${zipLink}"><i class="fa-duotone fa-solid fa-circle-down"></i>‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎Download</button>
                            </div>
                        </div>
                    `;

                    container.appendChild(modelDiv);
                })
                .catch(error => {
                    const errorDiv = document.createElement('div');
                    errorDiv.textContent = `Error loading ${modelDir}.`;
                    container.appendChild(errorDiv);
                    console.error('Error:', error);
                });
        }
    });
})
.catch(error => {
    document.getElementById('modelsContainer').textContent = 'Error loading models.';
    console.error('Error:', error);
});

document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.getElementById('navbarToggle');
    const menu = document.querySelector('.navbar-menu');
    const modal = document.getElementById('infoModal');
    const modalContent = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close');

    // Toggle navbar menu
    navbarToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    // Open modal with full details
    document.addEventListener('click', event => {
        if (event.target.classList.contains('more-info-btn')) {
            const modelButton = event.target;
            const modelName = modelButton.getAttribute('data-name');
            const modelDescription = modelButton.getAttribute('data-description');
            const modelDetails = modelButton.getAttribute('data-details');

            modalContent.innerHTML = `
                <h1>${modelName}</h1>
                <p><strong>Details:</strong> ${modelDetails}</p>
            `;

            modal.style.display = 'block';
        }

        // Open modal with images gallery
        if (event.target.classList.contains('images-btn')) {
            const modelDir = event.target.getAttribute('data-dir');
            const galleryUrl = `https://api.github.com/repos/R-bri-kabl/MDLS/contents/Models/${modelDir}/Gallery`;

            fetch(galleryUrl)
                .then(response => response.json())
                .then(images => {
                    modalContent.innerHTML = `
                        <h1>Gallery</h1>
                        <div class="mini-gallery-container">
                    `;
                    images.forEach(image => {
                        if (image.type === 'file' && image.name.endsWith('.png')) {
                            const imgUrl = `https://raw.githubusercontent.com/R-bri-kabl/MDLS/main/Models/${modelDir}/Gallery/${image.name}`;
                            modalContent.innerHTML += `
                                <div class="mini-gallery-item">
                                    <img src="${imgUrl}" alt="${image.name}">
                                    <p>${image.name}</p>
                                </div>
                            `;
                        }
                    });
                    modalContent.innerHTML += `</div>`;
                    modal.style.display = 'block';
                })
                .catch(error => {
                    modalContent.innerHTML = `<p>Error loading images for ${modelDir}.</p>`;
                    console.error('Error:', error);
                });
        }

        // Trigger download from zip link
        if (event.target.classList.contains('download-btn')) {
            const zipLink = event.target.getAttribute('data-zip');
            const link = document.createElement('a');
            link.href = zipLink;
            link.download = ''; // This will download the file from the provided URL
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal if clicked outside of modal content
    window.addEventListener('click', event => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
