FROM n8nio/n8n:latest

# Set working directory
WORKDIR /data

# Set environment variables for Railway
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=https
ENV NODE_ENV=production
ENV N8N_BASIC_AUTH_ACTIVE=true

# Create necessary directories
RUN mkdir -p /data/.n8n/workflows

# Copy workflow files
COPY workflows/*.json /data/.n8n/workflows/


# Expose the port Railway expects
EXPOSE 5678


# Start n8n
CMD ["n8n", "start"]