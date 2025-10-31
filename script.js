// DOM element needed to display space facts
const factText = document.getElementById('factText');

// Array of space facts
const spaceFacts = [
    "NASA's Hubble Space Telescope has been in operation for over 30 years, capturing stunning images of the universe.",
    "A day on Venus is longer than a year on Venus due to its slow rotation.",
    "Neutron stars are so dense that a sugar-cube-sized amount of neutron star material would weigh about a billion tons on Earth.",
    "The largest volcano in the solar system is Olympus Mons on Mars, which is about 13.6 miles high.",
    "Saturn's rings are made up of countless small particles, ranging from micrometers to meters in size."
];

// Function to display a random space fact
function displayRandomFact() {
    const randomIndex = Math.floor(Math.random() * spaceFacts.length);
    factText.textContent = spaceFacts[randomIndex];
}

displayRandomFact(); // Display a random fact on page load

// DOM elements needed to fetch and display images
const form = document.getElementById('controls');
const gallery = document.getElementById('gallery');

// URL to fetch NASA APOD data
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// Listen event on form submission
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }

    fetchImages(startDate, endDate);
});

// Function to fetch NASA APOD images within the selected date range
async function fetchImages(startDate, endDate) {
    gallery.innerHTML = '<p> 🔃 Loading space photos...</p>';

    try {
        const response = await fetch(apodData);
        const data = await response.json();

        // Filter data within the selected date range
        const filteredData = data.filter(item =>
            item.date >= startDate && item.date <= endDate
        );

        // If no results found, display message
        if (filteredData.length === 0) {
            gallery.innerHTML = '<p> ⚠️ No results found for this date range.</p>';
            return;
        }

        displayGallery(filteredData);

    } catch (error) {
        console.error('Error fetching data:', error);
        gallery.innerHTML = '<p> ⚠️ Unable to load data. Please try again.</p>';
    }
}

// Function to display images and videos in the gallery
function displayGallery(items) {
    gallery.innerHTML = ''; // Clear previous content

    items.forEach(item => {
        // Create the article container
        const article = document.createElement('article');
        article.classList.add('poster');

        // Differentiate between image and video entries
        // Handles image entries
        if (item.media_type === 'image') {
            article.innerHTML = `
                <img src="${item.url}" alt="${item.title}">
                <div class="caption">
                    <strong>${item.title}</strong><br>
                    <small>${item.date}</small>
                </div>
                `;
        }

        // Handles video entries
        else if (item.media_type === 'video') {
            article.innerHTML = `
                <iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>
                <div class="caption">
                    <strong>${item.title}</strong><br>
                    <small>${item.date}</small>
                </div>
            `;
        }


        // Add click event to open the modal
        article.addEventListener('click', () => openModal(item));
        gallery.appendChild(article);
    });
}

// Function to create a modal popup window for gallery items
function openModal(item) {
  // Create modal container
  const modal = document.createElement('div');
  modal.classList.add('modal', 'open');

  // Create modal content area
  const content = document.createElement('div');
  content.classList.add('modal-content');

  // Create close button
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close-btn');
  closeBtn.textContent = '✖';
  closeBtn.addEventListener('click', () => modal.remove());

  // Create the article wrapper
  const article = document.createElement('article');
  article.classList.add('modal-article');

  // Handle image entries
  if (item.media_type === 'image') {
    article.innerHTML = `
      <img src="${item.hdurl || item.url}" alt="${item.title}">
      <h2>${item.title}</h2>
      <p><em>${item.date}</em></p>
      <p>${item.explanation}</p>
    `;
  }

  // Handle video entries
  else if (item.media_type === 'video') {
    let videoId = null;

    // Extract YouTube ID
    if (item.url.includes("youtube.com/watch?v=")) {
      videoId = item.url.split("v=")[1]?.split("&")[0];
    } else if (item.url.includes("youtu.be/")) {
      videoId = item.url.split("youtu.be/")[1]?.split("?")[0];
    }

    if (videoId) {
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.width = "100%";
      iframe.height = "400";
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;

      // Fallback thumbnail
      const fallback = document.createElement('img');
      fallback.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      fallback.alt = `${item.title}`;
      fallback.style.display = "none";
      fallback.style.cursor = "pointer";

      // When iframe fails, show the thumbnail
      iframe.addEventListener('error', () => {
        iframe.style.display = "none";
        fallback.style.display = "block";
      });

      // Clicking fallback opens YouTube
      fallback.addEventListener('click', () => {
        window.open(item.url, '_blank');
      });

      // Add both to article
      article.appendChild(iframe);
      article.appendChild(fallback);

      // Add details below them
      const info = document.createElement('div');
      info.innerHTML = `
        <h2>${item.title}</h2>
        <p><em>${item.date}</em></p>
        <p>${item.explanation}</p>
      `;
      article.appendChild(info);
    } else {
      // If no valid video ID
      article.innerHTML = `
        <p>🎥 Video unavailable. <a href="${item.url}" target="_blank">Watch on YouTube</a>.</p>
        <h2>${item.title}</h2>
        <p><em>${item.date}</em></p>
        <p>${item.explanation}</p>
      `;
    }
  }

  // Build modal
  content.appendChild(closeBtn);
  content.appendChild(article);
  modal.appendChild(content);
  document.body.appendChild(modal);

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}




