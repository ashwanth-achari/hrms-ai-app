import cv2
import numpy as np

def preprocess(image):
    """Improves OCR readability via deep image cleanup."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Noise removal
    gray = cv2.bilateralFilter(gray, 11, 17, 17)

    # Adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 25, 15
    )

    # Remove shadows / gradient
    kernel = np.ones((3,3), np.uint8)
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)

    return opening
