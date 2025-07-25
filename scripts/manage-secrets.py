#!/usr/bin/env python3
"""
Google Cloud Secret Manager integration for BrewMetrics
Helps create and manage secrets in GCP Secret Manager
"""

import os
import json
from google.cloud import secretmanager
from google.cloud.exceptions import NotFound
from google.api_core.exceptions import AlreadyExists

PROJECT_ID = "brewmetrics-xyz-app-e8d51"

def create_secret_manager_client():
    """Initialize Secret Manager client"""
    return secretmanager.SecretManagerServiceClient()

def create_secret(secret_id, secret_value):
    """Create a new secret in Secret Manager"""
    client = create_secret_manager_client()
    parent = f"projects/{PROJECT_ID}"
    
    try:
        # Create the secret
        secret = client.create_secret(
            request={
                "parent": parent,
                "secret_id": secret_id,
                "secret": {"replication": {"automatic": {}}},
            }
        )
        print(f"Created secret: {secret.name}")
        
        # Add the secret version
        add_secret_version(secret_id, secret_value)
        
    except AlreadyExists:
        print(f"Secret {secret_id} already exists. Updating version...")
        add_secret_version(secret_id, secret_value)
    except Exception as e:
        print(f"Error creating secret {secret_id}: {e}")

def add_secret_version(secret_id, secret_value):
    """Add a new version to an existing secret"""
    client = create_secret_manager_client()
    parent = f"projects/{PROJECT_ID}/secrets/{secret_id}"
    
    try:
        response = client.add_secret_version(
            request={
                "parent": parent,
                "payload": {"data": secret_value.encode("UTF-8")},
            }
        )
        print(f"Added secret version: {response.name}")
    except Exception as e:
        print(f"Error adding secret version for {secret_id}: {e}")

def get_secret(secret_id, version_id="latest"):
    """Retrieve a secret value"""
    client = create_secret_manager_client()
    name = f"projects/{PROJECT_ID}/secrets/{secret_id}/versions/{version_id}"
    
    try:
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except NotFound:
        print(f"Secret {secret_id} not found")
        return None
    except Exception as e:
        print(f"Error retrieving secret {secret_id}: {e}")
        return None

def setup_brewmetrics_secrets():
    """Setup common BrewMetrics secrets"""
    secrets_to_create = [
        ("gcp-project", PROJECT_ID),
        ("dataset-id", "brewmetrics_data"),
        ("flask-env", "production"),
    ]
    
    print("Setting up BrewMetrics secrets...")
    for secret_id, default_value in secrets_to_create:
        create_secret(secret_id, default_value)
    
    # Prompt for sensitive secrets
    print("\nPlease provide values for sensitive secrets:")
    
    sensitive_secrets = [
        "jwt-secret",
        "api-key",
        "openai-api-key",
        "sendgrid-api-key",
        "firebase-private-key"
    ]
    
    for secret_id in sensitive_secrets:
        value = input(f"Enter value for {secret_id} (or press Enter to skip): ").strip()
        if value:
            create_secret(secret_id, value)
        else:
            print(f"Skipped {secret_id}")

def list_secrets():
    """List all secrets in the project"""
    client = create_secret_manager_client()
    parent = f"projects/{PROJECT_ID}"
    
    try:
        secrets = client.list_secrets(request={"parent": parent})
        print(f"\nSecrets in project {PROJECT_ID}:")
        for secret in secrets:
            print(f"  - {secret.name.split('/')[-1]}")
    except Exception as e:
        print(f"Error listing secrets: {e}")

def delete_secret(secret_id):
    """Delete a secret"""
    client = create_secret_manager_client()
    name = f"projects/{PROJECT_ID}/secrets/{secret_id}"
    
    try:
        client.delete_secret(request={"name": name})
        print(f"Deleted secret: {secret_id}")
    except Exception as e:
        print(f"Error deleting secret {secret_id}: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python manage-secrets.py setup          # Setup common secrets")
        print("  python manage-secrets.py list           # List all secrets")
        print("  python manage-secrets.py create <id> <value>  # Create/update secret")
        print("  python manage-secrets.py get <id>       # Get secret value")
        print("  python manage-secrets.py delete <id>    # Delete secret")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "setup":
        setup_brewmetrics_secrets()
    elif command == "list":
        list_secrets()
    elif command == "create" and len(sys.argv) == 4:
        secret_id, secret_value = sys.argv[2], sys.argv[3]
        create_secret(secret_id, secret_value)
    elif command == "get" and len(sys.argv) == 3:
        secret_id = sys.argv[2]
        value = get_secret(secret_id)
        if value:
            print(f"{secret_id}: {value}")
    elif command == "delete" and len(sys.argv) == 3:
        secret_id = sys.argv[2]
        delete_secret(secret_id)
    else:
        print("Invalid command or arguments")
        sys.exit(1)
