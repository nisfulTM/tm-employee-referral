# Use Python 3.11 slim image
FROM python:3.11-slim

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# The start command will be provided by railway.json
# This CMD is a fallback for running the container directly
CMD ["gunicorn", "job_referral_backend.wsgi:application", "--bind", "0.0.0.0:8000"]