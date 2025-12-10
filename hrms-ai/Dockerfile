FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy dependency file and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy this package into /app/hrms_ai
COPY . /app/hrms_ai

# Make sure Python can find the package root
ENV PYTHONPATH=/app

# Expose the port (Render will inject PORT env var)
EXPOSE 8000

# Start FastAPI app with uvicorn
# hrms_ai.main:app  --> package.module:variable (your FastAPI instance)
CMD ["sh", "-c", "uvicorn hrms_ai.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
