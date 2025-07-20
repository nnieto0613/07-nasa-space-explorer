// NASA APOD API configuration
const NASA_API_KEY = 'Afakxrwca4rz7VFtXOrkbsjARIYFFaXNRUYMF8Yn'; // Replace with your actual API key
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';

// Get DOM elements
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Get modal elements
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModal = document.querySelector('.close');

// Add event listener to the button
button.addEventListener('click', handleGetImages);

// Add event listeners for modal
closeModal.addEventListener('click', hideModal);
modal.addEventListener('click', (event) => {
    // Close modal if clicking outside the modal content
    if (event.target === modal) {
        hideModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        hideModal();
    }
});

// Function to handle button click
async function handleGetImages() {
    // Get the selected dates
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    // Validate that both dates are selected
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }
    
    // Validate that start date is before end date
    if (startDate > endDate) {
        alert('Start date must be before end date');
        return;
    }
    
    // Show loading message
    showLoading();
    
    try {
        // Fetch data from NASA API
        const images = await fetchNASAImages(startDate, endDate);
        
        // Display the images in the gallery
        displayGallery(images);
    } catch (error) {
        // Handle any errors
        console.error('Error fetching NASA images:', error);
        showError('Failed to load images. Please try again.');
    }
}

// Function to fetch images from NASA APOD API
async function fetchNASAImages(startDate, endDate) {
    // Build the API URL with parameters
    const url = `${NASA_API_URL}?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
    
    // Make the API request
    const response = await fetch(url);
    
    // Check if the response is successful
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    return data;
}

// Function to display images in the gallery
function displayGallery(images) {
    // Clear the gallery
    gallery.innerHTML = '';
    
    // Check if we have images to display
    if (!images || images.length === 0) {
        showError('No images found for the selected date range');
        return;
    }
    
    // Create gallery items for each image
    images.forEach(imageData => {
        // Only display items that have images (skip videos)
        if (imageData.media_type === 'image') {
            const galleryItem = createGalleryItem(imageData);
            gallery.appendChild(galleryItem);
        }
    });
}

// Function to create a single gallery item
function createGalleryItem(imageData) {
    // Create the main container
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    // Create and set up the image
    const img = document.createElement('img');
    img.src = imageData.url;
    img.alt = imageData.title;
    
    // Create the title
    const title = document.createElement('h3');
    title.textContent = imageData.title;
    
    // Create the date
    const date = document.createElement('p');
    date.className = 'item-date';
    date.textContent = imageData.date;
    
    // Add click event to open modal
    item.addEventListener('click', () => {
        showModal(imageData);
    });
    
    // Add all elements to the item
    item.appendChild(img);
    item.appendChild(title);
    item.appendChild(date);
    
    return item;
}

// Function to show the modal with image details
function showModal(imageData) {
    // Set modal content
    modalImage.src = imageData.url;
    modalImage.alt = imageData.title;
    modalTitle.textContent = imageData.title;
    modalDate.textContent = `Date: ${imageData.date}`;
    modalExplanation.textContent = imageData.explanation;
    
    // Show the modal
    modal.style.display = 'block';
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

// Function to hide the modal
function hideModal() {
    // Hide the modal
    modal.style.display = 'none';
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

// Function to show loading message
function showLoading() {
    // Display loading message with spinning icon
    gallery.innerHTML = `
        <div class="placeholder">
            <div class="placeholder-icon">🔄</div>
            <p>Loading space photos...</p>
        </div>
    `;
}

// Function to show error message
function showError(message) {
    gallery.innerHTML = `
        <div class="placeholder">
            <div class="placeholder-icon">❌</div>
            <p>${message}</p>
        </div>
    `;
}

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);
