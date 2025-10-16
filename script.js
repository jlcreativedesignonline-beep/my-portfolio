document.addEventListener('DOMContentLoaded', () => {
    // Selectors for all elements we need
    const openModalButtons = document.querySelectorAll('.open-modal');
    const closeModalButtons = document.querySelectorAll('.close-button'); 
    const allModals = document.querySelectorAll('.modal');
    // Re-query for clickable images to ensure new ones are included
    const clickableImages = document.querySelectorAll('.clickable-image'); 
    const fullImageModal = document.getElementById('full-image-modal');
    const fullModalImage = document.getElementById('full-modal-image');
    
    // Selector for the video
    const architectVideo = document.getElementById('architect-video');

    // Stores the modal (gallery/testimonial) that was open before the full-screen image
    let currentGalleryModal = null; 
    
    // --- Core Modal Control Functions ---

    // Function to CLOSE any modal
    const closeModal = (modal) => {
        if (modal) {
            modal.style.display = 'none';
            
            // Logic to check if we are closing the full-screen image modal
            if (modal === fullImageModal) {
                // If closing the full-screen image, re-open the stored gallery/testimonial modal
                if (currentGalleryModal) {
                    currentGalleryModal.style.display = 'block';
                } else {
                    // Fallback: Re-enable scroll if we aren't returning to a gallery
                    document.body.style.overflow = 'auto'; 
                }
            } else {
                // If closing a main gallery/testimonial modal
                currentGalleryModal = null; // Clear the reference
                document.body.style.overflow = 'auto'; // Re-enable main page scroll
            }
        }
    };

    // --- 1. Event Listeners (Open/Close/Backdrop/Keyboard) ---

    // OPEN main modals (Projects/Testimonials)
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalTarget = document.querySelector(button.dataset.modalTarget);
            if (modalTarget) {
                modalTarget.style.display = 'block';
                document.body.style.overflow = 'hidden'; 
            }
        });
    });

    // CLOSE modals via the 'X' button
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    // CLOSE modals via clicking OUTSIDE the backdrop
    window.addEventListener('click', (event) => {
        allModals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Centralized Keyboard Accessibility (Escape Key)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            allModals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal);
                    return; 
                }
            });
        }
    });

    // --- 2. Full-Screen Image Click Logic ---

    clickableImages.forEach(img => {
        img.style.cursor = 'pointer'; 
        img.addEventListener('click', function() {
            const fullSrc = this.dataset.fullImg; 
            
            if (fullSrc && fullImageModal && fullModalImage) {
                currentGalleryModal = this.closest('.modal'); 

                if (currentGalleryModal) {
                    currentGalleryModal.style.display = 'none';
                }
                
                fullModalImage.src = fullSrc;
                fullImageModal.style.display = 'block';
                
                document.body.style.overflow = 'hidden'; 
            }
        });
    });
    
    // --- 3. Video Tracking Logic (GA4 only) 🚀 ---
    if (architectVideo) {
        architectVideo.addEventListener('play', () => {
            
            // GOOGLE ANALYTICS (GA4) TRACKING 
            // This relies on the gtag script being loaded in index.html's <head>
            if (typeof gtag === 'function') {
                gtag('event', 'video_play', {
                    'video_title': 'Architect JL Song',
                    'video_provider': 'local_file',
                    'event_category': 'Hero Engagement'
                });
            }
             // For local testing:
            console.log(`[VIDEO TRACKING] Play event detected. Sending data to GA4...`);
        }); 
    }
    // --- END Video Tracking Logic ---


    // --- 4. Slider Control Logic (for testimonial modals) ---

    const setupSlider = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const track = modal.querySelector('.image-track');
        const images = modal.querySelectorAll('.scroll-photo'); 
        const slider = modal.querySelector('.carousel-slider'); 
        const scrollingWrapper = modal.querySelector('.scrolling-wrapper');

        if (!track || images.length === 0 || !slider || !scrollingWrapper) return;

        // Number of steps should be (Total Images - 1)
        const numSteps = images.length - 1; 
        
        slider.setAttribute('max', numSteps);
        
        const scrollContainerWidth = scrollingWrapper.getBoundingClientRect().width; 

        slider.addEventListener('input', () => {
            const newIndex = parseInt(slider.value); 
            const trackWidth = track.scrollWidth;
            
            const maxScrollDistance = Math.max(0, trackWidth - scrollContainerWidth); 
            
            // Calculate the required scroll distance for the current step
            const scrollDistance = (newIndex / numSteps) * maxScrollDistance;
            
            track.style.transform = `translateX(${-scrollDistance}px)`;
        });
        
        // Reset/Initialize the slider when it's first set up
        slider.value = 0; 
        track.style.transform = 'translateX(0px)';
    };

    // Wait for the window to load all elements (especially images for size calculation) before setting up the slider
    window.addEventListener('load', () => {
        setupSlider('testimonial1');
        setupSlider('testimonial2'); 
    });

}); // End of DOMContentLoaded