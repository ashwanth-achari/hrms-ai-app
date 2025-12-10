# import cv2
# import numpy as np
# import pytesseract

# # optional: TensorFlow later
# try:
#     import tensorflow as tf  # noqa: F401
# except ImportError:
#     tf = None


# def detect_text_regions(image: np.ndarray):
#     # For now, treat full page as one text box
#     h, w = image.shape[:2]
#     return [(0, 0, w, h)]


# def recognize_text(region: np.ndarray) -> str:
#     if len(region.shape) == 3:
#         gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
#     else:
#         gray = region

#     _, thresh = cv2.threshold(
#         gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
#     )

#     text = pytesseract.image_to_string(thresh)
#     return text or ""
