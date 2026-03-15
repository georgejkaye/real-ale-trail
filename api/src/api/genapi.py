import json
import sys
from pathlib import Path

from fastapi.openapi.utils import get_openapi

from api.main import app


def generate_openapi_json(openapi_json_file: Path):
    openapi = get_openapi(
        title="Real Ale Trail tracker", version="1.0.0", routes=app.routes
    )
    with open(openapi_json_file, "w") as f:
        json.dump(openapi, f)


if __name__ == "__main__":
    generate_openapi_json(Path(sys.argv[1]))
