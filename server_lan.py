from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse
import socket, json, os

PORT=8000
DB_FILE=os.path.join(os.path.dirname(__file__),"data","database.json")
DEFAULT={"laptops":[],"parts":[],"sales":[],"modelImages":{}}
os.makedirs(os.path.dirname(DB_FILE),exist_ok=True)

def read_db():
    try:
        with open(DB_FILE,"r",encoding="utf-8") as f: return json.load(f)
    except Exception: return DEFAULT.copy()

def write_db(data):
    tmp=DB_FILE+".tmp"
    with open(tmp,"w",encoding="utf-8") as f: json.dump(data,f,ensure_ascii=False)
    os.replace(tmp,DB_FILE)


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control","no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma","no-cache")
        super().end_headers()

    def log_message(self, format, *args):
        print(f"[{self.client_address[0]}] " + format % args)

    def do_GET(self):
        if self.path.split("?",1)[0]=="/api/ping":
            body=b'{"ok":true,"server":"LAPTOP VE CHAI .COM","shared":true}'
            self.send_response(200); self.send_header("Content-Type","application/json"); self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body); return
        if self.path.split("?",1)[0]=="/api/db":
            body=json.dumps(read_db(),ensure_ascii=False).encode("utf-8")
            self.send_response(200); self.send_header("Content-Type","application/json; charset=utf-8"); self.send_header("Cache-Control","no-store"); self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body); return
        return super().do_GET()
    def do_POST(self):
        if self.path.split("?",1)[0]=="/api/db":
            try:
                n=int(self.headers.get("Content-Length","0")); data=json.loads(self.rfile.read(n).decode("utf-8")); write_db(data)
                body=b'{"ok":true}'
                self.send_response(200); self.send_header("Content-Type","application/json"); self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body)
            except Exception as e:
                body=json.dumps({"ok":False,"error":str(e)}).encode(); self.send_response(400); self.send_header("Content-Type","application/json"); self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body)
            return
        self.send_error(404)

def local_ip():
    s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
    try: s.connect(("8.8.8.8",80)); return s.getsockname()[0]
    except Exception: return "127.0.0.1"
    finally: s.close()

if not os.path.exists(DB_FILE): write_db(DEFAULT)
ip=local_ip()
print("\n"+"="*60); print(" LAPTOP VE CHAI .COM - LAN + KHO DUNG CHUNG"); print("="*60)
print(f"\nMay tinh:  http://127.0.0.1:{PORT}")
print(f"Dien thoai: http://{ip}:{PORT}")
print("\nMay tinh va dien thoai phai cung Wi-Fi.")
print("Du lieu kho luu tai: data/database.json")
print("KHO CHUNG: moi luu tu dien thoai/PC se ghi vao data/database.json"); print("Nhan Ctrl+C de dung server."); print("="*60+"\n")
ThreadingHTTPServer(("0.0.0.0",PORT),Handler).serve_forever()
