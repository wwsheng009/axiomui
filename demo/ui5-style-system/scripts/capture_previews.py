from __future__ import annotations

import argparse
import json
import re
import shutil
import socket
import subprocess
import sys
import time
import urllib.request
from datetime import datetime
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlparse


SCREENSHOT_SUITES = {
    "acceptance": [
        "matrix.html",
        "worklist.html",
        "object-page.html",
        "object-page.html?tab=object-history#object-history",
        "tokens.html",
        "acceptance.html",
    ]
}


def find_edge() -> str:
    candidates = [
        shutil.which("msedge.exe"),
        shutil.which("msedge"),
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return str(candidate)
    raise FileNotFoundError("Microsoft Edge executable not found.")


def reserve_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def wait_for_server(url: str, timeout_s: float = 10.0) -> None:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=1) as response:
                if response.status == 200:
                    return
        except Exception:
            time.sleep(0.25)
    raise TimeoutError(f"Server did not become ready: {url}")


def capture(edge_path: str, url: str, output_path: Path, width: int, height: int, budget_ms: int) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    command = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--window-size={width},{height}",
        f"--virtual-time-budget={budget_ms}",
        f"--screenshot={output_path}",
        url,
    ]
    subprocess.run(command, check=True)


def resolve_targets(pages: list[str], targets: list[str] | None, suite: str | None) -> list[str]:
    if targets:
        return targets
    if suite:
        return SCREENSHOT_SUITES[suite]
    return [page if ".html" in page else f"{page}.html" for page in pages]


def target_slug(target: str) -> str:
    parsed = urlparse(target)
    stem = Path(parsed.path).stem or "preview"
    parts = [stem]

    for key, value in parse_qsl(parsed.query, keep_blank_values=True):
        parts.append(key if not value else f"{key}-{value}")

    slug = "-".join(parts)
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", slug).strip("-").lower()
    return slug or "preview"


def main() -> int:
    parser = argparse.ArgumentParser(description="Capture UI5 style-system preview screenshots.")
    parser.add_argument(
        "--pages",
        nargs="+",
        default=["index", "worklist", "object-page"],
        help="Page basenames under demo/ui5-style-system, without .html",
    )
    parser.add_argument(
        "--targets",
        nargs="+",
        help="Optional raw targets under demo/ui5-style-system, for example object-page.html?tab=object-history#object-history",
    )
    parser.add_argument(
        "--suite",
        choices=sorted(SCREENSHOT_SUITES),
        help="Named screenshot suite under demo/ui5-style-system",
    )
    parser.add_argument(
        "--densities",
        nargs="+",
        default=["compact"],
        help="Density values to capture",
    )
    parser.add_argument(
        "--dirs",
        nargs="+",
        default=["ltr", "rtl"],
        help="Direction values to capture",
    )
    parser.add_argument("--width", type=int, default=1440, help="Screenshot viewport width")
    parser.add_argument("--height", type=int, default=2200, help="Screenshot viewport height")
    parser.add_argument("--budget-ms", type=int, default=5000, help="Virtual time budget for Edge")
    parser.add_argument(
        "--output-dir",
        default="tmp/ui5-style-system-shots",
        help="Directory to write screenshots into, relative to repo root",
    )
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[3]
    launcher_path = "demo/ui5-style-system/preview-launcher.html"
    output_dir = repo_root / args.output_dir
    edge_path = find_edge()
    port = reserve_port()
    server_url = f"http://127.0.0.1:{port}/{launcher_path}"

    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"],
        cwd=repo_root,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    manifest_entries: list[dict[str, str | int]] = []

    try:
        wait_for_server(server_url)
        for target in resolve_targets(args.pages, args.targets, args.suite):
            for density in args.densities:
                for direction in args.dirs:
                    query = urlencode(
                        {
                            "target": target,
                            "density": density,
                            "dir": direction,
                        }
                    )
                    url = f"{server_url}?{query}"
                    filename = f"{target_slug(target)}-{density}-{direction}.png"
                    output_path = output_dir / filename
                    print(f"capturing {filename}")
                    capture(edge_path, url, output_path, args.width, args.height, args.budget_ms)
                    print(f"saved {output_path}")
                    manifest_entries.append(
                        {
                            "target": target,
                            "slug": target_slug(target),
                            "density": density,
                            "dir": direction,
                            "filename": filename,
                            "relativePath": output_path.relative_to(repo_root).as_posix(),
                            "size": output_path.stat().st_size,
                        }
                    )
    finally:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()

    manifest_path = output_dir / "manifest.json"
    manifest = {
        "generatedAt": datetime.now().astimezone().isoformat(timespec="seconds"),
        "suite": args.suite or "",
        "width": args.width,
        "height": args.height,
        "budgetMs": args.budget_ms,
        "entries": manifest_entries,
    }
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"saved {manifest_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
