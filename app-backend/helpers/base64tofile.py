
import base64
import uuid
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage


def base64_to_file(base64_string, filename=None):

    try:
        if base64_string.startswith('data:'):
            header, base64_data = base64_string.split(',', 1)
        else:
            base64_data = base64_string
        
        file_data = base64.b64decode(base64_data)
        if not filename:
            filename = f"{uuid.uuid4().hex}.pdf"
        
        return ContentFile(file_data, name=filename)
    
    except Exception as e:
        raise ValueError(f"Invalid base64 string: {str(e)}")