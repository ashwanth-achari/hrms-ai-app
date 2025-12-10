# import requests
# import numpy as np
# import cv2

# def fetch_resume(input_url: str):
#     """
#     Download resume as an image and return list of OpenCV image objects.
#     Keeping list format to maintain compatibility with multi-page pipelines.
#     Accepts .png / .jpg / .jpeg / .bmp
#     """
#     try:
#         response = requests.get(input_url, timeout=10)
#         response.raise_for_status()

#         img_array = np.frombuffer(response.content, np.uint8)
#         image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

#         if image is None:
#             raise ValueError("Failed to decode image from response. Unsupported format?")

#         # Return list (for compatibility with future PDF multipage support)
#         return [image]

#     except Exception as e:
#         print(f"[fetch_resume] Error: {e}")
#         return []
