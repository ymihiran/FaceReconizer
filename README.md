Face Recognition Application
----------------------------

This Python application leverages the `haarcascade_frontalface_default` algorithm to recognize individuals from photographs. It offers the functionality to detect multiple faces within an image and subsequently associates them with corresponding names. Moreover, the application is equipped to recall these identified individuals by name when presented with a photograph for search.



### Features:

*   **Face Detection:** Utilizes the `haarcascade_frontalface_default` algorithm to detect and extract facial features from images.
    
*   **Multiple Face Detection:** Capable of identifying and distinguishing multiple faces within a single image.
    
*   **Face Naming:** Allows users to assign names to detected faces, enabling personalized recognition.
    
*   **Search Functionality:** Offers a search feature that identifies the best match for a given photograph from the database of recognized faces.
    

### Usage:

1.  **Face Detection:** Upload an image containing faces. The application will detect and display the recognized faces along with their associated names, if available.
    
2.  **Face Naming:** Assign names to the detected faces, facilitating personalized recognition.
    
3.  **Search:** Submit a photograph to find the best match from the database of recognized faces, displaying the corresponding name if a match is found.
    

### How to Run:

1.  Clone this repository to your local machine.
2.  Change directory to 'backend'
    
3.  Install the required dependencies using `pip install -r requirements.txt`.
    
4.  Run the application using `python main.py`.
    
Find demo video here : https://www.linkedin.com/posts/yasantha-mihiran_facialrecognition-python-opensource-activity-7190003806011559936-UMhJ?utm_source=share&utm_medium=member_desktop
