import os
import sys
import zipfile
import urllib.request
import json
import shutil
import subprocess

POB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "PathOfBuilding")
LUAJIT_PATH = os.path.join(POB_DIR, "luajit.exe")

def get_latest_pob_release_url():
    url = "https://api.github.com/repos/PathOfBuildingCommunity/PathOfBuilding/releases/latest"
    req = urllib.request.Request(url, headers={"User-Agent": "0xAiPOEHelper-Setup"})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            for asset in data.get("assets", []):
                name = asset.get("name", "")
                if "Portable" in name and name.endswith(".zip"):
                    return asset.get("browser_download_url")
    except Exception as e:
        print(f"Error fetching release info: {e}")
    return None

def download_and_extract_pob():
    if os.path.exists(POB_DIR) and (os.path.exists(os.path.join(POB_DIR, "src", "HeadlessWrapper.lua")) or os.path.exists(os.path.join(POB_DIR, "HeadlessWrapper.lua"))):
        print(f"[+] PoB directory already exists at: {POB_DIR}")
        return True

    print("[*] Fetching latest Path of Building Community Portable release...")
    download_url = get_latest_pob_release_url()
    
    if not download_url:
        print("[!] Could not get release URL, falling back to cloning repository...")
        return clone_pob_repo()

    zip_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pob_portable.zip")
    print(f"[*] Downloading from {download_url}...")
    
    try:
        urllib.request.urlretrieve(download_url, zip_path)
        print("[+] Download complete. Extracting ZIP...")
        
        os.makedirs(POB_DIR, exist_ok=True)
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(POB_DIR)
            
        os.remove(zip_path)
        print(f"[+] PoB Portable extracted to {POB_DIR}")
        return True
    except Exception as e:
        print(f"[!] Download/Extraction failed: {e}")
        return clone_pob_repo()

def clone_pob_repo():
    print("[*] Cloning PathOfBuildingCommunity/PathOfBuilding repository...")
    repo_url = "https://github.com/PathOfBuildingCommunity/PathOfBuilding.git"
    try:
        subprocess.run(["git", "clone", "--depth", "1", repo_url, POB_DIR], check=True)
        print("[+] Repository cloned successfully.")
        return True
    except Exception as e:
        print(f"[!] Git clone failed: {e}")
        return False

def main():
    print("=== Path of Building Setup ===")
    success = download_and_extract_pob()
    if success:
        print("[+] PoB Setup Completed Successfully!")
    else:
        print("[!] Setup failed.")

if __name__ == "__main__":
    main()
