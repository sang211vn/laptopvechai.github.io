
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pathlib import Path
import sqlite3, hashlib, secrets, json, time

BASE = Path(__file__).resolve().parent
ROOT = BASE.parent
DB = BASE / "laptopvechai.db"

app = FastAPI(title="LAPTOP VE CHAI API", version="0.2.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

def db():
    con=sqlite3.connect(DB); con.row_factory=sqlite3.Row; return con

def init_db():
    con=db()
    con.executescript("""
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL, display_name TEXT DEFAULT '',
      role TEXT DEFAULT 'admin', created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS app_state(
      id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)
    con.commit(); con.close()
init_db()

sessions={}
def pw_hash(password):
    salt=secrets.token_bytes(16)
    d=hashlib.scrypt(password.encode(),salt=salt,n=2**14,r=8,p=1)
    return salt.hex()+":"+d.hex()
def pw_check(password,stored):
    try:
        s,d=stored.split(":",1); salt=bytes.fromhex(s)
        got=hashlib.scrypt(password.encode(),salt=salt,n=2**14,r=8,p=1)
        return secrets.compare_digest(got.hex(),d)
    except Exception:return False

class Setup(BaseModel):
    username:str; password:str; display_name:str=""
class Login(BaseModel):
    username:str; password:str
class State(BaseModel):
    data:dict

def require_token(token):
    if not token or token not in sessions: raise HTTPException(401,"Phiên đăng nhập không hợp lệ.")
    return sessions[token]

@app.get("/api/ping")
def ping(): return {"ok":True,"service":"laptopvechai","version":app.version}

@app.get("/api/health")
def health(): return {"ok":True,"service":"laptopvechai","version":app.version}

@app.get("/api/setup/status")
def setup_status():
    con=db(); n=con.execute("SELECT COUNT(*) c FROM users").fetchone()["c"]; con.close()
    return {"initialized":n>0}

@app.post("/api/setup")
def setup(x:Setup):
    if len(x.username.strip())<3 or len(x.password)<6: raise HTTPException(400,"Tên đăng nhập tối thiểu 3 ký tự, mật khẩu tối thiểu 6 ký tự.")
    con=db()
    try:
        if con.execute("SELECT COUNT(*) c FROM users").fetchone()["c"]>0: raise HTTPException(409,"Tài khoản Admin đã được tạo.")
        con.execute("INSERT INTO users(username,password_hash,display_name,role) VALUES(?,?,?,?)",
                    (x.username.strip().lower(),pw_hash(x.password),x.display_name.strip() or x.username,"admin"))
        con.commit()
    finally: con.close()
    return {"ok":True}

@app.post("/api/login")
def login(x:Login):
    con=db(); row=con.execute("SELECT id,username,password_hash,display_name,role FROM users WHERE username=?",
                             (x.username.strip().lower(),)).fetchone(); con.close()
    if not row or not pw_check(x.password,row["password_hash"]): raise HTTPException(401,"Tên đăng nhập hoặc mật khẩu không đúng.")
    token=secrets.token_urlsafe(32); sessions[token]={"id":row["id"],"username":row["username"],"display_name":row["display_name"],"role":row["role"]}
    return {"ok":True,"token":token,"user":{"id":row["id"],"username":row["username"],"display_name":row["display_name"],"role":row["role"]}}

@app.get("/api/db")
def get_db(x_auth_token: str|None=Header(default=None)):
    require_token(x_auth_token)
    con=db(); row=con.execute("SELECT payload FROM app_state WHERE id=1").fetchone(); con.close()
    if not row: return {"laptops":[],"parts":[],"sales":[],"partSales":[],"repairs":[],"trash":[],"modelImages":{},"modelSpecs":{}}
    return json.loads(row["payload"])

@app.post("/api/db")
def put_db(state:State, x_auth_token: str|None=Header(default=None)):
    require_token(x_auth_token)
    payload=json.dumps(state.data,ensure_ascii=False)
    con=db(); con.execute("INSERT INTO app_state(id,payload,updated_at) VALUES(1,?,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,updated_at=CURRENT_TIMESTAMP",(payload,)); con.commit(); con.close()
    return {"ok":True}

# Serve the existing Cyber PRO frontend from the same server.
app.mount("/", StaticFiles(directory=str(ROOT), html=True), name="frontend")
