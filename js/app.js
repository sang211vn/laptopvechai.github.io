// V4.66 FIX: TL only appears in Thanh lý; hide giá gốc on sales screens.\nconst CLEAN_BUILD=false;
const KEY="laptop_ve_chai_com_online_v4_62";
const UI_KEY="laptop_ve_chai_ui_settings_v4_60_clean";
const DEFAULT_MENU_BUTTONS={
  dashboard:{bg:"#172338",border:"#2563eb",text:"#ffffff",hover:"#2563eb"},
  import:{bg:"#071827",border:"#1d4164",text:"#d8e9f8",hover:"#164a78"},
  parts:{bg:"#071827",border:"#1d4164",text:"#d8e9f8",hover:"#164a78"},
  stock:{bg:"#071827",border:"#1d4164",text:"#d8e9f8",hover:"#164a78"},
  sales:{bg:"#071827",border:"#1d4164",text:"#d8e9f8",hover:"#164a78"},
  partSales:{bg:"#071827",border:"#1d4164",text:"#d8e9f8",hover:"#164a78"},
  repairs:{bg:"#071827",border:"#1d4164",text:"#d8e9f8",hover:"#164a78"},
  liquidation:{bg:"#071827",border:"#1d4164",text:"#d8e9f8",hover:"#164a78"},
  history:{bg:"#071827",border:"#1d4164",text:"#d8e9f8",hover:"#164a78"},
  statistics:{bg:"#071827",border:"#1d4164",text:"#d8e9f8",hover:"#164a78"},
  settings:{bg:"#071827",border:"#1d4164",text:"#d8e9f8",hover:"#164a78"}
};
const DEFAULT_UI_SETTINGS={theme:"dark",accent:"blue",fontSize:"medium",density:"normal",sidebar:"normal",animations:true,storeName:"LAPTOP VE CHAI .COM",phone:"",address:"",website:"",receiptTitle:"PHIẾU BÁN HÀNG",receiptFooter:"Cảm ơn quý khách đã mua hàng!",paper:"A4",showLogo:true,showCost:false,showWarranty:true,backgroundImage:"",backgroundFit:"cover",backgroundOpacity:18,homeButtonBg:"#172338",homeButtonBorder:"#2563eb",homeButtonText:"#ffffff",homeButtonHover:"#2563eb",menuButtons:DEFAULT_MENU_BUTTONS};
let uiSettings=(()=>{try{return {...DEFAULT_UI_SETTINGS,...JSON.parse(localStorage.getItem(UI_KEY)||"{}")} }catch(e){return {...DEFAULT_UI_SETTINGS}}})();
function saveUISettings(){localStorage.setItem(UI_KEY,JSON.stringify(uiSettings));applyUISettings();}
function applyUISettings(){
  const d=document.documentElement, b=document.body; if(!b)return;
  d.dataset.theme=uiSettings.theme; d.dataset.accent=uiSettings.accent; d.dataset.font=uiSettings.fontSize; d.dataset.density=uiSettings.density; d.dataset.sidebar=uiSettings.sidebar; d.dataset.animations=uiSettings.animations?"on":"off";
  b.style.setProperty("--home-btn-bg",uiSettings.homeButtonBg||"#172338");
  b.style.setProperty("--home-btn-border",uiSettings.homeButtonBorder||"#2563eb");
  b.style.setProperty("--home-btn-text",uiSettings.homeButtonText||"#ffffff");
  b.style.setProperty("--home-btn-hover",uiSettings.homeButtonHover||"#2563eb");
  const menuButtons={...DEFAULT_MENU_BUTTONS,...(uiSettings.menuButtons||{})};
  document.querySelectorAll(".sidebar .nav").forEach(btn=>{
    const cfg=menuButtons[btn.dataset.page]||DEFAULT_MENU_BUTTONS[btn.dataset.page]||DEFAULT_MENU_BUTTONS.import;
    btn.style.setProperty("--nav-bg",cfg.bg); btn.style.setProperty("--nav-border",cfg.border); btn.style.setProperty("--nav-text",cfg.text); btn.style.setProperty("--nav-hover",cfg.hover);
  });
  b.style.setProperty("--accent",({blue:"#2563eb",purple:"#7c3aed",green:"#16a34a",orange:"#f59e0b",red:"#dc2626",cyan:"#0891b2"}[uiSettings.accent]||"#2563eb"));
  // V4.45 - ảnh nền cá nhân hóa
  if(uiSettings.backgroundImage){
    const opacity=Math.max(0,Math.min(80,Number(uiSettings.backgroundOpacity??18)))/100;
    const overlay=uiSettings.theme==="light"?`rgba(255,255,255,${Math.min(.82,opacity+.12)})`:`rgba(7,13,25,${opacity})`;
    b.style.backgroundImage=`linear-gradient(${overlay},${overlay}),url(${uiSettings.backgroundImage})`;
    b.style.backgroundSize=uiSettings.backgroundFit==="contain"?"contain":(uiSettings.backgroundFit==="repeat"?"auto":"cover");
    b.style.backgroundPosition="center center";
    b.style.backgroundRepeat=uiSettings.backgroundFit==="repeat"?"repeat":"no-repeat";
    b.style.backgroundAttachment="fixed";
  }else{
    b.style.backgroundImage=""; b.style.backgroundSize=""; b.style.backgroundPosition=""; b.style.backgroundRepeat=""; b.style.backgroundAttachment="";
  }
}

// V4.48+ ACCOUNT & SECURITY PRO
const AUTH_KEY="laptop_ve_chai_accounts_v4_60_clean";
const SESSION_KEY="laptop_ve_chai_session_v4_60_clean";
let currentUser=null;
function getAccounts(){
  try{return JSON.parse(localStorage.getItem(AUTH_KEY)||"[]")}catch(e){return []}
}
function saveAccounts(a){localStorage.setItem(AUTH_KEY,JSON.stringify(a));}
function escapeAttr(v){return String(v??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
async function hashPassword(password){
  const text=String(password||"");
  if(window.crypto?.subtle){
    const data=new TextEncoder().encode(text);
    const hash=await crypto.subtle.digest("SHA-256",data);
    return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
  }
  // fallback for older/offline browsers
  let h=2166136261; for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)} return (h>>>0).toString(16);
}
function authSession(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null")}catch(e){return null}}
function setSession(u){currentUser={username:u.username,name:u.name,role:u.role};sessionStorage.setItem(SESSION_KEY,JSON.stringify(currentUser));}
function clearSession(){currentUser=null;sessionStorage.removeItem(SESSION_KEY);}
function roleLabel(r){return r==="admin"?"Quản trị viên":r==="staff"?"Nhân viên":"Xem kho"}
function canManageAccounts(){return currentUser?.role==="admin"}
function authUserChip(){
  const el=document.querySelector(".cyberUser"); if(!el)return;
  if(currentUser){el.innerHTML=`<span class="authAvatar">${escapeHtml((currentUser.name||currentUser.username||"U").slice(0,2).toUpperCase())}</span><b>${escapeHtml(currentUser.name||currentUser.username)}</b><small>${escapeHtml(roleLabel(currentUser.role))}</small>`;}
}
const REMEMBERED_USERS_KEY="laptop_ve_chai_remembered_users_v4_60_clean";
function getRememberedUsers(){
  try{
    const a=JSON.parse(localStorage.getItem(REMEMBERED_USERS_KEY)||"[]");
    return Array.isArray(a)?a.filter(Boolean).map(String):[];
  }catch(e){return []}
}
function saveRememberedUsers(list){
  const clean=[...new Set((list||[]).map(v=>String(v||"").trim().toLowerCase()).filter(Boolean))].slice(0,20);
  localStorage.setItem(REMEMBERED_USERS_KEY,JSON.stringify(clean));
}
function rememberUsername(username,remember){
  const u=String(username||"").trim().toLowerCase();
  const list=getRememberedUsers().filter(x=>x!==u);
  if(remember && u) list.unshift(u);
  saveRememberedUsers(list);
}
function showLogin(firstRun=false){
  const root=document.getElementById("authRoot"); if(!root)return;
  const remembered=getRememberedUsers();
  const rememberedOptions=remembered.map(u=>`<option value="${escapeAttr(u)}"></option>`).join("");
  root.innerHTML=`<div class="authOverlay"><div class="authBox cyberPanel">
    <div class="authLogo"><img src="assets/robot_logo.png"><div><b>LAPTOP VE CHAI</b><small>.COM</small></div></div>
    <h1>${firstRun?"Tạo tài khoản quản trị":"Đăng nhập"}</h1>
    <p>${firstRun?"Tạo tài khoản Admin đầu tiên trên máy chủ.":"Đăng nhập vào hệ thống online."}</p>
    <div class="authField"><label>Tên đăng nhập</label>
      <input id="authUsername" list="rememberedUserList" autocomplete="username" placeholder="Chọn hoặc nhập tên đăng nhập">
      <datalist id="rememberedUserList">${rememberedOptions}</datalist>
    </div>
    ${!firstRun?`<label class="authRemember"><input type="checkbox" id="rememberUsername" ${remembered.length?"checked":""}> <span>💾 Nhớ tên đăng nhập</span></label>`:""}
    <div class="authField"><label>Mật khẩu</label><input id="authPassword" type="password" autocomplete="current-password" placeholder="Nhập mật khẩu"></div>
    ${firstRun?`<div class="authField"><label>Họ tên hiển thị</label><input id="authName" placeholder="Quản trị viên"></div><div class="authField"><label>Nhập lại mật khẩu</label><input id="authPassword2" type="password" placeholder="Nhập lại mật khẩu"></div>`:""}
    <div id="authError" class="authError"></div>
    <button class="btn blue authSubmit" id="authSubmit">${firstRun?"🚀 TẠO TÀI KHOẢN & ĐĂNG NHẬP":"🔐 ĐĂNG NHẬP"}</button>
    ${!firstRun?`<div class="authHint">Tên đăng nhập được nhớ cục bộ; mật khẩu không được lưu trên trình duyệt.</div>`:""}
  </div></div>`;
  const usernameEl=document.getElementById("authUsername");
  const rememberEl=document.getElementById("rememberUsername");
  if(usernameEl && remembered.length) usernameEl.value=remembered[0];
  const submit=async()=>{
    const username=String(usernameEl?.value||"").trim();
    const password=String(document.getElementById("authPassword")?.value||"");
    const err=document.getElementById("authError");
    if(!username||password.length<6){err.textContent="Vui lòng nhập tên đăng nhập và mật khẩu từ 6 ký tự.";return;}
    try{
      if(serverReady){
        if(firstRun){
          const p2=String(document.getElementById("authPassword2")?.value||"");
          if(password!==p2){err.textContent="Hai mật khẩu không giống nhau.";return;}
          const name=String(document.getElementById("authName")?.value||username).trim()||username;
          const r=await fetch("/api/setup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password,display_name:name})});
          if(!r.ok) throw new Error((await r.json()).detail||"Không tạo được tài khoản");
        }
        const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
        if(!r.ok) throw new Error((await r.json()).detail||"Đăng nhập thất bại");
        const data=await r.json();
        sessionStorage.setItem("LVC_API_TOKEN",data.token);
        currentUser={username:data.user.username,name:data.user.display_name||data.user.username,role:data.user.role};
        sessionStorage.setItem(SESSION_KEY,JSON.stringify(currentUser));
        rememberUsername(currentUser.username,!!rememberEl?.checked);
        root.innerHTML=""; authUserChip(); await enterAppAfterLogin(); return;
      }
      // Offline fallback
      const accounts=getAccounts();
      if(firstRun){
        if(accounts.length){showLogin(false);return;}
        const p2=String(document.getElementById("authPassword2")?.value||"");
        if(password!==p2){err.textContent="Hai mật khẩu không giống nhau.";return;}
        const name=String(document.getElementById("authName")?.value||username).trim()||username;
        accounts.push({username:username.toLowerCase(),name,role:"admin",passwordHash:await hashPassword(password),createdAt:new Date().toISOString()});
        saveAccounts(accounts); setSession(accounts[0]);
      }else{
        const acc=accounts.find(a=>a.username.toLowerCase()===username.toLowerCase());
        if(!acc || acc.passwordHash!==await hashPassword(password)){err.textContent="Tên đăng nhập hoặc mật khẩu không đúng.";return;}
        rememberUsername(acc.username,!!rememberEl?.checked); setSession(acc);
      }
      root.innerHTML=""; authUserChip(); await enterAppAfterLogin();
    }catch(e){err.textContent=e.message||"Không kết nối được máy chủ.";}
  };
  document.getElementById("authSubmit")?.addEventListener("click",submit);
  root.querySelectorAll("input").forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter")submit()}));
}
async function enterAppAfterLogin(){
  // Sau khi đăng nhập, initApp() trước đó đã dừng ở requireAuth().
  // Vì vậy phải khởi tạo lại menu + dữ liệu + trang chủ ngay tại đây.
  try{
    await pingServer();
    await loadSharedDB();
  }catch(e){ console.warn("Post-login init failed",e); }
  nav();
  await show("dashboard");
  const clock=document.getElementById("clock");
  if(clock){
    clock.textContent=new Date().toLocaleString("vi-VN");
    if(!window.__lvcClock){
      window.__lvcClock=setInterval(()=>{clock.textContent=new Date().toLocaleString("vi-VN")},1000);
    }
  }
}
function logout(){clearSession();sessionStorage.removeItem("LVC_API_TOKEN");showLogin(false);}
async function requireAuth(){
  if(serverReady){
    try{
      const status=await serverSetupStatus();
      const token=sessionStorage.getItem("LVC_API_TOKEN");
      if(token){
        const s=authSession();
        if(s){currentUser=s;authUserChip();return true;}
      }
      showLogin(!status.initialized); return false;
    }catch(e){ console.warn("Server auth unavailable",e); }
  }
  const accounts=getAccounts(); const session=authSession();
  if(session){currentUser=session;authUserChip();return true;}
  if(!accounts.length){showLogin(true);return false;}
  showLogin(false);return false;
}
function accountSettingsSection(){
  const changeCard=`<div class="settingsCard"><h3>🔐 Đổi mật khẩu</h3><p class="muted">Đổi mật khẩu cho tài khoản đang đăng nhập: <b>${escapeHtml(currentUser?.username||"")}</b></p><div class="formgrid"><div class="field"><label>Mật khẩu hiện tại</label><input id="currentPass" type="password" autocomplete="current-password" placeholder="Nhập mật khẩu hiện tại"></div><div class="field"><label>Mật khẩu mới</label><input id="newPass" type="password" autocomplete="new-password" placeholder="Tối thiểu 4 ký tự"></div><div class="field"><label>Nhập lại mật khẩu mới</label><input id="newPass2" type="password" autocomplete="new-password" placeholder="Nhập lại mật khẩu mới"></div></div><button class="btn green" id="changePassword">🔐 ĐỔI MẬT KHẨU</button></div>`;
  if(!canManageAccounts()) return `<section class="settingsSection" data-section="accounts"><h2>👤 Tài khoản & bảo mật</h2><p class="muted">Quản lý tài khoản đang sử dụng phần mềm.</p>${changeCard}<div class="settingsCard"><h3>🔒 Phiên đăng nhập</h3><button class="btn orange" id="logoutAccount">🚪 ĐĂNG XUẤT</button></div></section>`;
  const rows=getAccounts().map((a)=>{ const action=a.username!==currentUser?.username ? `<button class="btn orange smallBtn" data-reset-account="${escapeAttr(a.username)}">Đặt lại MK</button> <button class="btn red smallBtn" data-delete-account="${escapeAttr(a.username)}">Xóa</button>` : `<span class="accountCurrent">Đang đăng nhập</span>`; return `<div class="accountRow"><div><b>${escapeHtml(a.name||a.username)}</b><small>@${escapeHtml(a.username)} · ${escapeHtml(roleLabel(a.role))}</small></div><div class="accountActions">${action}</div></div>`; }).join("");
  return `<section class="settingsSection" data-section="accounts"><h2>👤 Tài khoản & bảo mật</h2><p class="muted">Quản lý tài khoản sử dụng phần mềm trên máy này.</p>
    ${changeCard}
    <div class="settingsCard"><h3>➕ Tạo tài khoản</h3><div class="formgrid"><div class="field"><label>Tên đăng nhập</label><input id="newAccUser" placeholder="nhanvien01"></div><div class="field"><label>Họ tên</label><input id="newAccName" placeholder="Nhân viên bán hàng"></div><div class="field"><label>Mật khẩu</label><input id="newAccPass" type="password" placeholder="Tối thiểu 4 ký tự"></div><div class="field"><label>Quyền</label><select id="newAccRole"><option value="staff">Nhân viên</option><option value="viewer">Xem kho</option><option value="admin">Quản trị viên</option></select></div></div><button class="btn blue" id="createAccount">👤 TẠO TÀI KHOẢN</button></div>
    <div class="settingsCard"><h3>👥 Danh sách tài khoản</h3><div class="accountList">${rows||'<div class="empty">Chưa có tài khoản</div>'}</div></div>
    <div class="settingsCard"><h3>🔒 Phiên đăng nhập</h3><button class="btn orange" id="logoutAccount">🚪 ĐĂNG XUẤT</button></div>
  </section>`;
}

let db=JSON.parse(localStorage.getItem(KEY)||'{"laptops":[],"parts":[],"sales":[],"partSales":[],"repairs":[],"liquidations":[],"trash":[]}'); db.laptops=db.laptops||[]; db.parts=db.parts||[]; db.sales=db.sales||[]; db.partSales=db.partSales||[]; db.repairs=db.repairs||[]; db.liquidations=db.liquidations||[]; db.trash=db.trash||[]; db.modelImages=db.modelImages||{}; db.modelSpecs=db.modelSpecs||{};

// V4.0 - THƯ VIỆN ẢNH MODEL CÓ SẴN
const REAL_LOWRES_IMAGES = {
  "LAPTOP|Dell|Inspiron 15": "assets/model-images/real-lowres/dell-inspiron-15-3000.jpg",
  "PART|RAM|Samsung|DDR3 4GB": "assets/model-images/real-lowres/samsung-ddr3-4gb.webp"
};

const PRELOADED_MODEL_IMAGES = {
  "LAPTOP|Dell|Inspiron 14": "assets/model-images/Dell/Inspiron 14.webp",
  "LAPTOP|Dell|Inspiron 15": "https://cdn.tgdd.vn/Products/Images/44/321192/dell-inspiron-15-3520-i5-25p231-1-2.jpg",
  "LAPTOP|HP|HP 255": "https://uae.microless.com/cdn-cgi/image/width=1000,quality=85,format=auto/https://microless.com/cdn/products/7j034aa-bh5.jpg",
  "LAPTOP|Lenovo|ThinkPad T480": "https://p2-ofp.static.pub/ShareResource/na/products/thinkpad/t480/gallery/large/1.jpg"
};

function makeAutoProductImage(kind, brand, model, type) {
  const b=String(brand||"").trim(), m=String(model||"").trim(), t=String(type||"").trim();
  const isPart=kind==="PART";
  const title=isPart ? (t||"LINH KIỆN") : "LAPTOP";
  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const safeB=esc(b||"Khác"), safeM=esc(m||"Model");
  const svg=isPart ? `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
    <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#111827"/><stop offset="1" stop-color="#243b63"/></linearGradient></defs>
    <rect width="900" height="600" rx="28" fill="url(#g)"/>
    <text x="55" y="70" fill="#8ab4ff" font-family="Arial" font-size="28" font-weight="700">${esc(title)}</text>
    <rect x="230" y="150" width="440" height="250" rx="28" fill="#0b1220" stroke="#6ea8ff" stroke-width="6"/>
    <circle cx="450" cy="275" r="72" fill="#1d4ed8" opacity=".9"/>
    <path d="M410 275h80M450 235v80" stroke="white" stroke-width="12" stroke-linecap="round"/>
    <rect x="165" y="420" width="570" height="32" rx="16" fill="#334155"/>
    <text x="450" y="505" text-anchor="middle" fill="white" font-family="Arial" font-size="30" font-weight="700">${safeB}</text>
    <text x="450" y="548" text-anchor="middle" fill="#cbd5e1" font-family="Arial" font-size="24">${safeM}</text>
  </svg>` : `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
    <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#101827"/><stop offset="1" stop-color="#263d64"/></linearGradient></defs>
    <rect width="900" height="600" rx="28" fill="url(#g)"/>
    <text x="55" y="65" fill="#8ab4ff" font-family="Arial" font-size="28" font-weight="700">${safeB}</text>
    <rect x="230" y="115" width="440" height="285" rx="18" fill="#0b1220" stroke="#94a3b8" stroke-width="8"/>
    <rect x="255" y="140" width="390" height="235" rx="10" fill="#182b4a"/>
    <circle cx="450" cy="258" r="34" fill="#3b82f6" opacity=".85"/>
    <path d="M435 258h30M450 243v30" stroke="white" stroke-width="7" stroke-linecap="round"/>
    <path d="M150 420h600l-55 55H205z" fill="#64748b" stroke="#cbd5e1" stroke-width="5"/>
    <text x="450" y="515" text-anchor="middle" fill="white" font-family="Arial" font-size="30" font-weight="700">${safeM}</text>
    <text x="450" y="555" text-anchor="middle" fill="#cbd5e1" font-family="Arial" font-size="22">ẢNH MẪU TỰ ĐỘNG • ${esc(title)}</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
}

function getModelImage(brand, model) {
  const key="LAPTOP|"+String(brand||"").trim()+"|"+String(model||"").trim();
  return REAL_LOWRES_IMAGES[key] || (db.modelImages&&db.modelImages[key]) || PRELOADED_MODEL_IMAGES[key] || "";
}

function getPartImage(type, brand, model) {
  const key="PART|"+String(type||"").trim()+"|"+String(brand||"").trim()+"|"+String(model||"").trim();
  return REAL_LOWRES_IMAGES[key] || (db.modelImages&&db.modelImages[key]) || "";
}

function seedPreloadedModelImages() {
  db.modelImages=db.modelImages||{};
  for(const [key,src] of Object.entries(PRELOADED_MODEL_IMAGES)) {
    if(!db.modelImages[key]) db.modelImages[key]=src;
  }
}
seedPreloadedModelImages();


function getLaptopDisplayImage(x) {
  return x && x.actualImage ? x.actualImage : getModelImage(x?.brand, x?.model);
}
function getPartDisplayImage(x) {
  return x && x.actualImage ? x.actualImage : getPartImage(x?.type, x?.brand, x?.model);
}


function imageError(img, key) {
  img.onerror=null;
  img.removeAttribute("src");
  img.classList.add("image-missing");
  if(key && db.modelImages && db.modelImages[key] && !String(db.modelImages[key]).startsWith("data:")) {
    delete db.modelImages[key];
    save();
  }
}

const $=s=>document.querySelector(s);
const parseMoneyValue=v=>{const s=String(v??"").replace(/[^0-9]/g,"");return s?Number(s):0;};
const money=n=>new Intl.NumberFormat("vi-VN").format(parseMoneyValue(n))+" ₫";
function bindMoneyInputs(root=document){
  const ids=["price","keyboard","screen","ram","ssd","other","partPrice","editPrice","editKeyboard","editScreen","editRam","editSsd","editOther","editPartPrice","salePrice"];
  ids.forEach(id=>{
    const el=root.querySelector ? root.querySelector("#"+id) : document.getElementById(id);
    if(!el) return;
    // Always use text input so Vietnamese thousand separators are visible while typing.
    el.type="text";
    el.inputMode="numeric";
    el.removeAttribute("min");
    if(el.dataset.moneyBound!=="1"){
      el.dataset.moneyBound="1";
      const format=()=>{
        const raw=String(el.value||"").replace(/[^0-9]/g,"");
        if(!raw){el.value="";return;}
        el.value=new Intl.NumberFormat("vi-VN").format(Number(raw));
      };
      el.addEventListener("input",format);
      el.addEventListener("blur",format);
    }
    // Format the current value immediately after the page/modal is rendered.
    const raw=String(el.value||"").replace(/[^0-9]/g,"");
    if(raw) el.value=new Intl.NumberFormat("vi-VN").format(Number(raw));
  });
}
// Safety net for dynamically created price fields. This guarantees that typing 1000000
// becomes 1.000.000 immediately, even when a modal/form is created after navigation.
document.addEventListener("input", e=>{
  const ids=["price","keyboard","screen","ram","ssd","other","partPrice","editPrice","editKeyboard","editScreen","editRam","editSsd","editOther","editPartPrice","salePrice"];
  const el=e.target;
  if(!el || !ids.includes(el.id)) return;
  el.type="text";
  el.inputMode="numeric";
  const raw=String(el.value||"").replace(/[^0-9]/g,"");
  el.value=raw?new Intl.NumberFormat("vi-VN").format(Number(raw)):"";
});
let serverReady=false;
let dbDirty=false;
let syncQueue=Promise.resolve();
let syncVersion=0;

// V4.80: thông báo không chặn việc browser vẽ lại giao diện.
// alert() làm trình duyệt giữ nguyên khung hình cũ cho tới khi hộp thoại đóng,
// khiến người dùng tưởng lịch sử chưa được cập nhật.
function showFastToast(message, type="success"){
  let t=document.getElementById("fastUiToast");
  if(!t){
    t=document.createElement("div");
    t.id="fastUiToast";
    t.style.cssText="position:fixed;right:24px;bottom:24px;z-index:99999;padding:12px 18px;border-radius:10px;background:#16a34a;color:#fff;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,.35);opacity:0;transform:translateY(10px);transition:opacity .16s ease,transform .16s ease;pointer-events:none;";
    document.body.appendChild(t);
  }
  t.textContent=message;
  t.style.background=type==="error"?"#dc2626":"#16a34a";
  requestAnimationFrame(()=>{t.style.opacity="1";t.style.transform="translateY(0)";});
  clearTimeout(t._timer);
  t._timer=setTimeout(()=>{t.style.opacity="0";t.style.transform="translateY(10px)";},1800);
}

async function loadSharedDB(){
  if(CLEAN_BUILD) return;
  if(dbDirty) return;
  const loadToken=syncVersion;
  try{
    const r=await fetch("/api/db",{cache:"no-store",headers:apiHeaders()});
    if(!r.ok) throw new Error("api");
    const remote=await r.json();
    // Quan trọng: không được dùng dữ liệu server cũ để ghi đè thao tác
    // vừa lưu ở trình duyệt trong lúc request GET đang chạy.
    if(dbDirty || loadToken!==syncVersion) return;
    remote.parts=remote.parts||[]; remote.liquidations=remote.liquidations||[]; remote.modelImages=remote.modelImages||{}; remote.modelSpecs=remote.modelSpecs||{}; remote.sales=remote.sales||[]; remote.partSales=remote.partSales||[]; remote.repairs=remote.repairs||[]; remote.trash=remote.trash||[]; remote.laptops=remote.laptops||[];
    const localHas=(db.laptops.length+db.parts.length+db.sales.length+db.partSales.length+db.repairs.length)>0;
    const remoteHas=(remote.laptops.length+remote.parts.length+remote.sales.length+remote.partSales.length+remote.repairs.length+remote.liquidations.length)>0;
    if(remoteHas){ db=remote; localStorage.setItem(KEY,JSON.stringify(db)); }
    else if(localHas){ await pushSharedDB(); }
    else { db=remote; localStorage.setItem(KEY,JSON.stringify(db)); }
    serverReady=true;
  }catch(e){ serverReady=false; console.warn("Shared server unavailable",e); }
}
function pushSharedDB(){
  const version=++syncVersion;
  const snapshot=JSON.stringify(db);
  dbDirty=true;
  localStorage.setItem(KEY,snapshot);

  if(CLEAN_BUILD || (!serverReady && location.protocol!=="http:" && location.protocol!=="https:")){
    if(version===syncVersion) dbDirty=false;
    return Promise.resolve();
  }

  // Xếp hàng các lần đồng bộ để không xảy ra tình trạng lần lưu trước
  // ghi đè lên dữ liệu của lần lưu sau. UI không phải chờ hàng đợi này.
  syncQueue=syncQueue.catch(()=>{}).then(async()=>{
    try{
      const r=await fetch("/api/db",{method:"POST",headers:apiHeaders({"Content-Type":"application/json"}),body:snapshot,cache:"no-store"});
      if(!r.ok) throw new Error("HTTP "+r.status);
      serverReady=true;
    }catch(e){
      console.warn("Could not save shared DB",e);
    }finally{
      if(version===syncVersion) dbDirty=false;
    }
  });
  return syncQueue;
}

// V4.80: LƯU THẬT SỰ KHÔNG CHẶN UI.
// Không JSON.stringify/localStorage/fetch ngay trong click handler vì DB có thể
// chứa ảnh base64 rất lớn. Những thao tác đồng bộ đó có thể giữ main thread,
// khiến người dùng phải chuyển trang mới thấy dòng lịch sử.
// Chỉ đánh dấu dirty + tăng version ngay lập tức để GET nền không thể ghi đè
// dữ liệu mới; sau khi browser có cơ hội paint 1 frame mới snapshot + POST.
let savePaintTimer=null;
function save(){
  dbDirty=true;
  syncVersion++;
  clearTimeout(savePaintTimer);
  savePaintTimer=requestAnimationFrame(()=>{
    savePaintTimer=setTimeout(()=>{
      try{
        // Snapshot sau khi UI đã được vẽ, không chặn thao tác click/render.
        const snapshot=JSON.stringify(db);
        localStorage.setItem(KEY,snapshot);
        const version=syncVersion;
        if(CLEAN_BUILD || (!serverReady && location.protocol!=="http:" && location.protocol!=="https:")){
          if(version===syncVersion) dbDirty=false;
          return;
        }
        syncQueue=syncQueue.catch(()=>{}).then(async()=>{
          try{
            const r=await fetch("/api/db",{method:"POST",headers:apiHeaders({"Content-Type":"application/json"}),body:snapshot,cache:"no-store"});
            if(!r.ok) throw new Error("HTTP "+r.status);
            serverReady=true;
          }catch(e){
            console.warn("Could not save shared DB",e);
          }finally{
            if(version===syncVersion) dbDirty=false;
          }
        });
      }catch(e){
        console.warn("Background snapshot failed",e);
        dbDirty=false;
      }
    },0);
  });
  return Promise.resolve();
}

function nav(){document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");show(b.dataset.page)})}
window.addEventListener("storage",(e)=>{if(e.key===KEY&&e.newValue){try{db=JSON.parse(e.newValue);db.laptops=db.laptops||[];db.parts=db.parts||[];db.sales=db.sales||[];db.partSales=db.partSales||[];db.repairs=db.repairs||[];db.liquidations=db.liquidations||[];db.liquidationStock=db.liquidationStock||[];db.trash=db.trash||[];if(document.querySelector(".nav.active")?.dataset.page==="dashboard") dashboard();}catch(_){}}});
async function pingServer(){
  try{const r=await fetch("/api/ping",{cache:"no-store"});if(!r.ok)throw new Error();
    serverReady=true;return true;
  }catch(e){serverReady=false;return false}
}
function apiHeaders(extra={}){
  const t=sessionStorage.getItem("LVC_API_TOKEN")||"";
  return {...extra,...(t?{"X-Auth-Token":t}:{})};
}
async function serverSetupStatus(){
  const r=await fetch("/api/setup/status",{cache:"no-store"}); if(!r.ok) throw new Error("setup");
  return await r.json();
}
async function show(p){
  if(p==="statistics"){statisticsPage();return;}

  const titles={dashboard:["Tổng quan","Quản lý cửa hàng laptop"],import:["Nhập kho","Nhập laptop và chi phí sửa chữa"],stock:["Kho hàng","Quản lý toàn bộ laptop và linh kiện còn lại"],parts:["Nhập linh kiện","Nhập màn hình, RAM, SSD, HDD, pin, bàn phím, sạc và linh kiện khác"],library:["Thư viện ảnh","Ảnh mẫu của từng Hãng + Model"],sales:["Bán laptop","Bán laptop và tự động trừ kho"],partSales:["Bán linh kiện","Bán linh kiện và tự động trừ kho"],repairs:["Sửa chữa","Tiếp nhận, theo dõi và tính tiền sửa chữa"],liquidation:["Thanh lý","Thanh lý laptop, linh kiện và thiết bị không còn phù hợp"],history:["Lịch sử giao dịch","Bán laptop, linh kiện và sửa chữa đã lưu"],trash:["Thùng rác","Khôi phục hoặc xóa vĩnh viễn giao dịch"],statistics:["Thống kê","Báo cáo doanh thu, lợi nhuận, kho và sửa chữa"],settings:["Cài đặt","Tùy chỉnh toàn bộ phần mềm"]};
  const render=()=>{
    $("#pageTitle").textContent=titles[p][0];
    $("#pageSub").textContent=titles[p][1];
    ({dashboard:dashboard,import:importPage,stock:stockPage,parts:partsPage,library:libraryPage,sales:salesPage,partSales:partSalesPage,repairs:repairsPage,liquidation:liquidationPage,history:historyPage,trash:trashPage,statistics:statisticsPage,settings:settingsPage}[p]||dashboard)();
    bindMoneyInputs();
  };

  // V4.76: vẽ trang ngay từ DB trong bộ nhớ. Không chặn navigation bởi /api/db.
  render();

  // Nếu không có thay đổi đang chờ đồng bộ, làm mới dữ liệu từ server ở nền.
  // Nếu server trả về dữ liệu mới thì chỉ render lại khi người dùng vẫn đang ở trang này.
  if(serverReady && !dbDirty){
    loadSharedDB().then(()=>{
      if(!dbDirty && document.querySelector(`.nav.active`)?.dataset.page===p) render();
    }).catch(()=>{});
  }
}
function settingsPage(){
  const a=uiSettings.accent;
  const opts=(name,items,current)=>items.map(([v,l])=>`<button type="button" class="setChoice ${current===v?'selected':''}" data-setting="${name}" data-value="${v}">${l}</button>`).join("");
  $("#content").innerHTML=`
  <div class="settingsShell">
    <aside class="settingsNav">
      <div class="settingsProfile"><div class="settingsGear">⚙️</div><div><b>Cài đặt</b><small>Tuỳ chỉnh LAPTOP VE CHAI</small></div></div>
      <button class="settingsTab active" data-tab="personal">🎨 Cá nhân hóa</button>
      <button class="settingsTab" data-tab="store">🏪 Cửa hàng</button>
      <button class="settingsTab" data-tab="print">🖨️ In & phiếu</button>
      <button class="settingsTab" data-tab="data">💾 Dữ liệu</button>
      <button class="settingsTab" data-tab="trash">🗑️ Thùng rác</button>
      <button class="settingsTab" data-tab="accounts">👤 Tài khoản</button>
      <button class="settingsTab" data-tab="about">ℹ️ Hệ thống</button>
    </aside>
    <div class="settingsMain">
      <section class="settingsSection active" data-section="personal">
        <h2>🎨 Cá nhân hóa</h2><p class="muted">Đổi giao diện giống phong cách Windows và phần mềm sẽ ghi nhớ lựa chọn.</p>
        <div class="settingsCard"><h3>Chế độ giao diện</h3><div class="choiceGrid">${opts("theme",[["dark","🌙 Tối"],["light","☀️ Sáng"],["auto","🌓 Tự động"]],uiSettings.theme)}</div></div>
        <div class="settingsCard"><h3>Màu chủ đạo</h3><div class="choiceGrid colorChoices">${opts("accent",[["blue","🔵 Xanh"],["purple","🟣 Tím"],["green","🟢 Xanh lá"],["orange","🟠 Cam"],["red","🔴 Đỏ"],["cyan","🔷 Cyan"]],uiSettings.accent)}</div></div>
        <div class="settingsCard"><h3>Cỡ chữ</h3><div class="choiceGrid">${opts("fontSize",[["small","Nhỏ"],["medium","Vừa"],["large","Lớn"]],uiSettings.fontSize)}</div></div>
        <div class="settingsCard"><h3>Mật độ giao diện</h3><div class="choiceGrid">${opts("density",[["compact","Gọn"],["normal","Tiêu chuẩn"],["comfortable","Thoáng"]],uiSettings.density)}</div></div>
        <div class="settingsCard"><h3>Thanh menu</h3><div class="choiceGrid">${opts("sidebar",[["normal","Icon + chữ"],["compact","Thu gọn"]],uiSettings.sidebar)}</div><label class="toggleRow"><input type="checkbox" id="setAnimations" ${uiSettings.animations?'checked':''}> <span>✨ Bật hiệu ứng chuyển động</span></label></div>
        <div class="settingsCard menuButtonsCard"><h3>🎨 Tùy chỉnh các nút menu</h3><p class="muted">Chọn từng nút bên dưới để đổi màu nền, đường viền, chữ và màu khi rê chuột. Mỗi nút được lưu riêng.</p>
          <div class="menuCustomizeGrid">
            <div class="field"><label>Nút menu</label><select id="menuButtonPage">
              <option value="dashboard">🏠 Trang chủ</option><option value="import">📥 Nhập kho</option><option value="parts">🔧 Nhập linh kiện</option><option value="stock">📦 Kho hàng</option><option value="sales">🛒 Bán laptop</option><option value="partSales">🔩 Bán linh kiện</option><option value="repairs">🛠️ Sửa chữa</option><option value="liquidation">♻️ Thanh lý</option><option value="history">📜 Lịch sử giao dịch</option><option value="statistics">📊 Thống kê</option><option value="settings">⚙️ Cài đặt</option>
            </select></div>
            <div class="menuColorEditor"><div class="field"><label>Màu nền</label><input id="menuBtnBg" type="color"></div><div class="field"><label>Màu đường viền</label><input id="menuBtnBorder" type="color"></div><div class="field"><label>Màu chữ</label><input id="menuBtnText" type="color"></div><div class="field"><label>Màu khi rê chuột</label><input id="menuBtnHover" type="color"></div></div>
          </div>
          <div class="menuButtonPreview"><button type="button" class="nav menuPreviewButton">🏠 Trang chủ</button></div>
          <div class="settingsActions"><button class="btn blue" id="saveMenuButton">💾 LƯU MÀU NÚT ĐANG CHỌN</button><button class="btn orange" id="resetMenuButton">↩️ MẶC ĐỊNH NÚT NÀY</button><button class="btn red" id="resetAllMenuButtons">🔄 ĐẶT LẠI TẤT CẢ NÚT</button></div>
        </div>
        <div class="settingsCard backgroundCard"><h3>🖼️ Ảnh nền phần mềm</h3><p class="muted">Chọn ảnh từ máy tính để làm nền cho toàn bộ phần mềm, giống tính năng cá nhân hóa của Windows.</p>
          <div class="backgroundControls">
            <div class="field full"><label>Chọn ảnh nền</label><input id="setBackground" type="file" accept="image/*"><div class="muted" style="margin-top:6px">Nên chọn JPG/PNG/WebP dưới 4 MB để phần mềm chạy nhẹ.</div></div>
            <div class="field"><label>Kiểu hiển thị</label><select id="setBackgroundFit"><option value="cover">Phủ toàn màn hình</option><option value="contain">Vừa màn hình</option><option value="repeat">Lặp lại</option></select></div>
            <div class="field"><label>Độ mờ nền: <b id="bgOpacityValue">${Number(uiSettings.backgroundOpacity??18)}%</b></label><input id="setBackgroundOpacity" type="range" min="0" max="80" step="1" value="${Number(uiSettings.backgroundOpacity??18)}"></div>
          </div>
          <div class="backgroundPreviewWrap">${uiSettings.backgroundImage?`<img class="backgroundPreview" src="${uiSettings.backgroundImage}" alt="Ảnh nền xem trước">`:`<div class="backgroundEmpty">🖼️ Chưa chọn ảnh nền</div>`}</div>
          <div class="settingsActions"><button class="btn green" id="applyBackground">💾 Lưu & áp dụng ảnh nền</button><button class="btn red" id="removeBackground">🗑️ Xóa ảnh nền</button></div>
        </div>
        <div class="settingsActions"><button class="btn orange" id="resetUI">↩️ Khôi phục giao diện mặc định</button></div>
      </section>
      <section class="settingsSection" data-section="store"><h2>🏪 Thông tin cửa hàng</h2><p class="muted">Thông tin này có thể dùng cho phiếu in sau này.</p>
        <div class="settingsCard formgrid"><div class="field"><label>Tên cửa hàng</label><input id="setStoreName" value="${escapeHtml(uiSettings.storeName)}"></div><div class="field"><label>Số điện thoại</label><input id="setPhone" value="${escapeHtml(uiSettings.phone)}"></div><div class="field full"><label>Địa chỉ</label><input id="setAddress" value="${escapeHtml(uiSettings.address)}"></div><div class="field full"><label>Website / Facebook / Zalo</label><input id="setWebsite" value="${escapeHtml(uiSettings.website)}"></div><div class="field full"><label>Logo cửa hàng</label><input id="setLogo" type="file" accept="image/*"><div class="muted" style="margin-top:6px">Logo sẽ được lưu trên máy trình duyệt này.</div><img id="settingsLogoPreview" class="settingsLogoPreview" style="display:none"></div></div>
        <div class="settingsActions"><button class="btn green" id="saveStore">💾 Lưu thông tin cửa hàng</button></div>
      </section>
      <section class="settingsSection" data-section="print"><h2>🖨️ In & phiếu</h2><p class="muted">Thiết lập mặc định cho các phiếu bán hàng, linh kiện và sửa chữa.</p>
        <div class="settingsCard formgrid"><div class="field"><label>Tiêu đề phiếu</label><input id="setReceiptTitle" value="${escapeHtml(uiSettings.receiptTitle)}"></div><div class="field"><label>Khổ giấy</label><select id="setPaper"><option value="A4">A4</option><option value="A5">A5</option><option value="K80">K80</option></select></div><div class="field full"><label>Chân trang phiếu</label><textarea id="setReceiptFooter">${escapeHtml(uiSettings.receiptFooter)}</textarea></div></div>
        <div class="settingsCard"><h3>Thông tin hiển thị</h3><label class="toggleRow"><input type="checkbox" id="showLogo" ${uiSettings.showLogo?'checked':''}> 🖼️ Hiện logo</label><label class="toggleRow"><input type="checkbox" id="showWarranty" ${uiSettings.showWarranty?'checked':''}> 🛡️ Hiện bảo hành</label><label class="toggleRow"><input type="checkbox" id="showCost" ${uiSettings.showCost?'checked':''}> 💰 Hiện giá vốn trên phiếu (không khuyến nghị)</label></div>
        <div class="settingsActions"><button class="btn green" id="savePrint">💾 Lưu thiết lập in</button></div>
      </section>
      <section class="settingsSection" data-section="trash"><h2>🗑️ Thùng rác</h2><p class="muted">Các giao dịch bạn xóa sẽ được chuyển vào đây, giống Thùng rác của Windows. Bạn có thể phục hồi hoặc xóa vĩnh viễn.</p>
        <div class="settingsDataGrid">
          <div class="settingsCard"><h3>🗑️ Giao dịch đang nằm trong Thùng rác</h3><strong style="font-size:32px;display:block;margin:12px 0">${(db.trash||[]).length}</strong><p class="muted">Gồm đơn bán laptop, đơn bán linh kiện và phiếu sửa chữa đã xóa.</p><button class="btn orange" id="openTrashFromSettings">🗑️ MỞ THÙNG RÁC</button></div>
          <div class="settingsCard"><h3>↩️ Phục hồi & xóa</h3><p class="muted">Mở Thùng rác để phục hồi đơn xóa nhầm hoặc xóa vĩnh viễn khi không cần nữa.</p><button class="btn blue" id="openTrashFromSettings2">📂 QUẢN LÝ THÙNG RÁC</button></div>
        </div>
        <div class="settingsCard dangerCard"><h3>⚠️ Lưu ý</h3><p class="muted">Xóa vào Thùng rác chưa phải xóa vĩnh viễn. Khi phục hồi đơn bán, số lượng hàng sẽ được trừ lại khỏi kho theo đúng đơn cũ.</p></div>
      </section>
      <section class="settingsSection" data-section="data"><h2>💾 Dữ liệu</h2><p class="muted">Sao lưu/khôi phục toàn bộ dữ liệu cửa hàng trên máy này.</p>
        <div class="settingsDataGrid"><div class="settingsCard"><h3>📦 Sao lưu</h3><p class="muted">Tải xuống một file JSON chứa dữ liệu và thiết lập.</p><button class="btn blue" id="backupData">⬇️ SAO LƯU DỮ LIỆU</button></div><div class="settingsCard"><h3>📥 Khôi phục</h3><p class="muted">Chọn file sao lưu JSON đã tạo trước đó.</p><input id="restoreFile" type="file" accept="application/json,.json"></div></div>
        <div class="settingsCard dangerCard"><h3>⚠️ Khu vực nguy hiểm</h3><p class="muted">Chỉ xóa dữ liệu khi bạn chắc chắn. Nên sao lưu trước.</p><button class="btn red" id="clearData">🗑️ XÓA TOÀN BỘ DỮ LIỆU</button></div>
      </section>
      ${accountSettingsSection()}
      <section class="settingsSection" data-section="about"><h2>ℹ️ Hệ thống</h2><div class="settingsCard"><div class="systemRow"><b>Phần mềm</b><span>LAPTOP VE CHAI .COM</span></div><div class="systemRow"><b>Phiên bản</b><span>V4.69 — TL + CAMERA + BÁN HÀNG + BILL FIX</span></div><div class="systemRow"><b>Dữ liệu</b><span>${db.laptops.length} laptop · ${db.parts.length} linh kiện · ${(db.sales||[]).length} đơn laptop · ${(db.partSales||[]).length} đơn linh kiện · ${(db.repairs||[]).length} phiếu sửa · ${(db.liquidations||[]).length} phiếu thanh lý</span></div><div class="systemRow"><b>Lưu trữ</b><span>Trình duyệt / Kho chung nếu máy chủ đang kết nối</span></div></div></section>
    </div>
  </div>`;
  const paper=$("#setPaper"); if(paper) paper.value=uiSettings.paper;
  $("#openTrashFromSettings")?.addEventListener("click",()=>show("trash"));
  $("#openTrashFromSettings2")?.addEventListener("click",()=>show("trash"));
  document.querySelectorAll('.settingsTab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.settingsTab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.settingsSection').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.querySelector(`.settingsSection[data-section="${t.dataset.tab}"]`)?.classList.add('active')});
  document.querySelectorAll('.setChoice').forEach(c=>c.onclick=()=>{uiSettings[c.dataset.setting]=c.dataset.value;saveUISettings();settingsPage()});
  const an=$("#setAnimations"); if(an) an.onchange=()=>{uiSettings.animations=an.checked;saveUISettings();};
  const bgFit=$("#setBackgroundFit"); if(bgFit) bgFit.value=uiSettings.backgroundFit||"cover";
  const bgOpacity=$("#setBackgroundOpacity"), bgOpacityValue=$("#bgOpacityValue"); if(bgOpacity){bgOpacity.oninput=()=>{if(bgOpacityValue)bgOpacityValue.textContent=bgOpacity.value+"%";};}
  $("#setBackground")?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;if(!f.type.startsWith('image/')){alert('Vui lòng chọn file ảnh.');return;}if(f.size>4*1024*1024){alert('Ảnh quá lớn. Vui lòng chọn ảnh dưới 4 MB.');e.target.value='';return;}const r=new FileReader();r.onload=()=>{uiSettings.backgroundImage=r.result;settingsPage();};r.readAsDataURL(f);});
  $("#applyBackground")?.addEventListener('click',()=>{uiSettings.backgroundFit=$("#setBackgroundFit")?.value||"cover";uiSettings.backgroundOpacity=Number($("#setBackgroundOpacity")?.value||18);saveUISettings();alert('Đã lưu và áp dụng ảnh nền.');settingsPage();});
  $("#removeBackground")?.addEventListener('click',()=>{if(!uiSettings.backgroundImage){alert('Hiện chưa có ảnh nền.');return;}if(confirm('Xóa ảnh nền hiện tại?')){uiSettings.backgroundImage="";uiSettings.backgroundFit="cover";uiSettings.backgroundOpacity=18;saveUISettings();settingsPage();}});
  const menuSelect=$("#menuButtonPage"), menuPreview=$(".menuPreviewButton");
  const menuLabel={dashboard:"🏠 Trang chủ",import:"📥 Nhập kho",parts:"🔧 Nhập linh kiện",stock:"📦 Kho hàng",sales:"🛒 Bán laptop",partSales:"🔩 Bán linh kiện",repairs:"🛠️ Sửa chữa",liquidation:"♻️ Thanh lý",history:"📜 Lịch sử giao dịch",statistics:"📊 Thống kê",settings:"⚙️ Cài đặt"};
  const menuCfg=()=>{const p=menuSelect?.value||"dashboard";return (uiSettings.menuButtons&&uiSettings.menuButtons[p])||DEFAULT_MENU_BUTTONS[p]||DEFAULT_MENU_BUTTONS.import;};
  const syncMenuEditor=()=>{const c=menuCfg(); if($("#menuBtnBg")) $("#menuBtnBg").value=c.bg; if($("#menuBtnBorder")) $("#menuBtnBorder").value=c.border; if($("#menuBtnText")) $("#menuBtnText").value=c.text; if($("#menuBtnHover")) $("#menuBtnHover").value=c.hover; if(menuPreview){menuPreview.textContent=menuLabel[menuSelect?.value||"dashboard"];menuPreview.style.background=c.bg;menuPreview.style.borderColor=c.border;menuPreview.style.color=c.text;menuPreview.style.setProperty("--menu-preview-hover",c.hover);}};
  ["menuBtnBg","menuBtnBorder","menuBtnText","menuBtnHover"].forEach(id=>$("#"+id)?.addEventListener("input",()=>{const c={bg:$("#menuBtnBg")?.value,border:$("#menuBtnBorder")?.value,text:$("#menuBtnText")?.value,hover:$("#menuBtnHover")?.value}; if(menuPreview){menuPreview.style.background=c.bg;menuPreview.style.borderColor=c.border;menuPreview.style.color=c.text;menuPreview.style.setProperty("--menu-preview-hover",c.hover);}}));
  menuSelect?.addEventListener("change",syncMenuEditor); syncMenuEditor();
  $("#saveMenuButton")?.addEventListener("click",()=>{const p=menuSelect.value;uiSettings.menuButtons={...DEFAULT_MENU_BUTTONS,...(uiSettings.menuButtons||{})};uiSettings.menuButtons[p]={bg:$("#menuBtnBg").value,border:$("#menuBtnBorder").value,text:$("#menuBtnText").value,hover:$("#menuBtnHover").value};saveUISettings();alert("Đã lưu màu cho "+menuLabel[p]+".");settingsPage();});
  $("#resetMenuButton")?.addEventListener("click",()=>{const p=menuSelect.value;uiSettings.menuButtons={...DEFAULT_MENU_BUTTONS,...(uiSettings.menuButtons||{})};uiSettings.menuButtons[p]={...DEFAULT_MENU_BUTTONS[p]};saveUISettings();settingsPage();});
  $("#resetAllMenuButtons")?.addEventListener("click",()=>{if(confirm("Đặt lại màu mặc định cho tất cả các nút menu?")){uiSettings.menuButtons=JSON.parse(JSON.stringify(DEFAULT_MENU_BUTTONS));saveUISettings();settingsPage();}});
  $("#resetUI")?.addEventListener('click',()=>{if(confirm('Khôi phục toàn bộ giao diện về mặc định?')){uiSettings={...DEFAULT_UI_SETTINGS};saveUISettings();settingsPage();}});
  $("#createAccount")?.addEventListener("click",async()=>{
    if(!canManageAccounts())return;
    const username=String($("#newAccUser")?.value||"").trim().toLowerCase(), name=String($("#newAccName")?.value||"").trim()||username, pass=String($("#newAccPass")?.value||""), role=$("#newAccRole")?.value||"staff";
    if(!username||pass.length<4){alert("Nhập tên đăng nhập và mật khẩu từ 4 ký tự.");return;}
    const accounts=getAccounts(); if(accounts.some(a=>a.username===username)){alert("Tên đăng nhập đã tồn tại.");return;}
    accounts.push({username,name,role,passwordHash:await hashPassword(pass),createdAt:new Date().toISOString()}); saveAccounts(accounts); settingsPage();
    document.querySelector('.settingsTab[data-tab="accounts"]')?.click();
  });
  $("#changePassword")?.addEventListener("click",async()=>{
    const current=String($("#currentPass")?.value||""), next=String($("#newPass")?.value||""), next2=String($("#newPass2")?.value||"");
    if(current.length<4||next.length<4){alert("Mật khẩu phải có ít nhất 4 ký tự.");return;}
    if(next!==next2){alert("Hai mật khẩu mới không giống nhau.");return;}
    if(current===next){alert("Mật khẩu mới phải khác mật khẩu hiện tại.");return;}
    const accounts=getAccounts(), idx=accounts.findIndex(a=>a.username===currentUser?.username);
    if(idx<0){alert("Không tìm thấy tài khoản đang đăng nhập.");return;}
    if(accounts[idx].passwordHash!==await hashPassword(current)){alert("Mật khẩu hiện tại không đúng.");return;}
    accounts[idx].passwordHash=await hashPassword(next); accounts[idx].updatedAt=new Date().toISOString(); saveAccounts(accounts);
    alert("Đã đổi mật khẩu thành công."); settingsPage(); document.querySelector('.settingsTab[data-tab="accounts"]')?.click();
  });
  document.querySelectorAll("[data-reset-account]").forEach(btn=>btn.addEventListener("click",async()=>{if(!canManageAccounts())return;const u=btn.dataset.resetAccount;const next=prompt(`Nhập mật khẩu mới cho tài khoản ${u}:`);if(next===null)return;if(String(next).length<4){alert("Mật khẩu phải có ít nhất 4 ký tự.");return;}const accounts=getAccounts();const idx=accounts.findIndex(a=>a.username===u);if(idx<0)return;accounts[idx].passwordHash=await hashPassword(next);accounts[idx].updatedAt=new Date().toISOString();saveAccounts(accounts);alert(`Đã đặt lại mật khẩu cho ${u}.`);settingsPage();document.querySelector('.settingsTab[data-tab="accounts"]')?.click();}));
  document.querySelectorAll("[data-delete-account]").forEach(btn=>btn.addEventListener("click",()=>{if(!canManageAccounts())return;const u=btn.dataset.deleteAccount;if(confirm(`Xóa tài khoản ${u}?`)){saveAccounts(getAccounts().filter(a=>a.username!==u));settingsPage();document.querySelector('.settingsTab[data-tab="accounts"]')?.click();}}));
  $("#logoutAccount")?.addEventListener("click",logout);

  $("#saveStore")?.addEventListener('click',()=>{uiSettings.storeName=$("#setStoreName").value.trim();uiSettings.phone=$("#setPhone").value.trim();uiSettings.address=$("#setAddress").value.trim();uiSettings.website=$("#setWebsite").value.trim();saveUISettings();alert('Đã lưu thông tin cửa hàng.');});
  $("#savePrint")?.addEventListener('click',()=>{uiSettings.receiptTitle=$("#setReceiptTitle").value.trim()||DEFAULT_UI_SETTINGS.receiptTitle;uiSettings.paper=$("#setPaper").value;uiSettings.receiptFooter=$("#setReceiptFooter").value;uiSettings.showLogo=$("#showLogo").checked;uiSettings.showWarranty=$("#showWarranty").checked;uiSettings.showCost=$("#showCost").checked;saveUISettings();alert('Đã lưu thiết lập in.');});
  $("#setLogo")?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{uiSettings.logo=r.result;saveUISettings();alert('Đã lưu logo trên máy này.');};r.readAsDataURL(f);});
  $("#backupData")?.addEventListener('click',()=>{const payload={app:'LAPTOP VE CHAI .COM',version:'V4.44',exportedAt:new Date().toISOString(),db,uiSettings};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='LAPTOP_VE_CHAI_BACKUP_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
  $("#restoreFile")?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=async()=>{try{const p=JSON.parse(r.result);if(!p.db||!Array.isArray(p.db.laptops)||!Array.isArray(p.db.parts))throw new Error();if(!confirm('Khôi phục sẽ thay thế dữ liệu hiện tại. Tiếp tục?'))return;db={...p.db};db.parts=db.parts||[];db.sales=db.sales||[];db.partSales=db.partSales||[];db.repairs=db.repairs||[];db.liquidations=db.liquidations||[];db.liquidationStock=db.liquidationStock||[];db.trash=db.trash||[];db.modelImages=db.modelImages||{};db.modelSpecs=db.modelSpecs||{};if(p.uiSettings)uiSettings={...DEFAULT_UI_SETTINGS,...p.uiSettings};await save();saveUISettings();alert('Đã khôi phục dữ liệu.');show('dashboard');}catch(err){alert('File sao lưu không hợp lệ.');}};r.readAsText(f);});
  $("#clearData")?.addEventListener('click',async()=>{if(!confirm('CẢNH BÁO: Xóa toàn bộ dữ liệu cửa hàng?'))return;if(!confirm('Xác nhận lần cuối: dữ liệu sẽ không thể khôi phục nếu chưa sao lưu.'))return;db={laptops:[],parts:[],sales:[],partSales:[],repairs:[],liquidations:[],trash:[],modelImages:{},modelSpecs:{}};await save();alert('Đã xóa dữ liệu.');show('dashboard');});
}

function dashboard(){
  const statusText=serverReady?"🟢 KHO CHUNG: ĐANG KẾT NỐI":"🔴 KHO CỤC BỘ: CHƯA KẾT NỐI";
  const laptopQty=db.laptops.reduce((a,x)=>a+Math.max(0,Number(x.qty)||0),0);
  const partQty=db.parts.reduce((a,x)=>a+Math.max(0,Number(x.qty)||0),0);
  const totalQty=laptopQty+partQty;
  const laptopRevenue=db.sales.reduce((a,x)=>a+Number(x.total||0),0);
  const partRevenue=db.partSales.reduce((a,x)=>a+Number(x.total||0),0);
  const repairRevenue=db.repairs.reduce((a,x)=>a+Number(x.cost||x.total||0),0);
  const liquidationRevenue=(db.liquidations||[]).reduce((a,x)=>a+Number(x.total||0),0);
  const revenue=laptopRevenue+partRevenue+repairRevenue+liquidationRevenue;
  const salesCount=db.sales.length, partSalesCount=db.partSales.length, repairCount=db.repairs.length, liquidationCount=(db.liquidations||[]).length;
  const recent=[];
  db.sales.slice(-3).forEach(x=>recent.push({type:'sale',icon:'🛒',text:`Bán laptop ${x.model||x.name||'Laptop'}`,time:x.time||x.date||''}));
  db.partSales.slice(-3).forEach(x=>recent.push({type:'part',icon:'🧩',text:`Bán linh kiện ${x.model||x.name||'Linh kiện'}`,time:x.time||x.date||''}));
  db.repairs.slice(-3).forEach(x=>recent.push({type:'repair',icon:'🛠️',text:`Sửa chữa ${x.device||x.model||'Laptop'}`,time:x.time||x.date||''}));
  (db.liquidations||[]).slice(-3).forEach(x=>recent.push({type:'liquidation',icon:'♻️',text:`Thanh lý ${x.item||x.model||'hàng'}`,time:x.time||x.date||''}));
  db.laptops.slice(-2).forEach(x=>recent.push({type:'import',icon:'📥',text:`Nhập kho ${x.brand||''} ${x.model||'Laptop'}`.trim(),time:x.time||x.date||''}));
  db.parts.slice(-2).forEach(x=>recent.push({type:'import',icon:'📦',text:`Nhập linh kiện ${x.model||x.name||'Linh kiện'}`,time:x.time||x.date||''}));
  recent.reverse();
  const recentHtml=recent.slice(0,5).map((r,i)=>`<div class="cyberActivity"><div class="cyberActivityIcon ${r.type}">${r.icon}</div><div><b>${escapeHtml(r.text)}</b><small>${escapeHtml(r.time||'Vừa cập nhật')}</small></div></div>`).join('') || `<div class="cyberEmpty">Chưa có hoạt động gần đây</div>`;
  const bg=uiSettings.backgroundImage?`style="--user-bg:url('${String(uiSettings.backgroundImage).replace(/'/g,"%27")}')"`:'';
  const go=(page,label,icon)=>`<button class="cyberQuick" data-go="${page}"><span>${icon}</span>${label}<b>›</b></button>`;
  $("#content").innerHTML=`
  <div class="cyberDashboard" ${bg}>
    <div class="cyberHeroBar">
      <div class="cyberHeroCore"><span class="cyberCube">⬡</span><div><b>KHO CỬA HÀNG</b><small>${statusText}</small></div></div>
      <button class="cyberSync" id="syncNow">⟳ ĐỒNG BỘ KHO</button>
    </div>
    <div class="cyberLayout">
      <section class="cyberMain">
        <div class="cyberStats">
          <div class="cyberStat blueStat"><div class="statIcon">💻</div><div><label>LAPTOP CÒN</label><strong>${laptopQty}</strong><small>Chiếc</small></div></div>
          <div class="cyberStat purpleStat"><div class="statIcon">▦</div><div><label>LINH KIỆN CÒN</label><strong>${partQty}</strong><small>Món</small></div></div>
          <div class="cyberStat goldStat"><div class="statIcon">📦</div><div><label>TỔNG TỒN KHO</label><strong>${totalQty}</strong><small>Sản phẩm</small></div></div>
          <div class="cyberStat greenStat"><div class="statIcon">₫</div><div><label>DOANH THU</label><strong>${money(revenue)}</strong><small>Tổng doanh thu</small></div></div>
        </div>
        <div class="cyberPanel serviceCyber">
          <div class="cyberSectionTitle"><div><span>⬡</span><div><h2>DỊCH VỤ CỬA HÀNG</h2><p>Dịch vụ đang cung cấp — nhanh chóng, rõ giá, có bảo hành.</p></div></div></div>
          <div class="cyberServices">
            <button class="cyberService laptopService" data-go="sales"><div class="serviceArt laptopArt"><img src="assets/model-images/real-lowres/dell-inspiron-15-3000.jpg" alt="Laptop"></div><div class="serviceCopy"><small>💻 BÁN LAPTOP</small><h3>LAPTOP CŨ GIÁ TỐT</h3><p>Dell • HP • Lenovo • Asus • Acer...</p><b>XEM LAPTOP ĐANG BÁN →</b></div></button>
            <button class="cyberService repairService" data-go="repairs"><div class="serviceArt toolArt">🛠️<em>💻</em></div><div class="serviceCopy"><small>🔧 SỬA LAPTOP</small><h3>SỬA CHỮA & NÂNG CẤP</h3><p>Thay RAM • SSD/HDD • màn hình • bàn phím • sửa cổng...</p><b>TIẾP NHẬN SỬA CHỮA →</b></div></button>
            <button class="cyberService partsService" data-go="partSales"><div class="serviceArt partsArt">▦<em>💾</em></div><div class="serviceCopy"><small>🔩 BÁN LINH KIỆN</small><h3>LINH KIỆN LAPTOP</h3><p>RAM • SSD • HDD • màn hình • pin • sạc • bàn phím...</p><b>XEM LINH KIỆN →</b></div></button>
          </div>
        </div>
        <div class="cyberPanel processCyber">
          <div class="cyberSectionTitle"><div><span>⬡</span><div><h2>QUY TRÌNH</h2><p>Quản lý toàn bộ vòng đời hàng hóa và dịch vụ.</p></div></div></div>
          <div class="cyberProcess">
            ${[['import','Nhập kho','📥'],['repairs','Sửa chữa / nâng cấp','🛠️'],['liquidation','Thanh lý','♻️'],['stock','Giá vốn thực tế','₫'],['stock','Kho','🏬'],['sales','Bán hàng','🛒'],['stock','Tự trừ kho','⬡'],['history','Lịch sử','↻']].map((x,i)=>`<button class="processStep" data-go="${x[0]}"><span>${x[2]}</span><small>${x[1]}</small></button>${i<6?'<i>›</i>':''}`).join('')}
          </div>
        </div>
      </section>
      <aside class="cyberRightRail">
        <div class="cyberPanel quickPanel"><div class="railTitle"><span>⬡</span> THỐNG KÊ NHANH</div><div class="fakeChart"><div class="chartLine"></div><div class="chartGlow"></div><span>01</span><span>05</span><span>10</span><span>15</span><span>18</span></div>
          ${[['Laptop bán ra',salesCount,'+12%','blue'],['Linh kiện bán ra',partSalesCount,'+8%','purple'],['Lượt sửa chữa',repairCount,'+5%','cyan'],['Thanh lý',liquidationCount,'+0%','orange']].map(x=>`<div class="quickMetric"><span>${x[3]==='blue'?'▣':x[3]==='purple'?'▦':'⚒'}</span><b>${x[0]}</b><strong>${x[1]}</strong><em>${x[2]}</em></div>`).join('')}
        </div>
        <div class="cyberPanel activityPanel"><div class="railTitle"><span>⬡</span> HOẠT ĐỘNG GẦN ĐÂY</div>${recentHtml}<button class="cyberViewAll" data-go="history">XEM TẤT CẢ</button></div>
        <div class="cyberPanel quickLinks"><div class="railTitle"><span>⚡</span> TRUY CẬP NHANH</div>${go('import','Nhập kho','📥')}${go('partSales','Bán linh kiện','🔩')}${go('repairs','Sửa chữa','🛠️')}${go('liquidation','Thanh lý','♻️')}${go('statistics','Thống kê','📊')}</div>
      </aside>
    </div>
  </div>`;
  const route=(el)=>{const page=el.dataset.go;if(!page)return;const b=document.querySelector(`.nav[data-page="${page}"]`);if(b){document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));b.classList.add('active');show(page);}};
  document.querySelectorAll('.cyberDashboard [data-go]').forEach(el=>el.addEventListener('click',()=>route(el)));
  const sb=$("#syncNow"); if(sb) sb.onclick=async()=>{await loadSharedDB(); dashboard();};
}

const MODEL_LIST={
"Dell":[
"Inspiron 14","Inspiron 15","Inspiron 1520","Inspiron 1545","Inspiron 1564","Inspiron 15 3000","Inspiron 15 5000","Inspiron 15 7000","Inspiron 14 3000","Inspiron 14 5000",
"Vostro 131","Vostro 1510","Vostro 1520","Vostro 3400","Vostro 3500","Vostro 3510","Vostro 3520","Vostro 3401","Vostro 5402","Vostro 15 3000",
"Latitude D430","Latitude D520","Latitude D620","Latitude D630","Latitude D830","Latitude E4300","Latitude E5410","Latitude E5420","Latitude E5430","Latitude E5440","Latitude E5450","Latitude E5470","Latitude E5480","Latitude E5490",
"Latitude 3300","Latitude 3310","Latitude 3320","Latitude 3400","Latitude 3410","Latitude 3420","Latitude 3430","Latitude 3500","Latitude 3510","Latitude 3520","Latitude 3530","Latitude 5400","Latitude 5410","Latitude 5420","Latitude 5430","Latitude 5440","Latitude 5490","Latitude 5500","Latitude 5510","Latitude 5520","Latitude 5530","Latitude 5540","Latitude 5590","Latitude 7300","Latitude 7310","Latitude 7320","Latitude 7330","Latitude 7340","Latitude 7400","Latitude 7410","Latitude 7420","Latitude 7430","Latitude 7440",
"Precision M4500","Precision M4600","Precision M4800","Precision 3510","Precision 3520","Precision 3530","Precision 3540","Precision 3550","Precision 3551","Precision 3560","Precision 3570","Precision 3580","Precision 3590","Precision 5560","Precision 5570","Precision 5680","Precision 5690",
"XPS 13 9343","XPS 13 9360","XPS 13 9370","XPS 13 9380","XPS 13 7390","XPS 13 9300","XPS 13 9310","XPS 13 9320","XPS 13 9340","XPS 15 9550","XPS 15 9560","XPS 15 9570","XPS 15 7590","XPS 15 9500","XPS 15 9510","XPS 15 9520","XPS 15 9530","XPS 16 9640",
"Alienware M15","Alienware M17","Alienware M15 R2","Alienware M15 R3","Alienware M15 R4","Alienware M15 R5","Alienware M15 R6","Alienware m16","Alienware m18","G3 15","G5 15","G7 15","G15 5510","G15 5511","G15 5520","G15 5530","G16 7630"
],
"HP":[
"HP 14","HP 15","HP 250","HP 255","HP 430","HP 450","HP 630","HP 650","HP 1000","HP 2000",
"Compaq Presario CQ40","Compaq Presario CQ45","Compaq Presario CQ60","Compaq Presario CQ61","Compaq Presario CQ62","Compaq Presario CQ56",
"Pavilion dv4","Pavilion dv5","Pavilion dv6","Pavilion dv7","Pavilion 14","Pavilion 15","Pavilion 15 3000","Pavilion 15 5000","Pavilion 15 7000","Pavilion Aero 13","Pavilion Plus 14","Pavilion Plus 16",
"ProBook 4320s","ProBook 4330s","ProBook 4340s","ProBook 440 G1","ProBook 440 G2","ProBook 440 G3","ProBook 440 G4","ProBook 440 G5","ProBook 440 G6","ProBook 440 G7","ProBook 440 G8","ProBook 440 G9","ProBook 440 G10","ProBook 440 G11",
"ProBook 450 G1","ProBook 450 G2","ProBook 450 G3","ProBook 450 G4","ProBook 450 G5","ProBook 450 G6","ProBook 450 G7","ProBook 450 G8","ProBook 450 G9","ProBook 450 G10","ProBook 450 G11",
"EliteBook 2560p","EliteBook 2570p","EliteBook 8460p","EliteBook 8470p","EliteBook 840 G1","EliteBook 840 G2","EliteBook 840 G3","EliteBook 840 G4","EliteBook 840 G5","EliteBook 840 G6","EliteBook 840 G7","EliteBook 840 G8","EliteBook 840 G9","EliteBook 840 G10","EliteBook 840 G11","EliteBook 840 G1i",
"EliteBook 850 G1","EliteBook 850 G2","EliteBook 850 G3","EliteBook 850 G4","EliteBook 850 G5","EliteBook 850 G6","EliteBook 850 G7","EliteBook 850 G8","EliteBook 850 G9","EliteBook 850 G10","EliteBook 850 G11",
"EliteBook X 360 G1","EliteBook X 360 G2","EliteBook X G1i","EliteBook X G2","EliteBook Ultra G1i","EliteBook Ultra G2",
"ZBook 15 G1","ZBook 15 G2","ZBook 15 G3","ZBook 15 G4","ZBook 15 G5","ZBook 15 G6","ZBook 15 G7","ZBook 15 G8","ZBook 15 G9","ZBook 15 G10","ZBook Fury 16","ZBook Firefly 14","ZBook Power 15",
"Victus 15","Victus 16","OMEN 15","OMEN 16","OMEN 17"
],
"Lenovo":[
"ThinkPad X60","ThinkPad X61","ThinkPad X200","ThinkPad X201","ThinkPad X220","ThinkPad X230","ThinkPad X240","ThinkPad X250","ThinkPad X260","ThinkPad X270","ThinkPad X280","ThinkPad X1 Carbon Gen 1","ThinkPad X1 Carbon Gen 2","ThinkPad X1 Carbon Gen 3","ThinkPad X1 Carbon Gen 4","ThinkPad X1 Carbon Gen 5","ThinkPad X1 Carbon Gen 6","ThinkPad X1 Carbon Gen 7","ThinkPad X1 Carbon Gen 8","ThinkPad X1 Carbon Gen 9","ThinkPad X1 Carbon Gen 10","ThinkPad X1 Carbon Gen 11","ThinkPad X1 Carbon Gen 12","ThinkPad X1 Carbon Gen 13",
"ThinkPad T410","ThinkPad T420","ThinkPad T430","ThinkPad T440","ThinkPad T450","ThinkPad T460","ThinkPad T470","ThinkPad T480","ThinkPad T490","ThinkPad T14 Gen 1","ThinkPad T14 Gen 2","ThinkPad T14 Gen 3","ThinkPad T14 Gen 4","ThinkPad T14 Gen 5","ThinkPad T15 Gen 1","ThinkPad T15 Gen 2","ThinkPad T16 Gen 1","ThinkPad T16 Gen 2","ThinkPad T16 Gen 3",
"ThinkPad E430","ThinkPad E440","ThinkPad E450","ThinkPad E460","ThinkPad E470","ThinkPad E480","ThinkPad E490","ThinkPad E14 Gen 1","ThinkPad E14 Gen 2","ThinkPad E14 Gen 3","ThinkPad E14 Gen 4","ThinkPad E14 Gen 5","ThinkPad E14 Gen 6","ThinkPad E15 Gen 1","ThinkPad E15 Gen 2","ThinkPad E15 Gen 3","ThinkPad E15 Gen 4",
"ThinkPad L440","ThinkPad L450","ThinkPad L460","ThinkPad L470","ThinkPad L480","ThinkPad L490","ThinkPad L14 Gen 1","ThinkPad L14 Gen 2","ThinkPad L14 Gen 3","ThinkPad L14 Gen 4","ThinkPad L14 Gen 5","ThinkPad L15 Gen 1","ThinkPad L15 Gen 2","ThinkPad L15 Gen 3","ThinkPad L15 Gen 4",
"IdeaPad 100","IdeaPad 110","IdeaPad 120","IdeaPad 130","IdeaPad 3","IdeaPad 3i","IdeaPad 5","IdeaPad 5i","IdeaPad Slim 3","IdeaPad Slim 5","IdeaPad Gaming 3",
"ThinkBook 13s","ThinkBook 14","ThinkBook 15","ThinkBook 14 Gen 2","ThinkBook 14 Gen 3","ThinkBook 14 Gen 4","ThinkBook 14 Gen 5","ThinkBook 15 Gen 2","ThinkBook 16 Gen 4","ThinkBook 16 Gen 6",
"Yoga 11e","Yoga 300","Yoga 510","Yoga 520","Yoga 530","Yoga 6","Yoga 7","Yoga 7i","Yoga Slim 6","Yoga Slim 7","Yoga Slim 7i","Yoga Pro 7","Yoga Pro 9i",
"Legion Y520","Legion Y530","Legion Y540","Legion Y545","Legion 5","Legion 5i","Legion 5 Pro","Legion 7","Legion 7i","Legion Slim 5","Legion Slim 7","Legion Pro 5","Legion Pro 7"
],
"Asus":[
"Eee PC 1000","Eee PC 1015","Eee PC 1025","X401","X402","X550","X555","X556","X541","X515",
"VivoBook X200","VivoBook X202","VivoBook X540","VivoBook X542","VivoBook 14 X413","VivoBook 14 X415","VivoBook 14 X1400","VivoBook 15 X512","VivoBook 15 X515","VivoBook 15 X1500","VivoBook Go 14","VivoBook Go 15","Vivobook 14","Vivobook 15","Vivobook S14","Vivobook S15","Vivobook S16",
"ZenBook UX21","ZenBook UX31","ZenBook UX32","ZenBook UX305","ZenBook UX330","ZenBook UX331","ZenBook UX333","ZenBook UX425","ZenBook UX434","ZenBook 13 UX325","ZenBook 14 UX425","ZenBook 14 UX435","Zenbook 14 OLED UX3402","Zenbook 14 OLED UX3405","Zenbook 14 OLED UM3406","Zenbook S13","Zenbook S14","Zenbook S16","Zenbook DUO UX482","Zenbook DUO UX8406","Zenbook DUO UX8407","Zenbook A14","Zenbook A16",
"ExpertBook P1410","ExpertBook P2451","ExpertBook B1","ExpertBook B1400","ExpertBook B1500","ExpertBook B1402","ExpertBook B1502",
"TUF Gaming FX504","TUF Gaming FX505","TUF Gaming FX506","TUF Gaming F15","TUF Gaming F17","TUF Gaming A15","TUF Gaming A17","TUF Gaming A14","TUF Gaming A16","TUF Gaming F16",
"ROG G751","ROG G752","ROG G703","ROG Strix GL503","ROG Strix G531","ROG Strix G15","ROG Strix G16","ROG Strix G17","ROG Strix G18","ROG Strix SCAR 15","ROG Strix SCAR 16","ROG Strix SCAR 17","ROG Strix SCAR 18","ROG Zephyrus G14","ROG Zephyrus G15","ROG Zephyrus G16","ROG Flow X13","ROG Flow X16","ROG Flow Z13",
"ProArt Studiobook 15","ProArt Studiobook 16","ProArt P16"
],
"Acer":[
"Extensa 2508","Extensa 2510","Extensa 2520","Extensa 2540","Extensa 2560","Extensa 15","TravelMate 2300","TravelMate 2400","TravelMate 4000","TravelMate P2","TravelMate P214","TravelMate P215","TravelMate P2 TMP214","TravelMate P6",
"Aspire 3690","Aspire 4730","Aspire 4736","Aspire 4740","Aspire 4750","Aspire 5750","Aspire 5742","Aspire 5745","Aspire 3","Aspire 5","Aspire 7","Aspire 14","Aspire 15","Aspire Vero","Swift 1","Swift 3","Swift 5","Swift X",
"Nitro 5 AN515","Nitro 5 AN515-51","Nitro 5 AN515-54","Nitro 5 AN515-55","Nitro 5 AN515-57","Nitro 5 AN515-58","Nitro 5 AN515-58P","Nitro V 15","Nitro V 16","Predator Helios 300","Predator Helios 16","Predator Helios 18","Predator Triton 300","Predator Triton 500","Predator Triton Neo 16"
],
"MSI":["CR400","CX420","CX61","CX62","CX70","GE60","GE62","GE63","GE66","GE67","GS60","GS65","GS66","GS67","GP60","GP62","GP63","GL62","GL63","GL65","GL66","GF63 Thin","GF65 Thin","GF63","Katana 15","Katana 17","Cyborg 15","Cyborg 16","Modern 14","Modern 15","Prestige 14","Prestige 15","Stealth 14","Stealth 15","Stealth 16","Raider GE68","Raider GE78","Titan GT77","Creator Z16"],
"Apple":["MacBook 2006","MacBook 2007","MacBook 2008","MacBook 2009","MacBook 2010","MacBook Air 2010","MacBook Air 2011","MacBook Air 2012","MacBook Air 2013","MacBook Air 2014","MacBook Air 2015","MacBook Air 2017","MacBook Air 2018","MacBook Air 2019","MacBook Air 2020 Intel","MacBook Air M1","MacBook Air M2","MacBook Air M3","MacBook Air M4","MacBook Air M5","MacBook Pro 2008","MacBook Pro 2009","MacBook Pro 2010","MacBook Pro 2011","MacBook Pro 2012","MacBook Pro 2013","MacBook Pro 2014","MacBook Pro 2015","MacBook Pro 2016","MacBook Pro 2017","MacBook Pro 2018","MacBook Pro 2019","MacBook Pro 2020 Intel","MacBook Pro M1","MacBook Pro M2","MacBook Pro M3","MacBook Pro M4","MacBook Pro M5"],
"Microsoft Surface":["Surface Laptop 1","Surface Laptop 2","Surface Laptop 3","Surface Laptop 4","Surface Laptop 5","Surface Laptop 6","Surface Laptop 7","Surface Pro 1","Surface Pro 2","Surface Pro 3","Surface Pro 4","Surface Pro 5","Surface Pro 6","Surface Pro 7","Surface Pro 7+","Surface Pro 8","Surface Pro 9","Surface Pro 10","Surface Pro 11"],
"Samsung":["R60","R70","RV511","NP300","NP350","NP355","Notebook 3","Notebook 5","Notebook 7","Galaxy Book","Galaxy Book2","Galaxy Book3","Galaxy Book4","Galaxy Book5","Galaxy Book4 Pro","Galaxy Book5 Pro"],
"Sony":["VAIO PCG","VAIO VGN","VAIO E","VAIO S","VAIO T","VAIO Fit","VAIO Pro 11","VAIO Pro 13","VAIO Pro 14","VAIO Pro 15","VAIO Z"],
"LG":["X110","X120","X130","Gram 13","Gram 14","Gram 15","Gram 16","Gram 17","Ultra PC 14","Ultra PC 15","Ultra PC 16"],
"Huawei":["MateBook D14","MateBook D15","MateBook D16","MateBook 13","MateBook 14","MateBook 16","MateBook X","MateBook X Pro","MateBook GT"],
"Fujitsu":["LIFEBOOK A Series","LIFEBOOK E Series","LIFEBOOK S Series","LIFEBOOK U Series","LIFEBOOK T Series","LIFEBOOK E5410","LIFEBOOK E5511"],
"Toshiba":["Satellite A100","Satellite L300","Satellite L500","Satellite C640","Satellite C660","Satellite C850","Satellite C840","Satellite Pro","Tecra A50","Tecra Z40","Dynabook R73","Dynabook R74","Dynabook B65"],
"Gigabyte":["P15","P17","AERO 14","AERO 15","AERO 16","AERO 17","G5","G6","G6X","AORUS 5","AORUS 7","AORUS 15","AORUS 16","AORUS 17"],
"Razer":["Blade 14 2016","Blade 14 2017","Blade 15 2018","Blade 15 2019","Blade 15 2020","Blade 15 2021","Blade 15 2022","Blade 14 2022","Blade 14 2023","Blade 16","Blade 17","Blade 18"],
"Intel":["Intel NUC M15","Intel NUC Laptop"],
"Khác":["Model khác"]
}
function setupModelList(){
  const brand=$("#brand"), model=$("#model");
  if(!brand||!model) return;
  const fill=()=>{
    const list=MODEL_LIST[brand.value]||[];
    model.innerHTML='<option value="">-- Chọn model máy --</option>'+list.map(x=>`<option>${x}</option>`).join("");
    if(brand.value==="Khác") model.innerHTML+='<option value="__custom__">Nhập model khác...</option>';
    updateModelImage?.();
  };
  brand.onchange=fill;
  model.onchange=()=>updateModelImage?.();
  fill();
}
const CPU_DB = [
  {group:'Intel Celeron', items:[
    ['Celeron 2980U','2C/2T • 1.6 GHz'],['Celeron 3205U','2C/2T • 1.5 GHz'],['Celeron 3865U','2C/2T • 1.8 GHz'],['Celeron 3965U','2C/2T • 2.2 GHz'],['Celeron N3350','2C/2T • 1.1–2.4 GHz'],['Celeron N4020','2C/2T • 1.1–2.8 GHz'],['Celeron N4120','4C/4T • 1.1–2.6 GHz'],['Celeron N4500','2C/2T • 1.1–2.8 GHz'],['Celeron N5100','4C/4T • 1.1–2.8 GHz'],['Celeron N5105','4C/4T • 2.0–2.9 GHz']
  ]},
  {group:'Intel Pentium', items:[
    ['Pentium N3710','4C/4T • 1.6–2.56 GHz'],['Pentium N4200','4C/4T • 1.1–2.5 GHz'],['Pentium Silver N5000','4C/4T • 1.1–2.7 GHz'],['Pentium Silver N5030','4C/4T • 1.1–3.1 GHz'],['Pentium Gold 5405U','2C/4T • 2.3 GHz'],['Pentium Gold 6405U','2C/4T • 2.4 GHz']
  ]},
  {group:'Intel Core i3', items:[
    ['i3-3110M','2C/4T • 2.4 GHz'],['i3-4005U','2C/4T • 1.7 GHz'],['i3-5005U','2C/4T • 2.0 GHz'],['i3-6006U','2C/4T • 2.0 GHz'],['i3-7100U','2C/4T • 2.4 GHz'],['i3-8130U','2C/4T • 2.2–3.4 GHz'],['i3-10110U','2C/4T • 2.1–4.1 GHz'],['i3-1115G4','2C/4T • 3.0–4.1 GHz'],['i3-1215U','6C/8T • 1.2–4.4 GHz']
  ]},
  {group:'Intel Core i5', items:[
    ['i5-2410M','2C/4T • 2.3–2.9 GHz'],['i5-3230M','2C/4T • 2.6–3.2 GHz'],['i5-4200U','2C/4T • 1.6–2.6 GHz'],['i5-5200U','2C/4T • 2.2–2.7 GHz'],['i5-6200U','2C/4T • 2.3–2.8 GHz'],['i5-6300U','2C/4T • 2.4–3.0 GHz'],['i5-7200U','2C/4T • 2.5–3.1 GHz'],['i5-8250U','4C/8T • 1.6–3.4 GHz'],['i5-8350U','4C/8T • 1.7–3.6 GHz'],['i5-10210U','4C/8T • 1.6–4.2 GHz'],['i5-1135G7','4C/8T • 2.4–4.2 GHz'],['i5-1235U','10C/12T • 1.3–4.4 GHz']
  ]},
  {group:'Intel Core i7', items:[
    ['i7-2620M','2C/4T • 2.7–3.4 GHz'],['i7-3630QM','4C/8T • 2.4–3.4 GHz'],['i7-4500U','2C/4T • 1.8–3.0 GHz'],['i7-5500U','2C/4T • 2.4–3.0 GHz'],['i7-6500U','2C/4T • 2.5–3.1 GHz'],['i7-7500U','2C/4T • 2.7–3.5 GHz'],['i7-8550U','4C/8T • 1.8–4.0 GHz'],['i7-8650U','4C/8T • 1.9–4.2 GHz'],['i7-10510U','4C/8T • 1.8–4.9 GHz'],['i7-1165G7','4C/8T • 2.8–4.7 GHz'],['i7-12700H','14C/20T • 2.3–4.7 GHz']
  ]},
  {group:'Intel Core i9', items:[
    ['i9-9880H','8C/16T • 2.3–4.8 GHz'],['i9-10980HK','8C/16T • 2.4–5.3 GHz'],['i9-11980HK','8C/16T • 2.6–5.0 GHz'],['i9-12900H','14C/20T • 2.5–5.0 GHz']
  ]},
  {group:'AMD Ryzen 3', items:[
    ['Ryzen 3 2200U','2C/4T • 2.5–3.4 GHz'],['Ryzen 3 3200U','2C/4T • 2.6–3.5 GHz'],['Ryzen 3 3250U','2C/4T • 2.6–3.5 GHz'],['Ryzen 3 3300U','4C/4T • 2.1–3.5 GHz'],['Ryzen 3 4300U','4C/4T • 2.7–3.7 GHz'],['Ryzen 3 5300U','4C/8T • 2.6–3.8 GHz'],['Ryzen 3 7320U','4C/8T • 2.4–4.1 GHz']
  ]},
  {group:'AMD Ryzen 5', items:[
    ['Ryzen 5 2500U','4C/8T • 2.0–3.6 GHz'],['Ryzen 5 3500U','4C/8T • 2.1–3.7 GHz'],['Ryzen 5 3550H','4C/8T • 2.1–3.7 GHz'],['Ryzen 5 4500U','6C/6T • 2.3–4.0 GHz'],['Ryzen 5 5500U','6C/12T • 2.1–4.0 GHz'],['Ryzen 5 5625U','6C/12T • 2.3–4.3 GHz'],['Ryzen 5 7530U','6C/12T • 2.0–4.5 GHz']
  ]},
  {group:'AMD Ryzen 7', items:[
    ['Ryzen 7 2700U','4C/8T • 2.2–3.8 GHz'],['Ryzen 7 3700U','4C/8T • 2.3–4.0 GHz'],['Ryzen 7 3750H','4C/8T • 2.3–4.0 GHz'],['Ryzen 7 4800U','8C/16T • 1.8–4.2 GHz'],['Ryzen 7 5700U','8C/16T • 1.8–4.3 GHz'],['Ryzen 7 5825U','8C/16T • 2.0–4.5 GHz'],['Ryzen 7 7730U','8C/16T • 2.0–4.5 GHz']
  ]}
];
function cpuOptionsHTML(){return '<option value="">-- Chọn CPU --</option>'+CPU_DB.map(g=>`<optgroup label="${g.group}">${g.items.map(([name,spec])=>`<option value="${name} — ${spec}">${name} — ${spec}</option>`).join('')}</optgroup>`).join('');}

function importPage(){ $("#content").innerHTML=`<div class="grid2"><div class="panel"><h3>💻 Thông tin laptop</h3><div class="formgrid"><div class="field"><label>Hãng máy *</label>
<select id="brand">
<option value="">-- Chọn hãng máy --</option>
<option>Dell</option>
<option>HP</option>
<option>Lenovo</option>
<option>Asus</option>
<option>Acer</option>
<option>MSI</option>
<option>Apple</option>
<option>Microsoft Surface</option>
<option>Samsung</option>
<option>Sony</option>
<option>LG</option>
<option>Huawei</option>
<option>Fujitsu</option>
<option>Toshiba</option>
<option>Gigabyte</option>
<option>Razer</option>
<option>Intel</option>
<option>Khác</option>
</select></div><div class="field"><label>Model máy *</label>
<select id="model">
<option value="">-- Chọn model máy --</option>
</select></div><div class="field"><label>Số lượng *</label><input id="qty" type="number" min="1" value="1"></div><div class="field"><label>Giá nhập *</label><input id="price" type="text" inputmode="numeric" autocomplete="off" placeholder="5.500.000"></div><div class="field full"><label>📝 Thông số Model</label><div class="model-spec-box"><div class="spec-hint">Chọn nhanh từng thông số, không cần gõ. Chọn xong hệ thống tự ghép thành dòng thông tin Model.</div><div class="spec-picker"><div class="spec-item"><label>Dòng CPU</label><select id="specCPUFamily"><option value="">-- Chọn dòng CPU --</option>${CPU_DB.map(g=>`<option value="${g.group}">${g.group}</option>`).join('')}</select></div><div class="spec-item"><label>Mã CPU</label><select id="specCPU"><option value="">-- Chọn mã CPU --</option></select></div><div class="spec-item"><label>RAM</label><select id="specRAM"><option value="">-- RAM --</option><option>2G</option><option>4G</option><option>8G</option><option>16G</option><option>32G</option><option>64G</option></select></div><div class="spec-item"><label>Ổ cứng</label><select id="specSSD"><option value="">-- Chọn loại ổ cứng --</option><optgroup label="SSD"><option>SSD 128G</option><option>SSD 256G</option><option>SSD 512G</option><option>SSD 1TB</option><option>SSD 2TB</option><option>SSD 4TB</option></optgroup><optgroup label="HDD"><option>HDD 320G</option><option>HDD 500G</option><option>HDD 750G</option><option>HDD 1TB</option><option>HDD 2TB</option><option>HDD 4TB</option></optgroup></select></div><div class="spec-item"><label>Màn hình</label><select id="specScreen"><option value="">-- Màn hình --</option><option>11,6 inch</option><option>12,5 inch</option><option>13,3 inch</option><option>14 inch</option><option>15 inch</option><option>15,6 inch</option><option>17,3 inch</option></select></div><div class="spec-item"><label>VGA</label><select id="specVGA"><option value="">-- Chọn VGA / Card --</option><optgroup label="Intel tích hợp"><option>Intel HD Graphics 4000</option><option>Intel HD Graphics 4400</option><option>Intel HD Graphics 4600</option><option>Intel HD Graphics 520</option><option>Intel HD Graphics 530</option><option>Intel UHD Graphics 600</option><option>Intel UHD Graphics 620</option><option>Intel UHD Graphics 630</option><option>Intel Iris Xe Graphics</option></optgroup><optgroup label="NVIDIA MX"><option>GeForce MX110 2GB</option><option>GeForce MX130 2GB</option><option>GeForce MX150 2GB</option><option>GeForce MX230 2GB</option><option>GeForce MX250 2GB</option><option>GeForce MX330 2GB</option><option>GeForce MX350 2GB</option><option>GeForce MX450 2GB</option><option>GeForce MX550 2GB</option><option>GeForce MX570 2GB</option></optgroup><optgroup label="NVIDIA GTX"><option>GeForce GTX 950M 2GB</option><option>GeForce GTX 960M 4GB</option><option>GeForce GTX 1050 2GB</option><option>GeForce GTX 1050 Ti 4GB</option><option>GeForce GTX 1060 3GB</option><option>GeForce GTX 1060 6GB</option><option>GeForce GTX 1650 4GB</option><option>GeForce GTX 1650 Ti 4GB</option><option>GeForce GTX 1660 Ti 6GB</option></optgroup><optgroup label="NVIDIA RTX"><option>GeForce RTX 2050 4GB</option><option>GeForce RTX 2060 6GB</option><option>GeForce RTX 3050 4GB</option><option>GeForce RTX 3050 Ti 4GB</option><option>GeForce RTX 3060 6GB</option><option>GeForce RTX 3070 8GB</option><option>GeForce RTX 3080 8GB</option><option>GeForce RTX 4050 6GB</option><option>GeForce RTX 4060 8GB</option><option>GeForce RTX 4070 8GB</option><option>GeForce RTX 4080 12GB</option><option>GeForce RTX 4090 16GB</option><option>GeForce RTX 5050 8GB</option><option>GeForce RTX 5060 8GB</option><option>GeForce RTX 5070 8GB</option><option>GeForce RTX 5080 16GB</option><option>GeForce RTX 5090 24GB</option></optgroup><optgroup label="AMD Radeon"><option>Radeon Vega 3</option><option>Radeon Vega 8</option><option>Radeon Vega 10</option><option>Radeon RX 540 2GB</option><option>Radeon RX 550 4GB</option><option>Radeon RX 560X 4GB</option><option>Radeon RX 640 4GB</option><option>Radeon RX 6500M 4GB</option><option>Radeon RX 6600M 8GB</option><option>Radeon RX 7600S 8GB</option></optgroup><option>Không VGA rời</option></select></div><div class="spec-item"><label>Pin</label><select id="specBattery"><option value="">-- Pin --</option><option>0h</option><option>1h</option><option>2h</option><option>3h</option><option>4h</option><option>5h</option><option>6h+</option></select></div></div><div class="spec-actions"><button type="button" class="btn blue" id="buildSpecBtn">🔄 TẠO THÔNG SỐ</button></div><textarea id="modelSpecs" readonly placeholder="Thông số sẽ tự hiện tại đây..."></textarea><div class="spec-save-note">Ví dụ: CPU i5 6400U 2,6GHz / RAM 8G / Ổ cứng SSD 256G hoặc HDD 500G / Màn hình 15 inch / VGA NVIDIA / Pin 2h. Thông số được lưu theo Hãng + Model.</div></div></div>
    <div class="field full"><label>📷 Hình ảnh máy thực tế</label>
<div class="camera"><div><button class="btn blue" id="cameraBtn">📷 CHỤP HÌNH</button><p class="muted">📱 Chụp ảnh thực tế bằng điện thoại và lưu cùng phiếu nhập kho.</p><input id="photo" type="file" accept="image/*" capture="environment" hidden><img id="preview" class="preview" hidden></div></div></div></div></div><div class="panel"><h3>🔧 Sửa chữa / Nâng cấp</h3><p class="muted">Chọn nhanh loại linh kiện/dung lượng và nhập giá. Phần “Sửa chữa khác” cho phép ghi tay nội dung như sửa cổng USB, bản lề, loa...</p><div class="repair-grid">
<div class="repair-card"><h4>⌨️ Bàn phím</h4><div class="field"><label>Hãng / loại</label><select id="keyboardType"><option value="">-- Không thay --</option><option>Dell</option><option>HP</option><option>Lenovo</option><option>Asus</option><option>Acer</option><option>MSI</option><option>Apple</option><option>Microsoft Surface</option><option>Samsung</option><option>LG</option><option>Generic / Linh kiện thay thế</option></select></div><div class="field"><label>Giá thay</label><input id="keyboard" type="text" inputmode="numeric" value="0" placeholder="250.000"></div></div>
<div class="repair-card"><h4>🖥️ Màn hình</h4><div class="field"><label>Kích thước / loại</label><select id="screenType"><option value="">-- Không thay --</option><option>11,6 inch</option><option>12,5 inch</option><option>13,3 inch</option><option>14 inch</option><option>15,6 inch</option><option>17,3 inch</option><option>HD</option><option>Full HD</option><option>2K</option><option>4K</option></select></div><div class="field"><label>Giá thay</label><input id="screen" type="text" inputmode="numeric" value="0" placeholder="700.000"></div></div>
<div class="repair-card"><h4>💾 RAM</h4><div class="field"><label>Dung lượng</label><select id="ramSpec"><option value="">-- Không thay --</option><option>2G</option><option>4G</option><option>8G</option><option>16G</option><option>32G</option><option>64G</option><option>128G</option></select></div><div class="field"><label>Giá thay</label><input id="ram" type="text" inputmode="numeric" value="0" placeholder="300.000"></div></div>
<div class="repair-card"><h4>💿 Ổ cứng</h4><div class="field"><label>Loại + dung lượng</label><select id="ssdSpec"><option value="">-- Không thay --</option><optgroup label="SSD"><option>SSD 128G</option><option>SSD 256G</option><option>SSD 512G</option><option>SSD 1TB</option><option>SSD 2TB</option><option>SSD 4TB</option></optgroup><optgroup label="HDD"><option>HDD 320G</option><option>HDD 500G</option><option>HDD 750G</option><option>HDD 1TB</option><option>HDD 2TB</option><option>HDD 4TB</option></optgroup></select></div><div class="field"><label>Giá thay</label><input id="ssd" type="text" inputmode="numeric" value="0" placeholder="500.000"></div></div>
<div class="repair-card"><h4>🔧 Sửa chữa khác</h4><div class="field"><label>Nội dung sửa</label><input id="otherDesc" type="text" placeholder="VD: sửa cổng USB, bản lề, loa..."></div><div class="field"><label>Chi phí</label><input id="other" type="text" inputmode="numeric" value="0" placeholder="150.000"></div></div>
<div class="repair-card"><h4>🛡️ Bảo hành sửa chữa / nâng cấp</h4>
<div class="field"><label>Thời hạn bảo hành</label>
<select id="repairWarranty"><option value="0">Không bảo hành</option><option value="1w">1 tuần</option><option value="2w">2 tuần</option><option value="3w">3 tuần</option><option value="1m">1 tháng</option><option value="2m">2 tháng</option><option value="3m">3 tháng</option><option value="6m">6 tháng</option><option value="9m">9 tháng</option><option value="12m">12 tháng</option></select></div>
<div class="field"><label>Ngày bắt đầu bảo hành</label><input id="repairWarrantyStart" type="date"></div>
<div class="field"><label>Ngày hết hạn</label><input id="repairWarrantyEnd" type="date" readonly></div>
</div>
</div><div class="total" id="repairTotal">Tổng sửa chữa: 0 đ</div><div class="total" id="costTotal">Giá vốn thực tế: 0 đ</div><div class="actions"><button class="btn orange" id="calc">TÍNH TỔNG</button><button class="btn green" id="saveImport">💾 SAVE NHẬP KHO</button></div></div></div>`; 
["price","keyboard","screen","ram","ssd","other"].forEach(id=>$("#"+id).oninput=calcCost);["keyboardType","screenType","ramSpec","ssdSpec","otherDesc"].forEach(id=>$("#"+id)?.addEventListener("change",calcCost));
const warrantyStart=$("#repairWarrantyStart"), warrantyDuration=$("#repairWarranty");
if(warrantyStart && !warrantyStart.value) warrantyStart.value=new Date().toISOString().slice(0,10);
function updateRepairWarrantyDates(){
  const st=warrantyStart?.value||"", du=warrantyDuration?.value||"0";
  const en=warrantyEndDate(st,du);
  if($("#repairWarrantyEnd")) $("#repairWarrantyEnd").value=en;
}
warrantyStart?.addEventListener("change",updateRepairWarrantyDates);
warrantyDuration?.addEventListener("change",updateRepairWarrantyDates);
updateRepairWarrantyDates();$("#calc").onclick=calcCost;$("#cameraBtn").onclick=()=>openCameraCapture(data=>{window._pendingCameraLaptopImage=data;$("#preview").src=data;$("#preview").hidden=false;});
const recognizeBtn=document.createElement("button");
recognizeBtn.className="btn orange";
recognizeBtn.id="recognizeBtn";
recognizeBtn.textContent="🔍 TỰ NHẬN DIỆN MODEL";
const cameraControls=document.querySelector("#cameraBox .cameraControls");
if(cameraControls) cameraControls.insertBefore(recognizeBtn,cameraControls.firstChild);
recognizeBtn.onclick=autoIdentifyLaptop;$("#photo").onchange=e=>{let f=e.target.files[0];if(f){let r=new FileReader();r.onload=()=>{$("#preview").src=r.result;$("#preview").hidden=false;};r.readAsDataURL(f)}};$("#saveImport").onclick=saveImport;$("#buildSpecBtn").onclick=buildModelSpecText;setupModelList();$("#brand").onchange=()=>{setupModelList();updateModelSpecs()};$("#model").onchange=updateModelSpecs;setupCPUSelector();["specCPUFamily","specCPU","specRAM","specSSD","specScreen","specVGA","specBattery"].forEach(id=>$("#"+id)?.addEventListener("change",buildModelSpecText));bindMoneyInputs();buildModelSpecText();updateModelSpecs();calcCost()}
function setupCPUSelector(){
  const fam=$("#specCPUFamily"), cpu=$("#specCPU");
  if(!fam || !cpu) return;

  function fillCPUList(keepValue=false){
    const selected = keepValue ? cpu.value : "";
    const family = String(fam.value || "").trim();
    const group = CPU_DB.find(x => String(x.group).trim() === family);

    cpu.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = "-- Chọn mã CPU --";
    cpu.appendChild(first);

    if(group){
      group.items.forEach(([name,spec])=>{
        const opt=document.createElement("option");
        opt.value=`${name} — ${spec}`;
        opt.textContent=`${name} — ${spec}`;
        cpu.appendChild(opt);
      });
    }

    if(selected && [...cpu.options].some(o=>o.value===selected)) cpu.value=selected;
    else cpu.value="";
    buildModelSpecText();
  }

  fam.addEventListener("change", ()=>fillCPUList(false));
  cpu.addEventListener("change", buildModelSpecText);
  fillCPUList(false);
}

// Fallback listener: guarantees the CPU list is refreshed even if another
// part of the page re-renders the selector.
document.addEventListener("change", (e)=>{
  if(e.target && e.target.id === "specCPUFamily"){
    const fam=e.target;
    const cpu=document.getElementById("specCPU");
    if(!cpu) return;
    const group=CPU_DB.find(x=>String(x.group).trim()===String(fam.value||"").trim());
    cpu.innerHTML='<option value="">-- Chọn mã CPU --</option>' +
      (group ? group.items.map(([name,spec])=>`<option value="${name} — ${spec}">${name} — ${spec}</option>`).join("") : "");
    buildModelSpecText();
  }
});
function buildModelSpecText(){
  const cpu=$("#specCPU")?.value?.trim();
  const vals=[
    ["CPU", cpu],
    ["RAM", $("#specRAM")?.value?.trim()],
    ["Ổ cứng", $("#specSSD")?.value?.trim()],
    ["Màn hình", $("#specScreen")?.value?.trim()],
    ["VGA", $("#specVGA")?.value?.trim()],
    ["Pin", $("#specBattery")?.value?.trim()]
  ].filter(([,v])=>v).map(([k,v])=>`${k} ${v}`);
  const box=$("#modelSpecs");
  if(box) box.value=vals.join(" / ");
}
function num(id){return parseMoneyValue($("#"+id)?.value||0)}
function warrantyEndDate(start, duration){
  if(!start || !duration || duration==="0") return "";
  const d=new Date(start+"T00:00:00");
  if(Number.isNaN(d.getTime())) return "";
  if(duration.endsWith("w")) d.setDate(d.getDate()+Number(duration.slice(0,-1))*7);
  else if(/^[0-9]+m$/.test(duration)) d.setMonth(d.getMonth()+Number(duration.slice(0,-1)));
  return d.toISOString().slice(0,10);
}
function formatDateVN(v){
  if(!v) return "";
  const d=new Date(v+"T00:00:00");
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString("vi-VN");
}
function warrantyText(start,duration,end){
  if(!duration || duration==="0") return "Không bảo hành";
  const e=end||warrantyEndDate(start,duration);
  const labels={"1w":"1 tuần","2w":"2 tuần","3w":"3 tuần","1m":"1 tháng","2m":"2 tháng","3m":"3 tháng","6m":"6 tháng","9m":"9 tháng","12m":"12 tháng"};
  return `${labels[duration]||duration} — từ ${formatDateVN(start)} đến ${formatDateVN(e)}`;
}
function calcCost(){let r=num("keyboard")+num("screen")+num("ram")+num("ssd")+num("other"),c=num("price")+r;$("#repairTotal").textContent="Tổng sửa chữa: "+money(r);$("#costTotal").textContent="Giá vốn thực tế: "+money(c);return {r,c}}
async function autoIdentifyLaptop(){
  const file=$("#photo")?.files?.[0];
  if(!file) return alert("Hãy chụp hoặc chọn ảnh chiếc laptop trước.");
  if(typeof Tesseract==="undefined") return alert("Chức năng nhận diện cần kết nối Internet lần đầu để tải bộ OCR.");
  const btn=$("#recognizeBtn"); if(btn){btn.disabled=true;btn.textContent="⏳ ĐANG NHẬN DIỆN...";}
  try{
    const result=await Tesseract.recognize(file,"eng",{logger:m=>{
      if(m.status==="recognizing text"&&btn) btn.textContent=`⏳ OCR ${Math.round((m.progress||0)*100)}%`;
    }});
    const raw=(result.data.text||"").replace(/\s+/g," ").trim();
    const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,"");
    let best={score:0,brand:"",model:""};
    for(const [brand,models] of Object.entries(MODEL_LIST||{})){
      for(const model of models){
        const scoreText=norm(raw), bm=norm(brand), mm=norm(model);
        let score=0;
        if(scoreText.includes(bm)) score+=35;
        if(scoreText.includes(mm)) score+=65;
        const tokens=mm.match(/[a-z]+|\d+/g)||[];
        const hits=tokens.filter(t=>t.length>=2&&scoreText.includes(t)).length;
        score+=Math.min(30,hits*8);
        if(score>best.score) best={score,brand,model};
      }
    }
    if(best.score<45){
      alert("Chưa nhận diện đủ chắc chắn. Hãy chụp rõ tem Model/Service Tag ở mặt đáy hoặc màn hình System Information.");
    }else{
      $("#brand").value=best.brand;
      setupModelList();
      $("#model").value=best.model;
      updateModelImage?.();
      alert(`Đã nhận diện gần đúng:\\n${best.brand} ${best.model}\\n\\nBạn kiểm tra lại trước khi SAVE.`);
    }
  }catch(e){
    alert("Không nhận diện được ảnh. Hãy chụp rõ tem Model/Service Tag.");
  }finally{
    if(btn){btn.disabled=false;btn.textContent="🔍 TỰ NHẬN DIỆN MODEL";}
  }
}

async function openCameraCapture(onCapture){
  const root=document.getElementById('modalRoot');
  if(!root)return;

  // V4.68: force the camera layer to belong to the viewport, not to the
  // current page/form layout. This fixes the modal appearing on the left.
  const previousStyle=root.getAttribute('style')||'';
  root.style.cssText='position:fixed!important;left:0!important;top:0!important;right:0!important;bottom:0!important;width:100vw!important;height:100vh!important;z-index:2147483000!important;pointer-events:none!important;margin:0!important;padding:0!important;';

  let stream=null;
  root.innerHTML=`<div class="modalOverlay cameraOverlayFixed" id="cameraOverlay">
    <div class="modal cameraModal cameraModalFixed">
      <div class="modalHead">
        <h3>📷 Chụp hình</h3>
        <button class="btn red" id="closeCameraBtn" type="button">✕</button>
      </div>
      <div class="cameraPreviewFrame">
        <video id="cameraVideo" autoplay playsinline></video>
      </div>
      <div class="cameraModalActions">
        <button class="btn blue" id="captureCameraBtn" type="button">📸 CHỤP</button>
        <button class="btn orange" id="switchCameraBtn" type="button">🔄 ĐỔI CAMERA</button>
        <button class="btn gray" id="cancelCameraBtn" type="button">HỦY</button>
      </div>
      <p class="muted cameraHint">PC: dùng webcam. Điện thoại: dùng camera của máy. Trình duyệt sẽ hỏi quyền Camera.</p>
    </div>
  </div>`;

  const video=root.querySelector('#cameraVideo');
  let facing='environment';

  const stop=()=>{
    if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
    root.innerHTML='';
    root.setAttribute('style',previousStyle);
  };

  const start=async()=>{
    if(stream)stream.getTracks().forEach(t=>t.stop());
    try{
      stream=await navigator.mediaDevices.getUserMedia({
        video:{facingMode:{ideal:facing}},
        audio:false
      });
      video.srcObject=stream;
      await video.play().catch(()=>{});
    }catch(e){
      stop();
      alert('Không mở được camera. Hãy cho phép trình duyệt truy cập Camera hoặc dùng nút chọn ảnh.');
    }
  };

  root.querySelector('#closeCameraBtn').onclick=stop;
  root.querySelector('#cancelCameraBtn').onclick=stop;
  root.querySelector('#switchCameraBtn').onclick=()=>{
    facing=facing==='environment'?'user':'environment';
    start();
  };

  root.querySelector('#captureCameraBtn').onclick=()=>{
    if(!video.videoWidth)return alert('Camera chưa sẵn sàng.');
    const c=document.createElement('canvas');
    const max=1280;
    const scale=Math.min(1,max/video.videoWidth);
    c.width=Math.round(video.videoWidth*scale);
    c.height=Math.round(video.videoHeight*scale);
    c.getContext('2d').drawImage(video,0,0,c.width,c.height);
    const data=c.toDataURL('image/jpeg',.82);
    stop();
    onCapture(data);
  };

  if(!navigator.mediaDevices?.getUserMedia){
    stop();
    alert('Trình duyệt không hỗ trợ Camera trực tiếp. Hãy dùng nút chọn ảnh.');
    return;
  }
  await start();
}

function compressImageDataURL(file, maxSide=640, quality=.62) {
  return new Promise((resolve)=>{
    if(!file){resolve("");return;}
    if(typeof file==="string" && file.startsWith("data:")){ const im=new Image(); im.onload=()=>{const scale=Math.min(1,maxSide/Math.max(im.width,im.height));const c=document.createElement("canvas");c.width=Math.max(1,Math.round(im.width*scale));c.height=Math.max(1,Math.round(im.height*scale));c.getContext("2d").drawImage(im,0,0,c.width,c.height);resolve(c.toDataURL("image/jpeg",quality));};im.src=file;return;}
    const reader=new FileReader();
    reader.onload=()=>{
      const im=new Image();
      im.onload=()=>{
        const scale=Math.min(1,maxSide/Math.max(im.width,im.height));
        const c=document.createElement("canvas");
        c.width=Math.max(1,Math.round(im.width*scale));
        c.height=Math.max(1,Math.round(im.height*scale));
        const ctx=c.getContext("2d");
        ctx.drawImage(im,0,0,c.width,c.height);
        resolve(c.toDataURL("image/jpeg",quality));
      };
      im.src=reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function fileToDataURL(file){return new Promise((resolve,reject)=>{if(!file)return resolve("");const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
function updateModelSpecs(){
  const brand=$("#brand")?.value||"", model=$("#model")?.value||"", box=$("#modelSpecs");
  if(!box)return;
  const key="LAPTOP|"+brand.trim()+"|"+model.trim();
  const saved=(db.modelSpecs&&db.modelSpecs[key])||"";
  box.value=saved;
  const patterns={
    specCPU:/CPU\s+([^/]+)/i,
    specRAM:/RAM\s+([^/]+)/i,
    specSSD:/SSD\s+([^/]+)/i,
    specScreen:/Màn hình\s+([^/]+)/i,
    specVGA:/VGA\s+([^/]+)/i,
    specBattery:/Pin\s+([^/]+)/i
  };
  Object.entries(patterns).forEach(([id,re])=>{
    const el=$("#"+id); if(!el)return;
    const hit=saved.match(re); el.value="";
    if(hit){const target=Array.from(el.options).find(o=>o.value.trim().toLowerCase()===hit[1].trim().toLowerCase());if(target)el.value=target.value;}
  });
}
async function saveImport(){let brand=$("#brand").value.trim(),model=$("#model").value.trim(),qty=num("qty"),price=num("price");if(!brand||!model||qty<1||price<0)return alert("Hãy nhập Hãng máy, Model máy, Số lượng và Giá nhập.");let t=calcCost();let actualImage=await compressImageDataURL(window._pendingCameraLaptopImage || $("#photo")?.files?.[0],640,.62); window._pendingCameraLaptopImage="";let modelImage=getModelImage(brand,model);let modelSpecs=$("#modelSpecs")?.value.trim()||"";db.modelSpecs=db.modelSpecs||{};db.modelSpecs["LAPTOP|"+brand+"|"+model]=modelSpecs;db.laptops.push({id:Date.now(),brand,model,qty,price,repair:t.r,cost:t.c,modelImage,actualImage,modelSpecs,keyboard:num("keyboard"),keyboardType:$("#keyboardType")?.value||"",screen:num("screen"),screenType:$("#screenType")?.value||"",ram:num("ram"),ramSpec:$("#ramSpec")?.value||"",ssd:num("ssd"),ssdSpec:$("#ssdSpec")?.value||"",other:num("other"),otherDesc:$("#otherDesc")?.value.trim()||"",repairWarranty:$("#repairWarranty")?.value||"0",repairWarrantyStart:$("#repairWarrantyStart")?.value||"",repairWarrantyEnd:$("#repairWarrantyEnd")?.value||warrantyEndDate($("#repairWarrantyStart")?.value||"",$("#repairWarranty")?.value||"0")});await save();alert("Đã lưu vào KHO CHUNG trên máy tính.");await loadSharedDB();show("stock")}
const PART_MODEL_LIST = {"Màn hình":{"Dell":["14.0 HD 30-pin","15.6 HD 30-pin","14.0 FHD 30-pin","15.6 FHD 30-pin","14.0 FHD 40-pin","15.6 FHD 40-pin"],"HP":["14.0 HD","15.6 HD","14.0 FHD","15.6 FHD","14.0 FHD 40-pin","15.6 FHD 40-pin"],"Lenovo":["14.0 HD","15.6 HD","14.0 FHD","15.6 FHD","14.0 FHD 40-pin","15.6 FHD 40-pin","14.0 2K"],"Asus":["14.0 HD","15.6 HD","14.0 FHD","15.6 FHD","14.0 FHD 40-pin","15.6 FHD 40-pin","15.6 2K"],"Acer":["14.0 HD","15.6 HD","14.0 FHD","15.6 FHD","14.0 FHD 40-pin","15.6 FHD 40-pin"],"MSI":["14.0 FHD","15.6 FHD 144Hz","15.6 FHD 165Hz","17.3 FHD 144Hz","17.3 FHD 240Hz"],"Apple":["MacBook Air 13.3","MacBook Air 13.6 Retina","MacBook Pro 13.3 Retina","MacBook Pro 14.2 Retina","MacBook Pro 16.2 Retina"],"Universal":["14.0 HD","14.0 FHD","15.6 HD","15.6 FHD","17.3 FHD"],"Khác":["Màn hình model khác"]},"RAM":{"Samsung":["DDR3 2GB","DDR3 4GB","DDR3 8GB","DDR4 4GB","DDR4 8GB","DDR4 16GB","DDR5 8GB","DDR5 16GB","DDR5 32GB"],"SK hynix":["DDR3 4GB","DDR3 8GB","DDR4 4GB","DDR4 8GB","DDR4 16GB","DDR5 8GB","DDR5 16GB","DDR5 32GB"],"Kingston":["DDR3 4GB","DDR3 8GB","DDR4 4GB","DDR4 8GB","DDR4 16GB","DDR5 8GB","DDR5 16GB","DDR5 32GB"],"Crucial":["DDR3 4GB","DDR3 8GB","DDR4 4GB","DDR4 8GB","DDR4 16GB","DDR5 8GB","DDR5 16GB","DDR5 32GB"],"Micron":["DDR3 4GB","DDR4 4GB","DDR4 8GB","DDR4 16GB","DDR5 8GB","DDR5 16GB"],"ADATA":["DDR4 8GB","DDR4 16GB","DDR5 8GB","DDR5 16GB","DDR5 32GB"],"TeamGroup":["DDR4 8GB","DDR4 16GB","DDR5 8GB","DDR5 16GB","DDR5 32GB"],"G.Skill":["DDR4 8GB","DDR4 16GB","DDR5 16GB","DDR5 32GB"],"Corsair":["DDR4 8GB","DDR4 16GB","DDR5 16GB","DDR5 32GB"],"Universal":["DDR3 4GB","DDR3 8GB","DDR4 4GB","DDR4 8GB","DDR4 16GB","DDR5 8GB","DDR5 16GB","DDR5 32GB"],"Khác":["RAM model khác"]},"SSD":{"Samsung":["SATA 2.5 128GB","SATA 2.5 256GB","SATA 2.5 500GB","SATA 2.5 1TB","M.2 SATA 256GB","M.2 NVMe 256GB","M.2 NVMe 500GB","M.2 NVMe 1TB","M.2 NVMe 2TB"],"WD":["SATA 2.5 240GB","SATA 2.5 480GB","SATA 2.5 1TB","M.2 NVMe 256GB","M.2 NVMe 500GB","M.2 NVMe 1TB","M.2 NVMe 2TB"],"Kingston":["SATA 2.5 240GB","SATA 2.5 480GB","SATA 2.5 960GB","M.2 SATA 240GB","M.2 NVMe 250GB","M.2 NVMe 500GB","M.2 NVMe 1TB","M.2 NVMe 2TB"],"Crucial":["SATA 2.5 240GB","SATA 2.5 480GB","SATA 2.5 1TB","M.2 SATA 250GB","M.2 NVMe 500GB","M.2 NVMe 1TB","M.2 NVMe 2TB"],"Kioxia":["SATA 2.5 240GB","SATA 2.5 480GB","M.2 NVMe 500GB","M.2 NVMe 1TB","M.2 NVMe 2TB"],"ADATA":["SATA 2.5 240GB","SATA 2.5 480GB","M.2 NVMe 512GB","M.2 NVMe 1TB","M.2 NVMe 2TB"],"SK hynix":["M.2 NVMe 256GB","M.2 NVMe 512GB","M.2 NVMe 1TB","M.2 NVMe 2TB"],"Intel":["SATA 2.5 256GB","SATA 2.5 512GB","M.2 NVMe 512GB","M.2 NVMe 1TB"],"Universal":["SATA 2.5 128GB","SATA 2.5 256GB","SATA 2.5 500GB","SATA 2.5 1TB","M.2 SATA 256GB","M.2 NVMe 256GB","M.2 NVMe 500GB","M.2 NVMe 1TB","M.2 NVMe 2TB"],"Khác":["SSD model khác"]},"HDD":{"Seagate":["2.5 SATA 320GB","2.5 SATA 500GB","2.5 SATA 1TB","2.5 SATA 2TB"],"WD":["2.5 SATA 320GB","2.5 SATA 500GB","2.5 SATA 1TB","2.5 SATA 2TB"],"Toshiba":["2.5 SATA 320GB","2.5 SATA 500GB","2.5 SATA 1TB","2.5 SATA 2TB"],"HGST":["2.5 SATA 500GB","2.5 SATA 1TB"],"Samsung":["2.5 SATA 500GB","2.5 SATA 1TB"],"Universal":["2.5 SATA 320GB","2.5 SATA 500GB","2.5 SATA 1TB","2.5 SATA 2TB"],"Khác":["HDD model khác"]},"Pin":{"Dell":["3-cell 42Wh","4-cell 56Wh","6-cell 65Wh","6-cell 86Wh"],"HP":["3-cell 41Wh","3-cell 45Wh","4-cell 50Wh","6-cell 60Wh"],"Lenovo":["3-cell 24Wh","3-cell 45Wh","4-cell 57Wh","6-cell 72Wh"],"Asus":["2-cell 32Wh","3-cell 42Wh","4-cell 50Wh","6-cell 70Wh"],"Acer":["3-cell 48Wh","4-cell 56Wh","6-cell 65Wh"],"MSI":["3-cell 51Wh","4-cell 65Wh","6-cell 90Wh"],"Apple":["MacBook Air battery","MacBook Pro 13 battery","MacBook Pro 14 battery","MacBook Pro 16 battery"],"Universal":["11.1V 2200mAh","11.1V 4400mAh","14.8V 2200mAh","14.8V 4400mAh","15.2V 4000mAh"],"Khác":["Pin model khác"]},"Bàn phím":{"Dell":["US","UK","VN","Có đèn nền","Không đèn nền"],"HP":["US","UK","VN","Có đèn nền","Không đèn nền"],"Lenovo":["US","UK","VN","Có đèn nền","Không đèn nền"],"Asus":["US","UK","VN","Có đèn nền","Không đèn nền"],"Acer":["US","UK","VN","Có đèn nền","Không đèn nền"],"MSI":["US","UK","VN","RGB","Có đèn nền"],"Apple":["MacBook Air keyboard","MacBook Pro keyboard"],"Universal":["USB Keyboard","Bluetooth Keyboard","Laptop keyboard universal"],"Khác":["Bàn phím model khác"]},"Sạc / Adapter":{"Dell":["45W USB-C","65W USB-C","90W","130W","180W","240W"],"HP":["45W USB-C","65W USB-C","90W","120W","150W","200W"],"Lenovo":["45W USB-C","65W USB-C","90W","135W","170W","230W"],"Asus":["45W USB-C","65W USB-C","90W","120W","150W","180W","240W"],"Acer":["45W","65W","90W","135W","180W"],"MSI":["120W","150W","180W","230W","280W"],"Apple":["30W USB-C","35W USB-C","61W USB-C","67W USB-C","96W USB-C","140W USB-C"],"Universal":["19V 2.37A 45W","19V 3.42A 65W","19V 4.74A 90W","20V 3.25A 65W USB-C","20V 4.5A 90W USB-C","USB-C PD 65W","USB-C PD 100W"],"Khác":["Sạc model khác"]},"Mainboard":{"Dell":["Latitude","Inspiron","Vostro","XPS","Precision","Alienware"],"HP":["Pavilion","ProBook","EliteBook","ZBook","Envy","Victus","Omen"],"Lenovo":["ThinkPad","IdeaPad","Yoga","Legion","ThinkBook"],"Asus":["VivoBook","ZenBook","TUF","ROG","ExpertBook"],"Acer":["Aspire","Swift","Nitro","Predator","TravelMate"],"MSI":["Modern","Prestige","GF","GL","GP","GE","Stealth"],"Apple":["MacBook Air Logic Board","MacBook Pro Logic Board"],"Khác":["Mainboard model khác"]},"Card Wi-Fi / Bluetooth":{"Intel":["Wireless-AC 3165","Wireless-AC 7265","Wireless-AC 8265","AX200","AX201","AX210","BE200"],"Realtek":["RTL8821CE","RTL8822CE","RTL8852AE","RTL8852BE","RTL8723DE"],"Qualcomm":["QCA9377","QCA6174","QCNFA765"],"MediaTek":["MT7921","MT7922"],"Broadcom":["BCM94360","BCM94352"],"Universal":["M.2 Wi-Fi 1x1","M.2 Wi-Fi 2x2","Half Mini PCIe","Mini PCIe"],"Khác":["Card Wi-Fi model khác"]},"Quạt / Fan":{"Dell":["Latitude Fan","Inspiron Fan","Vostro Fan","Precision Fan","Alienware Fan"],"HP":["Pavilion Fan","ProBook Fan","EliteBook Fan","ZBook Fan","Omen Fan"],"Lenovo":["ThinkPad Fan","IdeaPad Fan","Yoga Fan","Legion Fan"],"Asus":["VivoBook Fan","ZenBook Fan","TUF Fan","ROG Fan"],"Acer":["Aspire Fan","Swift Fan","Nitro Fan","Predator Fan"],"MSI":["Modern Fan","GF Fan","GP Fan","GE Fan","Stealth Fan"],"Universal":["5V 4-pin","5V 3-pin","5V blower fan","12V blower fan"],"Khác":["Quạt model khác"]},"Loa":{"Dell":["Loa trái","Loa phải","Bộ loa Dell"],"HP":["Loa trái","Loa phải","Bộ loa HP"],"Lenovo":["Loa trái","Loa phải","Bộ loa Lenovo"],"Asus":["Loa trái","Loa phải","Bộ loa Asus"],"Acer":["Loa trái","Loa phải","Bộ loa Acer"],"MSI":["Loa trái","Loa phải","Bộ loa MSI"],"Apple":["Loa trái","Loa phải","Bộ loa MacBook"],"Universal":["Loa laptop 4Ω","Loa laptop 8Ω","Bộ loa universal"],"Khác":["Loa model khác"]},"Touchpad / Chuột cảm ứng":{"Dell":["Touchpad","Touchpad board","Touchpad cable"],"HP":["Touchpad","Touchpad board","Touchpad cable"],"Lenovo":["Touchpad","Touchpad board","Touchpad cable"],"Asus":["Touchpad","Touchpad board","Touchpad cable"],"Acer":["Touchpad","Touchpad board","Touchpad cable"],"MSI":["Touchpad","Touchpad board","Touchpad cable"],"Apple":["Trackpad","Trackpad cable"],"Universal":["Touchpad USB","Touchpad module","Cáp touchpad"],"Khác":["Touchpad model khác"]},"Webcam / Camera":{"Dell":["HD Webcam","FHD Webcam","IR Camera"],"HP":["HD Webcam","FHD Webcam","IR Camera"],"Lenovo":["HD Webcam","FHD Webcam","IR Camera"],"Asus":["HD Webcam","FHD Webcam","IR Camera"],"Acer":["HD Webcam","FHD Webcam"],"MSI":["HD Webcam","FHD Webcam","IR Camera"],"Universal":["USB HD Webcam","USB FHD Webcam","Laptop webcam module"],"Khác":["Webcam model khác"]},"Cáp màn hình / LCD cable":{"Dell":["30-pin","40-pin","eDP 30-pin","eDP 40-pin"],"HP":["30-pin","40-pin","eDP 30-pin","eDP 40-pin"],"Lenovo":["30-pin","40-pin","eDP 30-pin","eDP 40-pin"],"Asus":["30-pin","40-pin","eDP 30-pin","eDP 40-pin"],"Acer":["30-pin","40-pin","eDP 30-pin","eDP 40-pin"],"MSI":["30-pin","40-pin","eDP 30-pin","eDP 40-pin"],"Universal":["eDP 30-pin","eDP 40-pin","LVDS 30-pin","LVDS 40-pin"],"Khác":["Cáp màn hình model khác"]},"Jack nguồn / DC Jack":{"Dell":["DC Jack dây","DC Jack board","USB-C power board"],"HP":["DC Jack dây","DC Jack board","USB-C power board"],"Lenovo":["DC Jack dây","DC Jack board","USB-C power board"],"Asus":["DC Jack dây","DC Jack board","USB-C power board"],"Acer":["DC Jack dây","DC Jack board","USB-C power board"],"MSI":["DC Jack dây","DC Jack board","USB-C power board"],"Universal":["DC Jack 5.5mm","DC Jack 4.5mm","DC Jack 3.0mm","USB-C power board"],"Khác":["Jack nguồn model khác"]},"Cáp / Flex":{"Dell":["Keyboard cable","Touchpad cable","Power button cable","Battery cable","USB board cable"],"HP":["Keyboard cable","Touchpad cable","Power button cable","Battery cable","USB board cable"],"Lenovo":["Keyboard cable","Touchpad cable","Power button cable","Battery cable","USB board cable"],"Asus":["Keyboard cable","Touchpad cable","Power button cable","Battery cable","USB board cable"],"Acer":["Keyboard cable","Touchpad cable","Power button cable","Battery cable","USB board cable"],"MSI":["Keyboard cable","Touchpad cable","Power button cable","Battery cable","USB board cable"],"Universal":["FFC cable 10 pin","FFC cable 20 pin","FFC cable 30 pin","FFC cable 40 pin","FPC cable"],"Khác":["Cáp/Flex model khác"]},"USB / Audio / I-O Board":{"Dell":["USB board","Audio board","I/O board","Power board"],"HP":["USB board","Audio board","I/O board","Power board"],"Lenovo":["USB board","Audio board","I/O board","Power board"],"Asus":["USB board","Audio board","I/O board","Power board"],"Acer":["USB board","Audio board","I/O board","Power board"],"MSI":["USB board","Audio board","I/O board","Power board"],"Universal":["USB 2.0 board","USB 3.0 board","USB-C board","Audio board","I/O board"],"Khác":["I/O board model khác"]},"Heatsink / Tản nhiệt":{"Dell":["CPU heatsink","CPU+GPU heatsink","VGA heatsink"],"HP":["CPU heatsink","CPU+GPU heatsink","VGA heatsink"],"Lenovo":["CPU heatsink","CPU+GPU heatsink","VGA heatsink"],"Asus":["CPU heatsink","CPU+GPU heatsink","VGA heatsink"],"Acer":["CPU heatsink","CPU+GPU heatsink","VGA heatsink"],"MSI":["CPU heatsink","CPU+GPU heatsink","VGA heatsink"],"Universal":["Laptop heatsink","Copper heatsink","Heatpipe"],"Khác":["Heatsink model khác"]},"Ổ DVD / Optical":{"Dell":["DVD-RW 9.5mm","DVD-RW 12.7mm","Caddy 9.5mm","Caddy 12.7mm"],"HP":["DVD-RW 9.5mm","DVD-RW 12.7mm","Caddy 9.5mm","Caddy 12.7mm"],"Lenovo":["DVD-RW 9.5mm","DVD-RW 12.7mm","Caddy 9.5mm","Caddy 12.7mm"],"Asus":["DVD-RW 9.5mm","DVD-RW 12.7mm","Caddy 9.5mm"],"Acer":["DVD-RW 9.5mm","DVD-RW 12.7mm","Caddy 9.5mm"],"Universal":["Slim DVD-RW 9.5mm","Slim DVD-RW 12.7mm","HDD Caddy 9.5mm","HDD Caddy 12.7mm"],"Khác":["Ổ quang model khác"]},"Vỏ / Khung máy":{"Dell":["Topcase","Palmrest","Bottom case","LCD Back Cover","LCD Bezel","Hinge cover"],"HP":["Topcase","Palmrest","Bottom case","LCD Back Cover","LCD Bezel","Hinge cover"],"Lenovo":["Topcase","Palmrest","Bottom case","LCD Back Cover","LCD Bezel","Hinge cover"],"Asus":["Topcase","Palmrest","Bottom case","LCD Back Cover","LCD Bezel","Hinge cover"],"Acer":["Topcase","Palmrest","Bottom case","LCD Back Cover","LCD Bezel","Hinge cover"],"MSI":["Topcase","Palmrest","Bottom case","LCD Back Cover","LCD Bezel","Hinge cover"],"Apple":["Top Case","Bottom Case","Display Bezel","Display Back Cover"],"Universal":["Palmrest","Bottom case","LCD Bezel","LCD Back Cover"],"Khác":["Vỏ/khung model khác"]},"Bản lề":{"Dell":["Bản lề trái","Bản lề phải","Bộ bản lề"],"HP":["Bản lề trái","Bản lề phải","Bộ bản lề"],"Lenovo":["Bản lề trái","Bản lề phải","Bộ bản lề"],"Asus":["Bản lề trái","Bản lề phải","Bộ bản lề"],"Acer":["Bản lề trái","Bản lề phải","Bộ bản lề"],"MSI":["Bản lề trái","Bản lề phải","Bộ bản lề"],"Universal":["Bản lề trái","Bản lề phải","Bộ bản lề"],"Khác":["Bản lề model khác"]},"Vít / Ốc / Cao su":{"Universal":["Bộ ốc laptop","Ốc M2","Ốc M2.5","Ốc M3","Ốc SSD M.2","Ốc bản lề","Chân cao su","Nút cao su bàn phím"],"Dell":["Bộ ốc Dell","Chân cao su Dell"],"HP":["Bộ ốc HP","Chân cao su HP"],"Lenovo":["Bộ ốc Lenovo","Chân cao su Lenovo"],"Asus":["Bộ ốc Asus","Chân cao su Asus"],"Acer":["Bộ ốc Acer","Chân cao su Acer"],"MSI":["Bộ ốc MSI","Chân cao su MSI"],"Khác":["Ốc/phụ kiện model khác"]},"Ăng-ten Wi-Fi":{"Universal":["Anten 1x1","Anten 2x2","Anten Wi-Fi kép","Anten Bluetooth"],"Dell":["Anten Dell 1x1","Anten Dell 2x2"],"HP":["Anten HP 1x1","Anten HP 2x2"],"Lenovo":["Anten Lenovo 1x1","Anten Lenovo 2x2"],"Asus":["Anten Asus 1x1","Anten Asus 2x2"],"Acer":["Anten Acer 1x1","Anten Acer 2x2"],"MSI":["Anten MSI 1x1","Anten MSI 2x2"],"Khác":["Anten model khác"]},"CMOS / BIOS":{"Universal":["Pin CMOS CR2032","Pin CMOS dây","BIOS chip","BIOS battery"],"Dell":["CMOS Dell","BIOS chip Dell"],"HP":["CMOS HP","BIOS chip HP"],"Lenovo":["CMOS Lenovo","BIOS chip Lenovo"],"Asus":["CMOS Asus","BIOS chip Asus"],"Acer":["CMOS Acer","BIOS chip Acer"],"MSI":["CMOS MSI","BIOS chip MSI"],"Khác":["CMOS/BIOS model khác"]},"GPU / VGA rời":{"NVIDIA":["GeForce MX110 2GB","GeForce MX150 2GB","GeForce MX250 2GB","GeForce MX350 2GB","GeForce MX450 2GB","GeForce GTX 1050 4GB","GeForce GTX 1650 4GB","GeForce RTX 2050 4GB","GeForce RTX 3050 4GB","GeForce RTX 3060 6GB","GeForce RTX 4050 6GB","GeForce RTX 4060 8GB"],"AMD":["Radeon 530 2GB","Radeon 540 2GB","Radeon RX 5500M 4GB","Radeon RX 6600M 8GB","Radeon RX 7600S 8GB"],"Khác":["VGA model khác"]},"CPU / Chip":{"Intel":["Celeron","Pentium","Core i3","Core i5","Core i7","Core i9","Core Ultra 5","Core Ultra 7","Core Ultra 9"],"AMD":["Athlon","Ryzen 3","Ryzen 5","Ryzen 7","Ryzen 9"],"Apple":["M1","M2","M3","M4"],"Khác":["CPU/chip model khác"]},"Phụ kiện sử dụng":{"Universal":["Chuột USB","Chuột Bluetooth","Bàn di chuột","Túi chống sốc","Balo laptop","Khóa laptop","USB hub","Hub USB-C","Cáp HDMI","Cáp DisplayPort","Cáp USB-C","Cáp mạng LAN","Đầu chuyển USB-C","Đầu chuyển HDMI","Tai nghe","Webcam USB","Đế laptop","Đế tản nhiệt"],"Dell":["Túi Dell","Balo Dell","Dock Dell","USB-C Dock Dell"],"HP":["Túi HP","Balo HP","Dock HP","USB-C Dock HP"],"Lenovo":["Túi Lenovo","Balo Lenovo","Dock Lenovo","USB-C Dock Lenovo"],"Asus":["Túi Asus","Balo Asus","Dock Asus","USB-C Dock Asus"],"Acer":["Túi Acer","Balo Acer","Dock Acer","USB-C Dock Acer"],"MSI":["Túi MSI","Balo MSI","Dock MSI","USB-C Dock MSI"],"Apple":["Magic Mouse","USB-C Hub","USB-C cable","MacBook sleeve"],"Khác":["Phụ kiện model khác"]},"Keo / Vật tư sửa chữa":{"Universal":["Keo tản nhiệt","Thermal pad 0.5mm","Thermal pad 1.0mm","Thermal pad 1.5mm","Thermal pad 2.0mm","Keo dán màn hình","Băng keo 2 mặt","Keo UV","Cồn vệ sinh","Khăn vệ sinh"],"Khác":["Vật tư sửa chữa khác"]},"Khác":{"Universal":["Linh kiện khác","Phụ kiện khác","Cáp khác","Board khác"],"Khác":["Linh kiện model khác"]}};
function setupPartModels(){
 const type=$("#partType"), brand=$("#partBrand"), model=$("#partModel");
 if(!type||!brand||!model)return;
 const fillBrands=()=>{brand.innerHTML='<option value="">-- Chọn hãng --</option>'+Object.keys(PART_MODEL_LIST[type.value]||{}).map(x=>`<option>${x}</option>`).join(""); model.innerHTML='<option value="">-- Chọn model linh kiện --</option>';};
 const fillModels=()=>{const list=(PART_MODEL_LIST[type.value]||{})[brand.value]||[]; model.innerHTML='<option value="">-- Chọn model linh kiện --</option>'+list.map(x=>`<option>${x}</option>`).join("");};
 type.onchange=fillBrands;
 brand.onchange=fillModels;
 fillBrands();
}
function partsPage(){
  $("#content").innerHTML=`<div class="grid2">
  <div class="panel"><h3>🔧 Thông tin linh kiện / phụ kiện</h3><div class="formgrid">
    <div class="field"><label>Loại linh kiện *</label><select id="partType">${Object.keys(PART_MODEL_LIST).map(x=>`<option>${escapeHtml(x)}</option>`).join("")}</select></div>
    <div class="field"><label>Hãng *</label><select id="partBrand"><option value="">-- Chọn hãng --</option></select></div>
    <div class="field full"><label>Model / Tên linh kiện *</label><select id="partModel"><option value="">-- Chọn model linh kiện --</option></select></div>
    <div class="field"><label>Mã linh kiện / Part Number</label><input id="partCode" placeholder="VD: M471A1K43DB1 / 0XJ8K4"></div>
    <div class="field"><label>Model laptop tương thích</label><input id="partCompatible" placeholder="VD: Dell Inspiron 15 3567"></div>
    <div class="field"><label>Số lượng *</label><input id="partQty" type="number" min="1" value="1"></div>
    <div class="field"><label>Giá nhập / cái *</label><input id="partPrice" type="text" inputmode="numeric" autocomplete="off" placeholder="250.000"></div>
    <div class="field"><label>Tình trạng</label><select id="partCondition"><option>Mới</option><option>Đã sử dụng - tốt</option><option>Đã sử dụng - khá</option><option>Đã sửa chữa</option><option>Thu hồi máy cũ</option><option>Lỗi / chờ sửa</option></select></div>
    <div class="field"><label>Vị trí để hàng</label><input id="partLocation" placeholder="Kệ A1 / Ngăn 02"></div>
    <div class="field full"><label>Thông số / Ghi chú</label><textarea id="partNote" placeholder="VD: DDR4 8GB 2666MHz; SATA 2.5; đã test OK; dùng cho model..."></textarea></div>
  </div>
  <div class="spec-display" style="margin-top:12px"><h3>⚡ Tóm tắt linh kiện</h3><div id="partSummary" class="muted">Chọn loại → hãng → model.</div></div>
  </div>

  <div class="panel"><h3>📷 Ảnh linh kiện thực tế</h3>
    <div class="actions"><button class="btn orange" id="partActualBtn">📷 CHỤP LINH KIỆN</button><button class="btn orange" id="partRecognize">🔍 TỰ NHẬN DIỆN MODEL</button>
    <input id="partActual" type="file" accept="image/*" capture="environment" hidden></div>
    <p class="muted">Chụp tem, mã part hoặc ảnh thực tế. Ảnh được lưu trực tiếp cùng linh kiện.</p>
    <div class="camera" id="partActualBox"><div><img id="partActualPreview" class="preview" hidden><div id="partActualText" class="muted">Chưa có ảnh thực tế</div></div></div>
    <div class="actions"><button class="btn green" id="savePart">💾 SAVE LINH KIỆN</button></div>
  </div></div>`;

  setupPartModels();
  const updateSummary=()=>{
    const type=$("#partType")?.value||"",brand=$("#partBrand")?.value||"",model=$("#partModel")?.value||"";
    const code=$("#partCode")?.value||"",compat=$("#partCompatible")?.value||"",condition=$("#partCondition")?.value||"";
    $("#partSummary").innerHTML=`<b>${escapeHtml(type)}</b> — ${escapeHtml(brand)} — ${escapeHtml(model)}<br>${code?`Mã: ${escapeHtml(code)}<br>`:""}${compat?`Tương thích: ${escapeHtml(compat)}<br>`:""}Tình trạng: ${escapeHtml(condition)}`;
  };
  ["partType","partBrand","partModel","partCondition"].forEach(id=>$("#"+id)?.addEventListener("change",updateSummary));
  ["partCode","partCompatible"].forEach(id=>$("#"+id)?.addEventListener("input",updateSummary));

  $("#partActualBtn").onclick=()=>openCameraCapture(data=>{$("#partActualPreview").src=data;$("#partActualPreview").hidden=false;$("#partActualText").textContent="Ảnh chụp camera";});
  $("#partActual").onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();r.onload=()=>{$("#partActualPreview").src=r.result;$("#partActualPreview").hidden=false;$("#partActualText").textContent="Ảnh thực tế đã chọn";};r.readAsDataURL(f);
  };
  $("#partRecognize").onclick=autoIdentifyPart;
  $("#partPrice").addEventListener("input",()=>{
    const el=$("#partPrice"),raw=(el.value||"").replace(/\D/g,"");
    el.value=raw?new Intl.NumberFormat("vi-VN").format(Number(raw)):"";
  });

  $("#savePart").onclick=async()=>{
    const type=$("#partType").value,brand=$("#partBrand").value,model=$("#partModel").value.trim();
    const qty=num("partQty"),price=num("partPrice");
    if(!brand||!model||qty<1||price<0)return alert("Hãy chọn Loại, Hãng, Model; nhập số lượng và giá nhập.");
    const item={id:Date.now(),type,brand,model,qty,price,
      code:$("#partCode").value.trim(),compatible:$("#partCompatible").value.trim(),
      condition:$("#partCondition").value,location:$("#partLocation").value.trim(),
      note:$("#partNote").value.trim(),actualImage:$("#partActualPreview").src||""};
    db.parts.push(item);
    await save();alert("Đã lưu linh kiện/phụ kiện vào KHO CHUNG.");await loadSharedDB();show("stock");
  };
  updateSummary();
}
async function autoIdentifyPart(){
  const file=$("#partActual")?.files?.[0];
  if(!file) return alert("Hãy chụp hoặc chọn ảnh linh kiện trước.");
  if(typeof Tesseract==="undefined") return alert("Chức năng nhận diện cần kết nối Internet lần đầu để tải bộ OCR.");
  const btn=$("#partRecognize"); btn.disabled=true; btn.textContent="⏳ ĐANG NHẬN DIỆN...";
  try{
    const result=await Tesseract.recognize(file,"eng",{logger:m=>{
      if(m.status==="recognizing text") btn.textContent=`⏳ OCR ${Math.round((m.progress||0)*100)}%`;
    }});
    const raw=(result.data.text||"").replace(/\s+/g," ").trim().toLowerCase();
    const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,"");
    let best={score:0,type:"",brand:"",model:""};
    for(const [type,brands] of Object.entries(PART_MODEL_LIST||{})){
      for(const [brand,models] of Object.entries(brands||{})){
        for(const model of models||[]){
          const nr=norm(raw), nb=norm(brand), nm=norm(model);
          let score=0;
          if(nr.includes(nb)) score+=25;
          if(nr.includes(nm)) score+=65;
          const tokens=nm.match(/[a-z]+|\d+/g)||[];
          score+=Math.min(30,tokens.filter(t=>t.length>=2&&nr.includes(t)).length*8);
          if(score>best.score) best={score,type,brand,model};
        }
      }
    }
    if(best.score<40){
      alert("Chưa nhận diện đủ chắc chắn. Hãy chụp rõ tem/model hoặc mã linh kiện.");
    }else{
      $("#partType").value=best.type;
      setupPartModels();
      $("#partBrand").value=best.brand;
      const evt=new Event("change"); $("#partBrand").dispatchEvent(evt);
      $("#partModel").value=best.model;
      alert(`Đã nhận diện gần đúng:\n${best.type} → ${best.brand} → ${best.model}\n\nBạn kiểm tra lại trước khi SAVE.`);
    }
  }catch(e){
    alert("Không nhận diện được linh kiện. Hãy chụp rõ tem/model.");
  }finally{
    btn.disabled=false; btn.textContent="🔍 TỰ NHẬN DIỆN MODEL";
  }
}
function libraryPage(){
  seedPreloadedModelImages();
  let cards=[];
  for(const [brand,models] of Object.entries(MODEL_LIST||{})){
    for(const model of models||[]){
      const src=getModelImage(brand,model);
      cards.push(`<div class="imagecard">${src?`<img src="${src}" onerror="imageError(this,'LAPTOP|${brand}|${model}')">`:`<div class="no-real-image">📷 Chưa có ảnh thật</div>`}<b>💻 ${brand} · ${model}</b></div>`);
    }
  }
  for(const [type,brands] of Object.entries(PART_MODEL_LIST||{})){
    for(const [brand,models] of Object.entries(brands||{})){
      for(const model of models||[]){
        const src=getPartImage(type,brand,model);
        cards.push(`<div class="imagecard">${src?`<img src="${src}" onerror="imageError(this,'PART|${type}|${brand}|${model}')">`:`<div class="no-real-image">📷 Chưa có ảnh thật</div>`}<b>🔧 ${type} · ${brand} · ${model}</b></div>`);
      }
    }
  }
  /* Ảnh tùy chỉnh của người dùng được ưu tiên; danh sách mẫu đã được tạo ở trên. */
  $("#content").innerHTML=`<div class="panel">
    <h3>📚 Thư viện ảnh Model</h3>
    <p class="muted">Mỗi Model có thể lưu một ảnh mẫu riêng. Chọn Hãng → Model ở Nhập kho sẽ hiện ảnh đã lưu trong Thư viện; không tự tìm ảnh trên Internet.</p>
    <div class="formgrid">
      <div class="field"><label>Hãng máy</label><select id="libBrand">${Object.keys(MODEL_LIST).map(x=>`<option>${x}</option>`).join("")}</select></div>
      <div class="field"><label>Model máy</label><select id="libModel"></select></div>
      <div class="field full"><label>🖼️ Ảnh thật của Model</label><input id="libImage" type="file" accept="image/*"><div class="camera"><img id="libPreview" class="preview" hidden></div></div>
      <div class="field full"><button class="btn green" id="saveLibImage">💾 LƯU ẢNH MẪU MODEL</button></div>
    </div>
    <div class="imagegrid">${cards.join("")||'<div class="empty">Chưa có ảnh mẫu. Hãy chọn Model và thêm ảnh thật tại đây.</div>'}</div>
  </div>`;
  const b=$("#libBrand"), m=$("#libModel"), f=$("#libImage"), p=$("#libPreview");
  const fill=()=>{
    const list=MODEL_LIST[b.value]||[];
    m.innerHTML=list.map(x=>`<option>${x}</option>`).join("");
    let src=(db.modelImages||{})["LAPTOP|"+b.value+"|"+m.value]||getModelImage(b.value,m.value)||"";
    if(src){p.src=src;p.hidden=false;}else{p.src="";p.hidden=true;}
  };
  b.onchange=fill; m.onchange=fill; fill();
  f.onchange=async()=>{
    const src=await fileToDataURL(f.files?.[0]);
    if(src){p.src=src;p.hidden=false;}
  };
  $("#saveLibImage").onclick=async()=>{
    const brand=b.value, model=m.value, src=await fileToDataURL(f.files?.[0]);
    if(!brand||!model||!src)return alert("Hãy chọn Hãng, Model và ảnh thật.");
    db.modelImages["LAPTOP|"+brand+"|"+model]=src;
    await save();
    alert(`Đã lưu ảnh mẫu cho ${brand} ${model}.`);
    libraryPage();
  };
}

function statisticsPage(){
  const now = new Date();
  const pad=n=>String(n).padStart(2,"0");
  const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const money=n=>new Intl.NumberFormat("vi-VN").format(Math.round(Number(n)||0))+" ₫";
  const arr=v=>Array.isArray(v)?v:[];
  const laptops=arr(db.laptops), parts=arr(db.parts), sales=arr(db.sales), partSales=arr(db.partSales||db.salesParts), repairs=arr(db.repairs);
  const startDefault=new Date(now.getFullYear(),now.getMonth(),1);
  $("#content").innerHTML=`
  <div class="panel">
    <h2>📊 Thống kê & Báo cáo</h2>
    <p class="muted">Theo dõi doanh thu, lợi nhuận, nhập kho, bán hàng, sửa chữa và tồn kho.</p>
    <div class="formgrid">
      <div class="field"><label>Từ ngày</label><input id="statFrom" type="date" value="${iso(startDefault)}"></div>
      <div class="field"><label>Đến ngày</label><input id="statTo" type="date" value="${iso(now)}"></div>
    </div>
    <div class="actions" style="margin-top:10px">
      <button class="btn blue" id="statMonth">📅 1 THÁNG</button>
      <button class="btn blue" id="statQuarter">📆 1 QUÝ</button>
      <button class="btn blue" id="statYear">🗓️ 1 NĂM</button>
      <button class="btn blue" id="statAll">📚 TẤT CẢ</button>
      <button class="btn green" id="statPrint">🖨️ IN BÁO CÁO</button>
    </div>
  </div>

  <div id="statCards" class="grid4" style="margin-top:14px"></div>
  <div class="grid2" style="margin-top:14px">
    <div class="panel"><h3>💰 Tài chính</h3><div id="statFinance"></div></div>
    <div class="panel"><h3>📦 Kho hàng</h3><div id="statStock"></div></div>
  </div>
  <div class="panel" style="margin-top:14px"><h3>🛠️ Sửa chữa</h3><div id="statRepair"></div></div>
  <div class="panel" style="margin-top:14px"><h3>📈 Doanh thu theo thời gian</h3><div id="statChart" style="min-height:260px"></div></div>
  <div class="panel" style="margin-top:14px"><h3>🏆 Top sản phẩm / dịch vụ</h3><div id="statTop"></div></div>
  `;

  function getDate(x){
    const v=x?.date||x?.createdAt||x?.created_at||x?.time||x?.timestamp;
    if(!v)return null;
    const d=new Date(v);
    return isNaN(d)?null:d;
  }
  function inRange(x,a,b){
    const d=getDate(x);
    if(!d)return true;
    const day=new Date(d.getFullYear(),d.getMonth(),d.getDate());
    return day>=a && day<=b;
  }
  function numVal(x){
    if(typeof x==="number")return x;
    return Number(String(x??0).replace(/[^\d-]/g,""))||0;
  }
  function qty(x){return Math.max(1,numVal(x.qty||x.quantity||1));}
  function saleRevenue(x){return numVal(x.total||x.totalPrice||x.amount||x.price||x.sellingPrice)*qty(x);}
  function saleCost(x){return numVal(x.cost||x.costPrice||x.purchasePrice||x.giaVon)*qty(x);}
  function setRange(type){
    let a,b;
    if(type==="month"){a=new Date(now.getFullYear(),now.getMonth(),1);b=new Date(now.getFullYear(),now.getMonth()+1,0);}
    else if(type==="quarter"){const q=Math.floor(now.getMonth()/3);a=new Date(now.getFullYear(),q*3,1);b=new Date(now.getFullYear(),q*3+3,0);}
    else if(type==="year"){a=new Date(now.getFullYear(),0,1);b=new Date(now.getFullYear(),11,31);}
    else {a=new Date(2000,0,1);b=new Date(2100,11,31);}
    $("#statFrom").value=iso(a); $("#statTo").value=iso(b); render();
  }
  function render(){
    const a=new Date($("#statFrom").value+"T00:00:00"), b=new Date($("#statTo").value+"T23:59:59");
    if(isNaN(a)||isNaN(b)||a>b)return;
    const ss=sales.filter(x=>inRange(x,a,b)), ps=partSales.filter(x=>inRange(x,a,b)), rs=repairs.filter(x=>inRange(x,a,b));
    const revenue=ss.reduce((t,x)=>t+saleRevenue(x),0)+ps.reduce((t,x)=>t+saleRevenue(x),0);
    const cost=ss.reduce((t,x)=>t+saleCost(x),0)+ps.reduce((t,x)=>t+saleCost(x),0);
    const repairMoney=rs.reduce((t,x)=>t+numVal(x.cost||x.total||x.price),0);
    const ls=(db.liquidations||[]).filter(x=>inRange(x,a,b));
    const liquidationMoney=ls.reduce((t,x)=>t+numVal(x.total||x.price),0);
    const profit=revenue-cost;
    const stockLaptop=laptops.reduce((t,x)=>t+Math.max(0,numVal(x.qty||x.quantity||x.soLuong)),0);
    const stockPart=parts.reduce((t,x)=>t+Math.max(0,numVal(x.qty||x.quantity)),0);
    const stockValue=laptops.reduce((t,x)=>t+numVal(x.cost||x.costPrice||x.price||x.giaNhap)*qty(x),0)+parts.reduce((t,x)=>t+numVal(x.price||x.cost||x.costPrice)*qty(x),0);
    const repairCount=rs.length;
    const soldQty=ss.reduce((t,x)=>t+qty(x),0)+ps.reduce((t,x)=>t+qty(x),0);
    $("#statCards").innerHTML=[
      ["💵","Doanh thu",money(revenue)],
      ["📈","Lợi nhuận tạm tính",money(profit)],
      ["🛒","Số lượng đã bán",soldQty],
      ["🛠️","Tiền sửa chữa",money(repairMoney)],["♻️","Tiền thanh lý",money(liquidationMoney)]
    ].map(x=>`<div class="panel"><div style="font-size:25px">${x[0]}</div><div class="muted">${x[1]}</div><h2>${x[2]}</h2></div>`).join("");
    $("#statFinance").innerHTML=`<p>Doanh thu bán laptop: <b>${money(ss.reduce((t,x)=>t+saleRevenue(x),0))}</b></p>
      <p>Doanh thu bán linh kiện: <b>${money(ps.reduce((t,x)=>t+saleRevenue(x),0))}</b></p>
      <p>Giá vốn hàng đã bán: <b>${money(cost)}</b></p>
      <p>Lợi nhuận tạm tính: <b>${money(profit)}</b></p>
      <p>Doanh thu + sửa chữa: <b>${money(revenue+repairMoney)}</b></p>`;
    $("#statStock").innerHTML=`<p>Laptop còn: <b>${stockLaptop}</b> máy</p>
      <p>Linh kiện còn: <b>${stockPart}</b> cái</p>
      <p>Giá trị kho hiện tại: <b>${money(stockValue)}</b></p>
      <p>Đơn bán laptop: <b>${ss.length}</b></p>
      <p>Đơn bán linh kiện: <b>${ps.length}</b></p>`;
    $("#statRepair").innerHTML=`<p>Số phiếu sửa chữa: <b>${repairCount}</b></p>
      <p>Tổng tiền sửa chữa: <b>${money(repairMoney)}</b></p>
      <p>Đang/đã tiếp nhận trong kỳ: <b>${rs.length}</b> phiếu</p>`;
    const groups={};
    ss.concat(ps).forEach(x=>{
      const name=x.model||x.name||x.product||x.item||"Không rõ";
      groups[name]=(groups[name]||0)+saleRevenue(x);
    });
    const top=Object.entries(groups).sort((a,b)=>b[1]-a[1]).slice(0,10);
    $("#statTop").innerHTML=top.length?`<table class="table"><thead><tr><th>#</th><th>Sản phẩm</th><th>Doanh thu</th></tr></thead><tbody>${top.map((x,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(x[0])}</td><td>${money(x[1])}</td></tr>`).join("")}</tbody></table>`:`<p class="muted">Chưa có dữ liệu bán hàng trong khoảng này.</p>`;
    const days={};
    ss.concat(ps).forEach(x=>{
      const d=getDate(x); if(!d)return;
      const k=iso(d); days[k]=(days[k]||0)+saleRevenue(x);
    });
    const chart=Object.entries(days).sort().slice(-31);
    $("#statChart").innerHTML=chart.length?chart.map(([d,v])=>`<div style="display:flex;gap:10px;align-items:center;margin:6px 0"><span style="width:100px">${d}</span><div style="height:22px;width:${Math.max(2,Math.min(100,(v/Math.max(...chart.map(z=>z[1]),1))*100))}%;background:#3b82f6;border-radius:4px"></div><b>${money(v)}</b></div>`).join(""):`<p class="muted">Chưa có dữ liệu doanh thu trong khoảng này.</p>`;
  }
  $("#statMonth").onclick=()=>setRange("month");
  $("#statQuarter").onclick=()=>setRange("quarter");
  $("#statYear").onclick=()=>setRange("year");
  $("#statAll").onclick=()=>setRange("all");
  $("#statFrom").onchange=render; $("#statTo").onchange=render;
  $("#statPrint").onclick=()=>{
    const w=window.open("","_blank");
    w.document.write(`<html><head><title>Báo cáo thống kê</title><style>body{font-family:Arial;padding:30px}h1{color:#111}table{border-collapse:collapse;width:100%}td,th{border:1px solid #aaa;padding:8px}</style></head><body><h1>LAPTOP VE CHAI .COM - BÁO CÁO THỐNG KÊ</h1><p>Từ ${$("#statFrom").value} đến ${$("#statTo").value}</p>${$("#statCards").outerHTML}${$("#statFinance").parentElement.outerHTML}${$("#statStock").parentElement.outerHTML}${$("#statRepair").parentElement.outerHTML}${$("#statTop").parentElement.outerHTML}</body></html>`);
    w.document.close(); w.focus(); setTimeout(()=>w.print(),300);
  };
  render();
}

function stockBulkBar(type,count){
  const label=type==='laptop'?'laptop':'linh kiện';
  return `<div class="actions stockBulkBar" style="justify-content:space-between;align-items:center;gap:8px;margin:8px 0 10px"><div style="display:flex;align-items:center;gap:10px"><span class="muted" data-stock-selected-count="${type}"></span></div><button class="btn red" onclick="deleteSelectedStock('${type}')" ${count?'':'disabled'}>🗑️ XÓA CÁC MỤC ĐÃ CHỌN</button></div>`;
}
function toggleStockSelection(type,checked){
  document.querySelectorAll(`input[data-stock-select="${type}"]`).forEach(b=>b.checked=checked);
  updateStockSelectionCount(type);
}
function updateStockSelectionCount(type){
  const ids=[...document.querySelectorAll(`input[data-stock-select="${type}"]:checked`)].map(b=>String(b.value));
  const unique=[...new Set(ids)];
  const el=document.querySelector(`[data-stock-selected-count="${type}"]`);
  if(el) el.textContent=unique.length?`Đã chọn ${unique.length} ${type==='laptop'?'laptop':'linh kiện'}`:'';
}
async function moveStockToTrash(type,id,skipConfirm=false){
  if(!canManageAccounts()) return alert('Chỉ Quản trị viên mới được xóa sản phẩm khỏi kho.');
  const list=type==='stockLaptop'?db.laptops:db.parts;
  const idx=list.findIndex(x=>x.id==id); if(idx<0)return;
  const record=list[idx];
  if(!skipConfirm && !confirm(`Chuyển sản phẩm này vào Thùng rác?\n\n${record.brand||record.type||''} — ${record.model||''}`))return;
  list.splice(idx,1); pushTrash(type,record);
}
async function deleteSelectedStock(type){
  if(!canManageAccounts()) return alert('Chỉ Quản trị viên mới được xóa sản phẩm khỏi kho.');
  const ids=[...new Set([...document.querySelectorAll(`input[data-stock-select="${type}"]:checked`)].map(b=>String(b.value)))];
  if(!ids.length)return alert('Bạn chưa chọn mục nào.');
  const list=type==='laptop'?db.laptops:db.parts;
  const selected=list.filter(x=>ids.includes(String(x.id)));
  if(!selected.length)return;
  const label=type==='laptop'?'laptop':'linh kiện';
  if(!confirm(`Chuyển ${selected.length} ${label} đã chọn vào Thùng rác?\n\nLịch sử bán hàng vẫn được giữ nguyên.`))return;
  const idSet=new Set(ids);
  for(const record of selected) pushTrash(type==='laptop'?'stockLaptop':'stockPart',record);
  for(let i=list.length-1;i>=0;i--) if(idSet.has(String(list[i].id))) list.splice(i,1);
  // Render trước, lưu nền sau.
  stockPage();
  save();
}

async function moveStockToLiquidation(type,id){
  if(!canManageAccounts())return alert('Chỉ Quản trị viên mới được chuyển hàng sang Thanh lý.');
  const list=type==='laptop'?db.laptops:db.parts; const x=list.find(a=>a.id==id); if(!x)return;
  const label=type==='laptop'?`${x.brand||''} ${x.model||''}`:`${x.type||'Linh kiện'} — ${x.brand||''} ${x.model||''}`;
  if(!confirm(`Chuyển "${label}" sang Thanh lý?\n\nMặt hàng sẽ rời khỏi Kho và xuất hiện trong Thanh lý.`))return;
  db.liquidationStock=db.liquidationStock||[];
  db.liquidationStock.push({id:Date.now()+Math.floor(Math.random()*1000),sourceType:type,sourceId:x.id,record:JSON.parse(JSON.stringify(x)),movedAt:new Date().toLocaleString('vi-VN')});
  if(type==='laptop')db.laptops=db.laptops.filter(a=>a.id!=id); else db.parts=db.parts.filter(a=>a.id!=id);
  // Render ngay tại trang hiện tại.
  stockPage();
  save();
}

async function returnLiquidationToStock(id){
  if(!canManageAccounts())return alert('Chỉ Quản trị viên mới được đưa hàng về Kho.');
  const arr=db.liquidationStock||[]; const idx=arr.findIndex(a=>a.id==id); if(idx<0)return; const item=arr[idx]; const x=item.record; const list=item.sourceType==='laptop'?db.laptops:db.parts;
  if(list.some(a=>a.id==x.id))return alert('Mặt hàng này đã tồn tại trong Kho.');
  list.push(x); arr.splice(idx,1); db.liquidationStock=arr; await save(); await loadSharedDB(); liquidationPage();
}
async function deleteLiquidationStock(id){
  if(!canManageAccounts())return alert('Chỉ Quản trị viên mới được xóa.');
  const arr=db.liquidationStock||[]; const idx=arr.findIndex(a=>a.id==id); if(idx<0)return;
  const item=arr[idx]; const x=item.record;
  if(!confirm(`Xóa vĩnh viễn "${x.brand||x.type||''} ${x.model||''}" khỏi Thanh lý?`))return;
  arr.splice(idx,1); db.liquidationStock=arr;
  liquidationPage();
  save();
}

function stockPage(){
  // V4.37: Phân loại theo LỊCH SỬ ĐÃ BÁN, không chỉ theo qty = 0.
  // Một món đã bán dù vẫn còn tồn kho sẽ xuất hiện ở khu vực ĐÃ BÁN,
  // đồng thời hiển thị số lượng còn lại để dễ theo dõi.
  const soldLaptopMap={};
  (db.sales||[]).forEach(sale=>{
    const brand=String(sale.brand||"").trim(), model=String(sale.model||"").trim();
    const qty=Number(sale.qty||0);
    const candidates=db.laptops.filter(x=>String(x.brand||"").trim()===brand && String(x.model||"").trim()===model);
    // Ưu tiên id nếu dữ liệu bán cũ có lưu id; nếu không thì ghép theo Hãng + Model.
    const target=(sale.laptopId!=null ? db.laptops.find(x=>x.id==sale.laptopId) : null) || candidates[0];
    if(target) soldLaptopMap[target.id]=(soldLaptopMap[target.id]||0)+qty;
  });

  const soldPartMap={};
  (db.partSales||[]).forEach(sale=>{
    const items=Array.isArray(sale.items)?sale.items:[];
    items.forEach(i=>{
      const qty=Number(i.qty||0);
      if(i.id!=null){
        soldPartMap[i.id]=(soldPartMap[i.id]||0)+qty;
      }else{
        // Hỗ trợ dữ liệu cũ chưa lưu id: ghép theo loại + hãng + model.
        const type=String(i.type||"").trim(), brand=String(i.brand||"").trim(), model=String(i.model||"").trim();
        const target=db.parts.find(x=>
          String(x.type||"").trim()===type &&
          String(x.brand||"").trim()===brand &&
          String(x.model||"").trim()===model
        );
        if(target) soldPartMap[target.id]=(soldPartMap[target.id]||0)+qty;
      }
    });
  });

  // V4.40: một mã hàng có thể vừa nằm ở CHƯA BÁN vừa nằm ở ĐÃ BÁN.
  // Ví dụ nhập 8 RAM, bán 1 => CHƯA BÁN còn 7 và ĐÃ BÁN ghi nhận 1.
  // Không được loại toàn bộ mã hàng khỏi CHƯA BÁN chỉ vì nó đã từng bán.
  const laptopSold=db.laptops.filter(x=>Number(soldLaptopMap[x.id]||0)>0);
  const laptopAvailable=db.laptops.filter(x=>Number(x.qty||0)>0);
  const laptopEmpty=db.laptops.filter(x=>Number(soldLaptopMap[x.id]||0)>0 && Number(x.qty||0)<=0);

  const partSold=db.parts.filter(x=>Number(soldPartMap[x.id]||0)>0);
  const partAvailable=db.parts.filter(x=>Number(x.qty||0)>0);
  const partEmpty=db.parts.filter(x=>Number(soldPartMap[x.id]||0)>0 && Number(x.qty||0)<=0);

  const laptopRow=x=>`<tr class="stock-row stock-available"><td><input type="checkbox" data-stock-select="laptop" value="${x.id}" onchange="updateStockSelectionCount('laptop')"></td><td>${escapeHtml(x.brand)}</td><td>${escapeHtml(x.model)}</td><td><span class="tag tag-available">CÒN ${Number(x.qty||0)}</span></td><td>${money(x.price)}</td><td>${money(x.repair)}</td><td>${money(x.cost)}</td><td class="stockActions"><button class="btn mini blue" onclick="viewLaptop(${x.id})">👁️ XEM</button><button class="btn mini orange" onclick="editLaptop(${x.id})">✏️ SỬA</button><button class="btn mini purple" onclick="moveStockToLiquidation('laptop',${x.id})">♻️ TL</button><button class="btn mini red" onclick="deleteLaptop(${x.id})">🗑️ XÓA</button></td></tr>`;

  const laptopSoldRow=x=>`<tr class="stock-row stock-sold"><td><input type="checkbox" data-stock-select="laptop" value="${x.id}" onchange="updateStockSelectionCount('laptop')"></td><td>${escapeHtml(x.brand)}</td><td>${escapeHtml(x.model)}</td><td><span class="tag tag-sold">ĐÃ BÁN ${Number(soldLaptopMap[x.id]||0)} • CÒN ${Number(x.qty||0)}</span></td><td>${money(x.price)}</td><td>${money(x.repair)}</td><td>${money(x.cost)}</td><td class="stockActions"><button class="btn mini blue" onclick="viewLaptop(${x.id})">👁️ XEM</button><button class="btn mini orange" onclick="editLaptop(${x.id})">✏️ SỬA</button><button class="btn mini purple" onclick="moveStockToLiquidation('laptop',${x.id})">♻️ TL</button><button class="btn mini red" onclick="deleteLaptop(${x.id})">🗑️ XÓA</button></td></tr>`;

  const laptopEmptyRow=x=>`<tr class="stock-row stock-sold"><td><input type="checkbox" data-stock-select="laptop" value="${x.id}" onchange="updateStockSelectionCount('laptop')"></td><td>${escapeHtml(x.brand)}</td><td>${escapeHtml(x.model)}</td><td><span class="tag tag-sold">HẾT KHO</span></td><td>${money(x.price)}</td><td>${money(x.repair)}</td><td>${money(x.cost)}</td><td class="stockActions"><button class="btn mini blue" onclick="viewLaptop(${x.id})">👁️ XEM</button><button class="btn mini orange" onclick="editLaptop(${x.id})">✏️ SỬA</button><button class="btn mini purple" onclick="moveStockToLiquidation('laptop',${x.id})">♻️ TL</button><button class="btn mini red" onclick="deleteLaptop(${x.id})">🗑️ XÓA</button></td></tr>`;

  const partRow=x=>`<tr class="stock-row stock-available"><td><input type="checkbox" data-stock-select="part" value="${x.id}" onchange="updateStockSelectionCount('part')"></td><td>${escapeHtml(x.type)}</td><td>${escapeHtml(x.brand)}</td><td>${escapeHtml(x.model)}</td><td><span class="tag tag-available">CÒN ${Number(x.qty||0)}</span></td><td>${money(x.price)}</td><td class="stockActions"><button class="btn mini blue" onclick="viewPart(${x.id})">👁️ XEM</button><button class="btn mini orange" onclick="editPart(${x.id})">✏️ SỬA</button><button class="btn mini purple" onclick="moveStockToLiquidation('part',${x.id})">♻️ TL</button><button class="btn mini red" onclick="deletePart(${x.id})">🗑️ XÓA</button></td></tr>`;

  const partSoldRow=x=>`<tr class="stock-row stock-sold"><td><input type="checkbox" data-stock-select="part" value="${x.id}" onchange="updateStockSelectionCount('part')"></td><td>${escapeHtml(x.type)}</td><td>${escapeHtml(x.brand)}</td><td>${escapeHtml(x.model)}</td><td><span class="tag tag-sold">ĐÃ BÁN ${Number(soldPartMap[x.id]||0)} • CÒN ${Number(x.qty||0)}</span></td><td>${money(x.price)}</td><td class="stockActions"><button class="btn mini blue" onclick="viewPart(${x.id})">👁️ XEM</button><button class="btn mini orange" onclick="editPart(${x.id})">✏️ SỬA</button><button class="btn mini purple" onclick="moveStockToLiquidation('part',${x.id})">♻️ TL</button><button class="btn mini red" onclick="deletePart(${x.id})">🗑️ XÓA</button></td></tr>`;

  const partEmptyRow=x=>`<tr class="stock-row stock-sold"><td><input type="checkbox" data-stock-select="part" value="${x.id}" onchange="updateStockSelectionCount('part')"></td><td>${escapeHtml(x.type)}</td><td>${escapeHtml(x.brand)}</td><td>${escapeHtml(x.model)}</td><td><span class="tag tag-sold">HẾT KHO</span></td><td>${money(x.price)}</td><td class="stockActions"><button class="btn mini blue" onclick="viewPart(${x.id})">👁️ XEM</button><button class="btn mini orange" onclick="editPart(${x.id})">✏️ SỬA</button><button class="btn mini purple" onclick="moveStockToLiquidation('part',${x.id})">♻️ TL</button><button class="btn mini red" onclick="deletePart(${x.id})">🗑️ XÓA</button></td></tr>`;

  let laptopPurchase=db.laptops.reduce((a,x)=>a+Number(x.price||0)*Number(x.qty||0),0);
  let laptopCost=db.laptops.reduce((a,x)=>a+Number(x.cost||0)*Number(x.qty||0),0);
  let partValue=db.parts.reduce((a,x)=>a+Number(x.price||0)*Number(x.qty||0),0);
  let totalInventory=laptopCost+partValue;
  let laptopQty=db.laptops.reduce((a,x)=>a+Number(x.qty||0),0);
  let partQty=db.parts.reduce((a,x)=>a+Number(x.qty||0),0);

  const laptopTable=(rows,empty)=>`<div class="tablewrap"><table class="table"><thead><tr><th><input type="checkbox" onchange="toggleStockSelection('laptop',this.checked)" title="Chọn tất cả laptop"></th><th>Hãng</th><th>Model</th><th>Còn / trạng thái</th><th>Giá nhập / máy</th><th>Sửa chữa / máy</th><th>Giá vốn / máy</th><th>Thao tác</th></tr></thead><tbody>${rows||`<tr><td colspan="8" class="empty">${empty}</td></tr>`}</tbody></table></div>`;
  const partTable=(rows,empty)=>`<div class="tablewrap"><table class="table"><thead><tr><th><input type="checkbox" onchange="toggleStockSelection('part',this.checked)" title="Chọn tất cả linh kiện"></th><th>Loại</th><th>Hãng</th><th>Model</th><th>Còn / trạng thái</th><th>Giá / cái</th><th>Thao tác</th></tr></thead><tbody>${rows||`<tr><td colspan="7" class="empty">${empty}</td></tr>`}</tbody></table></div>`;

  // FIX V4.65: stockPage() must build its own Thanh lý cards.
  // The previous build referenced heldCards from liquidationPage(), where it was local,
  // causing a ReferenceError and leaving the previous page visible when opening Kho.
  const held=db.liquidationStock||[];
  const heldCards=held.length?held.map(item=>{
    const x=item.record||{};
    const img=item.sourceType==='laptop'?getLaptopDisplayImage(x):getPartDisplayImage(x);
    const name=item.sourceType==='laptop'
      ?`${x.brand||''} — ${x.model||''}`
      :`${x.type||'Linh kiện'} — ${x.brand||''} — ${x.model||''}`;
    return `<div class="panel" style="margin-top:12px"><div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
      <img src="${img||''}" onerror="this.style.display='none'" style="width:120px;height:85px;object-fit:contain;border-radius:10px;background:#08111f;border:1px solid #29476a">
      <div style="flex:1;min-width:240px">
        <h3 style="margin:0">${escapeHtml(name)}</h3>
        <p class="muted">${item.sourceType==='laptop'?'💻 Laptop':'🔧 Linh kiện'} • SL: ${Number(x.qty||0)} • Chuyển lúc: ${escapeHtml(item.movedAt||'')}</p>
        <p class="muted">Giá: ${money(x.price||x.cost||0)}</p>
      </div>
      <div class="actions">
        <button class="btn blue" onclick="viewLiquidationStock(${item.id})">👁️ XEM</button>
        <button class="btn green" onclick="returnLiquidationToStock(${item.id})">📦 KHO</button>
        <button class="btn red" onclick="deleteLiquidationStock(${item.id})">🗑️ XÓA</button>
      </div>
    </div></div>`;
  }).join(''):'<div class="empty" style="padding:25px">Chưa có laptop/linh kiện nào trong Thanh lý.</div>';

  const laptopAvailRows=laptopAvailable.map(laptopRow).join('');
  const laptopSoldRows=[...laptopSold,...laptopEmpty].map(laptopSoldRow).join('');
  const partAvailRows=partAvailable.map(partRow).join('');
  const partSoldRows=[...partSold,...partEmpty].map(partSoldRow).join('');

  $('#content').innerHTML=`<div class="stockPageVertical">
    <div class="cards stockSummary">
      <div class="card"><label>💻 MÁY CHƯA BÁN</label><strong>${laptopAvailable.reduce((a,x)=>a+Number(x.qty||0),0)}</strong></div>
      <div class="card"><label>🔧 LINH KIỆN CHƯA BÁN</label><strong>${partAvailable.reduce((a,x)=>a+Number(x.qty||0),0)}</strong></div>
      <div class="card"><label>💰 TỔNG GIÁ NHẬP LAPTOP</label><strong>${money(laptopPurchase)}</strong></div>
      <div class="card"><label>🔧 TỔNG GIÁ LINH KIỆN</label><strong>${money(partValue)}</strong></div>
      <div class="card"><label>📦 TỔNG GIÁ VỐN TỒN KHO</label><strong>${money(totalInventory)}</strong></div>
    </div>
    <div class="stockTwoCols stockTwoColsCompact">
      <div class="panel stockColumn stockColumnLaptop">
        <div class="stockColumnHeader"><h3>💻 KHO LAPTOP</h3><span>${laptopAvailable.length+laptopSold.length+laptopEmpty.length} mẫu</span></div>
        ${stockBulkBar('laptop',laptopAvailable.length+laptopSold.length+laptopEmpty.length)}
        <div class="stockSubGroup stockSubAvailable">
          <div class="stockGroupTitle"><h4>🟢 CHƯA BÁN</h4><span>${laptopAvailable.length} mẫu</span></div>
          <input class="search" id="stockSearchAvailable" placeholder="Tìm hãng hoặc model...">
          <div id="laptopAvailableWrap">${laptopTable(laptopAvailRows,'Không có laptop chưa bán')}</div>
        </div>
        <div class="stockDivider"></div>
        <div class="stockSubGroup stockSubSold">
          <div class="stockGroupTitle"><h4>🔴 ĐÃ BÁN</h4><span>${laptopSold.length+laptopEmpty.length} mẫu</span></div>
          <input class="search" id="stockSearchSold" placeholder="Tìm hãng hoặc model đã bán...">
          <div id="laptopSoldWrap">${laptopTable(laptopSoldRows,'Chưa có laptop đã bán')}</div>
        </div>
      </div>
      <div class="panel stockColumn stockColumnParts">
        <div class="stockColumnHeader"><h3>🔧 KHO LINH KIỆN</h3><span>${partAvailable.length+partSold.length+partEmpty.length} mẫu</span></div>
        ${stockBulkBar('part',partAvailable.length+partSold.length+partEmpty.length)}
        <div class="stockSubGroup stockSubAvailable">
          <div class="stockGroupTitle"><h4>🟢 CHƯA BÁN</h4><span>${partAvailable.length} mẫu</span></div>
          <input class="search" id="partStockSearchAvailable" placeholder="Tìm loại, hãng hoặc model linh kiện...">
          <div id="partAvailableWrap">${partTable(partAvailRows,'Không có linh kiện chưa bán')}</div>
        </div>
        <div class="stockDivider"></div>
        <div class="stockSubGroup stockSubSold">
          <div class="stockGroupTitle"><h4>🔴 ĐÃ BÁN</h4><span>${partSold.length+partEmpty.length} mẫu</span></div>
          <input class="search" id="partStockSearchSold" placeholder="Tìm loại, hãng hoặc model đã bán...">
          <div id="partSoldWrap">${partTable(partSoldRows,'Chưa có linh kiện đã bán')}</div>
        </div>
      </div>
    </div>
    <div class="panel"><div class="detailInfo"><b>💰 Tổng giá trị laptop theo giá vốn:</b> ${money(laptopCost)} &nbsp;&nbsp; <b>🔧 Tổng giá trị linh kiện:</b> ${money(partValue)} &nbsp;&nbsp; <b>📦 Tổng toàn bộ kho:</b> ${money(totalInventory)}</div></div>
    </div>`;

  const bindSearch=(inputId,wrapId)=>{
    const el=$('#'+inputId);if(!el)return;
    el.oninput=e=>{
      const q=e.target.value.toLowerCase();
      document.querySelectorAll('#'+wrapId+' tbody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?'':'none');
    };
  };
  bindSearch('stockSearchAvailable','laptopAvailableWrap');
  bindSearch('stockSearchSold','laptopSoldWrap');
  bindSearch('partStockSearchAvailable','partAvailableWrap');
  bindSearch('partStockSearchSold','partSoldWrap');
  const refreshStockBtn=$("#refreshStockBtn");
  if(refreshStockBtn) refreshStockBtn.onclick=()=>{ stockPage(); };
}
function closeStockModal(){const m=$("#stockModal");if(m)m.remove()}
function showStockModal(html){closeStockModal();document.body.insertAdjacentHTML("beforeend",`<div id="stockModal" class="stockModal" onclick="if(event.target===this)closeStockModal()"><div class="stockModalCard">${html}<button class="modalClose" onclick="closeStockModal()">✕</button></div></div>`);bindMoneyInputs(document.getElementById("stockModal")||document)}
function escapeHtml(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function viewLaptop(id){
  const x=db.laptops.find(a=>a.id==id);if(!x)return;
  const libraryImage=getLaptopDisplayImage(x);
  const repairItems=[
    ["⌨️ Bàn phím"+(x.keyboardType?" — "+x.keyboardType:""),Number(x.keyboard||0)],
    ["🖥️ Màn hình"+(x.screenType?" — "+x.screenType:""),Number(x.screen||0)],
    ["💾 RAM"+(x.ramSpec?" — "+x.ramSpec:""),Number(x.ram||0)],
    ["💿 Ổ cứng"+(x.ssdSpec?" — "+x.ssdSpec:""),Number(x.ssd||0)],
    ["🔧 "+(x.otherDesc||"Sửa chữa khác"),Number(x.other||0)]
  ];
  const repairTotal=repairItems.reduce((s,a)=>s+a[1],0);
  // Đồng bộ lại tổng sửa chữa/giá vốn để dữ liệu cũ cũng hiển thị đúng.
  x.repair=repairTotal;
  x.cost=Number(x.price||0)+repairTotal;
  const repairRows=repairItems.map(([label,value])=>`<div class="repairDetailRow"><span>${label}</span><strong>${money(value)}</strong></div>`).join("");
  showStockModal(`<h2>💻 ${escapeHtml(x.brand)} ${escapeHtml(x.model)}</h2>
  <div class="detailGrid">
    <div><img class="detailImage" src="${libraryImage||''}" onerror="this.style.display='none'"/><p class="muted">Ảnh mẫu Model</p></div>
    <div><img class="detailImage" src="${x.actualImage||''}" onerror="this.style.display='none'"/><p class="muted">Ảnh thực tế đã chụp</p></div>
  </div>
  <div class="detailInfo">
    <b>Hãng:</b> ${escapeHtml(x.brand)}<br>
    <b>Model:</b> ${escapeHtml(x.model)}<br>
    <b>Số lượng còn:</b> ${x.qty}<br>
    <b>Giá nhập:</b> ${money(x.price)}<br>
    <b>Tổng sửa chữa:</b> ${money(repairTotal)}<br>
    <b>Giá vốn:</b> ${money(x.cost)}
  </div>
  <div class="spec-display"><h3>📝 Thông số Model</h3><div>${escapeHtml(x.modelSpecs||db.modelSpecs?.["LAPTOP|"+x.brand+"|"+x.model]||"").replace(/\n/g,"<br>")||'<span class="muted">Chưa có thông số Model.</span>'}</div></div>
  <div class="spec-display repair-detail-box"><h3>🔧 Chi tiết sửa chữa / nâng cấp</h3>${repairRows}<div class="repairDetailTotal"><span>💰 Tổng sửa chữa</span><strong>${money(repairTotal)}</strong></div></div>
  <div class="spec-display"><h3>🛡️ Bảo hành sửa chữa / nâng cấp</h3><div class="detailInfo">${escapeHtml(warrantyText(x.repairWarrantyStart||"",x.repairWarranty||"0",x.repairWarrantyEnd||""))}</div></div>
  <div class="actions"><button class="btn orange" onclick="closeStockModal();editLaptop(${x.id})">✏️ SỬA THÔNG TIN</button><button class="btn red" onclick="closeStockModal();deleteLaptop(${x.id})">🗑️ XÓA MÁY</button></div>`);
}
function editLaptop(id){
  const x=db.laptops.find(a=>a.id==id);if(!x)return;
  const photo=x.actualImage||'';
  showStockModal(`<h2>✏️ Sửa laptop</h2>
  <div class="detailGrid photoEditGrid">
    <div><div class="field"><label>📷 Ảnh thực tế hiện tại</label>
      <div class="photoEditBox">
        ${photo?`<img id="editPhotoPreview" class="detailImage" src="${photo}"/>`:`<div id="editPhotoEmpty" class="muted">Chưa có ảnh thực tế</div>`}
      </div>
    </div></div>
    <div><div class="field"><label>Thay ảnh / chụp lại</label>
      <input id="editPhoto" type="file" accept="image/*" capture="environment" hidden>
      <div class="actions photoActions">
        <button type="button" class="btn blue" id="editPhotoBtn">📷 CHỤP / CHỌN ẢNH MỚI</button>
        <button type="button" class="btn red" id="deletePhotoBtn">🗑️ XÓA ẢNH</button>
      </div>
      <p class="muted">Bạn có thể xóa ảnh cũ rồi chụp lại. Ảnh chỉ bị xóa khỏi laptop này, không xóa laptop.</p>
    </div></div>
  </div>
  <div class="formgrid">
    <div class="field"><label>Hãng</label><input id="editBrand" value="${escapeHtml(x.brand)}"></div>
    <div class="field"><label>Model</label><input id="editModel" value="${escapeHtml(x.model)}"></div>
    <div class="field"><label>Số lượng</label><input id="editQty" type="number" min="0" value="${x.qty}"></div>
    <div class="field"><label>Giá nhập</label><input id="editPrice" type="text" inputmode="numeric" value="${new Intl.NumberFormat("vi-VN").format(Number(x.price||0))}"></div>
    <div class="field"><label>Bàn phím — hãng / loại</label><select id="editKeyboardType"><option value="">-- Không thay --</option><option>Dell</option><option>HP</option><option>Lenovo</option><option>Asus</option><option>Acer</option><option>MSI</option><option>Apple</option><option>Microsoft Surface</option><option>Samsung</option><option>LG</option><option>Generic / Linh kiện thay thế</option></select></div><div class="field"><label>Giá bàn phím</label><input id="editKeyboard" type="text" inputmode="numeric" value="${new Intl.NumberFormat("vi-VN").format(Number(x.keyboard||0))}"></div>
    <div class="field"><label>Màn hình — kích thước / loại</label><select id="editScreenType"><option value="">-- Không thay --</option><option>11,6 inch</option><option>12,5 inch</option><option>13,3 inch</option><option>14 inch</option><option>15,6 inch</option><option>17,3 inch</option><option>HD</option><option>Full HD</option><option>2K</option><option>4K</option></select></div><div class="field"><label>Giá màn hình</label><input id="editScreen" type="text" inputmode="numeric" value="${new Intl.NumberFormat("vi-VN").format(Number(x.screen||0))}"></div>
    <div class="field"><label>RAM — dung lượng</label><select id="editRamSpec"><option value="">-- Không thay --</option><option>2G</option><option>4G</option><option>8G</option><option>16G</option><option>32G</option><option>64G</option><option>128G</option></select></div><div class="field"><label>Giá RAM</label><input id="editRam" type="text" inputmode="numeric" value="${new Intl.NumberFormat("vi-VN").format(Number(x.ram||0))}"></div>
    <div class="field"><label>Ổ cứng — loại + dung lượng</label><select id="editSsdSpec"><option value="">-- Không thay --</option><optgroup label="SSD"><option>SSD 128G</option><option>SSD 256G</option><option>SSD 512G</option><option>SSD 1TB</option><option>SSD 2TB</option><option>SSD 4TB</option></optgroup><optgroup label="HDD"><option>HDD 320G</option><option>HDD 500G</option><option>HDD 750G</option><option>HDD 1TB</option><option>HDD 2TB</option><option>HDD 4TB</option></optgroup></select></div><div class="field"><label>Giá ổ cứng</label><input id="editSsd" type="text" inputmode="numeric" value="${new Intl.NumberFormat("vi-VN").format(Number(x.ssd||0))}"></div>
    <div class="field full"><label>Sửa chữa khác — nội dung</label><input id="editOtherDesc" type="text" value="${escapeHtml(x.otherDesc||"")}" placeholder="VD: sửa cổng USB, bản lề, loa..."></div><div class="field"><label>Chi phí khác</label><input id="editOther" type="text" inputmode="numeric" value="${new Intl.NumberFormat("vi-VN").format(Number(x.other||0))}"></div>
    <div class="field"><label>🛡️ Bảo hành sửa chữa / nâng cấp</label><select id="editRepairWarranty"><option value="0">Không bảo hành</option><option value="1w">1 tuần</option><option value="2w">2 tuần</option><option value="3w">3 tuần</option><option value="1m">1 tháng</option><option value="2m">2 tháng</option><option value="3m">3 tháng</option><option value="6m">6 tháng</option><option value="9m">9 tháng</option><option value="12m">12 tháng</option></select></div>
    <div class="field"><label>Ngày bắt đầu bảo hành</label><input id="editRepairWarrantyStart" type="date" value="${escapeHtml(x.repairWarrantyStart||"")}"></div>
    <div class="field"><label>Ngày hết hạn</label><input id="editRepairWarrantyEnd" type="date" value="${escapeHtml(x.repairWarrantyEnd||"")}" readonly></div>
    <div class="field full"><label>📝 Thông số Model</label><textarea id="editModelSpecs" placeholder="CPU, RAM, SSD, màn hình, VGA...">${escapeHtml(x.modelSpecs||db.modelSpecs?.["LAPTOP|"+x.brand+"|"+x.model]||"")}</textarea></div>
  </div>
  <div class="detailInfo" id="editCost">Giá vốn: ${money(x.cost)}</div>
  <div class="actions"><button class="btn green" onclick="saveLaptopEdit(${x.id})">💾 LƯU THAY ĐỔI</button><button class="btn gray" onclick="closeStockModal()">HỦY</button></div>`);
  $("#editKeyboardType").value=x.keyboardType||"";$("#editScreenType").value=x.screenType||"";$("#editRamSpec").value=x.ramSpec||"";$("#editSsdSpec").value=x.ssdSpec||"";$("#editRepairWarranty").value=x.repairWarranty||"0";if($("#editRepairWarrantyStart")&&!$("#editRepairWarrantyStart").value&&x.repairWarranty)$("#editRepairWarrantyStart").value=new Date().toISOString().slice(0,10);function updateEditWarranty(){const st=$("#editRepairWarrantyStart")?.value||"",du=$("#editRepairWarranty")?.value||"0";if($("#editRepairWarrantyEnd"))$("#editRepairWarrantyEnd").value=warrantyEndDate(st,du);}$("#editRepairWarranty")?.addEventListener("change",updateEditWarranty);$("#editRepairWarrantyStart")?.addEventListener("change",updateEditWarranty);updateEditWarranty();
  const photoInput=$("#editPhoto");
  $("#editPhotoBtn").onclick=()=>openCameraCapture(data=>{x._pendingActualImage=data;const box=document.querySelector(".photoEditBox");if(box)box.innerHTML=`<img id="editPhotoPreview" class="detailImage" src="${data}"/>`;});
  $("#deletePhotoBtn").onclick=async()=>{if(!x.actualImage)return alert("Máy này chưa có ảnh thực tế để xóa.");if(!confirm("Xóa ảnh thực tế của máy này? Bạn vẫn giữ nguyên laptop và thông tin."))return;x.actualImage="";await save();await loadSharedDB();editLaptop(id);};
  photoInput.onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{x._pendingActualImage=r.result;const box=document.querySelector('.photoEditBox');if(box)box.innerHTML=`<img id="editPhotoPreview" class="detailImage" src="${r.result}"/>`;};r.readAsDataURL(f);};
  bindMoneyInputs(document.getElementById("stockModal")||document);
}
async function saveLaptopEdit(id){
  const x=db.laptops.find(a=>a.id==id);if(!x)return;
  const n=v=>parseMoneyValue($(v)?.value||0);
  x.brand=$("#editBrand").value.trim();x.model=$("#editModel").value.trim();x.qty=n("#editQty");x.price=n("#editPrice");
  x.keyboard=n("#editKeyboard");x.keyboardType=$("#editKeyboardType")?.value||"";x.repairWarranty=$("#editRepairWarranty")?.value||"0";x.repairWarrantyStart=$("#editRepairWarrantyStart")?.value||"";x.repairWarrantyEnd=$("#editRepairWarrantyEnd")?.value||warrantyEndDate(x.repairWarrantyStart,x.repairWarranty);x.screen=n("#editScreen");x.screenType=$("#editScreenType")?.value||"";x.ram=n("#editRam");x.ramSpec=$("#editRamSpec")?.value||"";x.ssd=n("#editSsd");x.ssdSpec=$("#editSsdSpec")?.value||"";x.other=n("#editOther");x.otherDesc=$("#editOtherDesc")?.value.trim()||"";
  x.modelSpecs=$("#editModelSpecs")?.value.trim()||"";
  if(x._pendingActualImage){x.actualImage=await compressImageDataURL(x._pendingActualImage,640,.62);delete x._pendingActualImage;}
  db.modelSpecs=db.modelSpecs||{};db.modelSpecs["LAPTOP|"+x.brand+"|"+x.model]=x.modelSpecs;
  x.repair=x.keyboard+x.screen+x.ram+x.ssd+x.other;x.cost=x.price+x.repair;
  await save();await loadSharedDB();closeStockModal();stockPage();
}
async function deleteLaptop(id){
  if(!canManageAccounts())return alert("Chỉ Quản trị viên mới được xóa laptop.");
  const x=db.laptops.find(a=>a.id==id);if(!x)return;
  if(!confirm("Chuyển laptop này vào Thùng rác?"))return;
  db.laptops=db.laptops.filter(a=>a.id!=id);
  pushTrash("stockLaptop",x);
  stockPage();
  save();
}

function viewPart(id){const x=db.parts.find(a=>a.id==id);if(!x)return;showStockModal(`<h2>🔧 ${x.type}</h2><div class="detailGrid"><div><img class="detailImage" src="${x.modelImage||''}" onerror="this.style.display='none'"/><p class="muted">Ảnh linh kiện</p></div><div><img class="detailImage" src="${x.actualImage||''}" onerror="this.style.display='none'"/><p class="muted">Ảnh thực tế</p></div></div><div class="detailInfo"><b>Loại:</b> ${x.type}<br><b>Hãng:</b> ${x.brand}<br><b>Model:</b> ${x.model}<br><b>Số lượng còn:</b> ${x.qty}<br><b>Giá nhập:</b> ${money(x.price)}<br><b>Ghi chú:</b> ${x.note||''}</div><div class="actions"><button class="btn orange" onclick="closeStockModal();editPart(${x.id})">✏️ SỬA THÔNG TIN</button><button class="btn red" onclick="closeStockModal();deletePart(${x.id})">🗑️ XÓA</button></div>`)}
function editPart(id){const x=db.parts.find(a=>a.id==id);if(!x)return;showStockModal(`<h2>✏️ Sửa linh kiện</h2><div class="formgrid"><div class="field"><label>Loại</label><input id="editPartType" value="${x.type}"></div><div class="field"><label>Hãng</label><input id="editPartBrand" value="${x.brand}"></div><div class="field"><label>Model</label><input id="editPartModel" value="${x.model}"></div><div class="field"><label>Số lượng</label><input id="editPartQty" type="number" min="0" value="${x.qty}"></div><div class="field"><label>Giá nhập</label><input id="editPartPrice" type="text" inputmode="numeric" value="${new Intl.NumberFormat("vi-VN").format(Number(x.price||0))}"></div><div class="field full"><label>Ghi chú</label><input id="editPartNote" value="${x.note||''}"></div></div><div class="actions"><button class="btn green" onclick="savePartEdit(${x.id})">💾 LƯU THAY ĐỔI</button><button class="btn gray" onclick="closeStockModal()">HỦY</button></div>`)}
async function savePartEdit(id){const x=db.parts.find(a=>a.id==id);if(!x)return;x.type=$("#editPartType").value.trim();x.brand=$("#editPartBrand").value.trim();x.model=$("#editPartModel").value.trim();x.qty=parseMoneyValue($("#editPartQty").value||0);x.price=parseMoneyValue($("#editPartPrice").value||0);x.note=$("#editPartNote").value;await save();await loadSharedDB();closeStockModal();stockPage()}
async function deletePart(id){
  if(!canManageAccounts())return alert("Chỉ Quản trị viên mới được xóa linh kiện.");
  const x=db.parts.find(a=>a.id==id);if(!x)return;
  if(!confirm("Chuyển linh kiện này vào Thùng rác?"))return;
  db.parts=db.parts.filter(a=>a.id!=id);
  pushTrash("stockPart",x);
  stockPage();
  save();
}

function salesPage(){
  const available=db.laptops.filter(x=>x.qty>0);
  const rows=db.sales.slice().reverse().slice(0,30).map(x=>`
    <tr>
      <td>${escapeHtml(x.time||"")}</td>
      <td>${escapeHtml(x.customer||"")}<br><small>${escapeHtml(x.phone||"")}</small></td>
      <td>${escapeHtml(x.name||"")}</td>
      <td>${x.qty||1}</td>
      <td>${money(x.price||0)}</td>
      <td><strong>${money(x.total||0)}</strong></td>
      <td>${escapeHtml(x.warrantyStart&&x.warranty ? warrantyText(x.warrantyStart,x.warranty,x.warrantyEnd) : (x.warrantyLabel||""))}</td>
      <td><button class="btn blue" onclick="printSale(${x.id})">🖨️ IN PHIẾU</button></td>
    </tr>`).join("");

  $("#content").innerHTML=`<div class="panel">
    <h3>🛒 Bán laptop</h3>
    <div class="formgrid">
      <div class="field full"><label>Chọn máy trong kho *</label>
        <select id="saleItem">${available.map(x=>`<option value="${x.id}">${escapeHtml(x.brand||"")} ${escapeHtml(x.model||"")} — còn ${x.qty}</option>`).join("")||'<option value="">-- Kho chưa có laptop --</option>'}</select>
      </div>
      <div class="field"><label>Số lượng *</label><input id="saleQty" type="number" min="1" value="1"></div>
      <div class="field"><label>Giá bán / cái *</label><input id="salePrice" type="text" inputmode="numeric" autocomplete="off" placeholder="6.500.000"></div>
      <div class="field"><label>Tên khách hàng *</label><input id="customer" placeholder="Nguyễn Văn A"></div>
      <div class="field"><label>Số điện thoại</label><input id="phone" placeholder="09..."></div>

      <div class="field full"><label>📝 Ghi chú / phụ kiện / thỏa thuận với khách</label>
        <textarea id="saleNote" placeholder="VD: Tặng túi, chuột; đã cài Windows; máy đã kiểm tra đầy đủ; khách nhận máy ngày..."></textarea>
      </div>

      <div class="field"><label>🛡️ Bảo hành</label><select id="saleWarranty">
        <option value="0">Không bảo hành</option><option value="1w">1 tuần</option><option value="2w">2 tuần</option><option value="3w">3 tuần</option>
        <option value="1m">1 tháng</option><option value="2m">2 tháng</option><option value="3m">3 tháng</option>
        <option value="6m">6 tháng</option><option value="9m">9 tháng</option><option value="12m">12 tháng</option>
      </select></div>
      <div class="field"><label>Ngày bắt đầu bảo hành</label><input id="saleWarrantyStart" type="date"></div>
      <div class="field"><label>Ngày hết hạn</label><input id="saleWarrantyEnd" type="date" readonly></div>
    </div>

    <div id="salePreview" class="spec-display" style="margin-top:12px">
      <h3>💻 Chi tiết laptop bán</h3>
      <div id="saleSpecsPreview">Chọn laptop để xem thông số.</div>
    </div>

    <div class="sale-total-box" style="margin-top:12px;padding:14px;border:1px solid #334a6d;border-radius:10px;display:flex;justify-content:flex-end;gap:20px;align-items:center">
      <span style="font-size:18px">TỔNG THANH TOÁN:</span><strong id="saleTotalPreview" style="font-size:24px;color:#ffc107">0 đ</strong>
    </div>
    <div class="actions"><button class="btn green" id="saveSale">💾 LƯU ĐƠN BÁN & IN PHIẾU</button></div>
  </div>

  <div class="panel"><h3>📋 Lịch sử bán laptop</h3>
    <div class="tablewrap"><table class="table"><thead><tr>
      <th>Thời gian</th><th>Khách hàng</th><th>Laptop</th><th>SL</th><th>Giá bán</th><th>Tổng</th><th>Bảo hành</th><th>In</th>
    </tr></thead><tbody>${rows||'<tr><td colspan="8" class="empty">Chưa có đơn bán laptop</td></tr>'}</tbody></table></div>
  </div>`;

  function updateSaleWarranty(){
    const st=$("#saleWarrantyStart")?.value||"",du=$("#saleWarranty")?.value||"0";
    if($("#saleWarrantyEnd"))$("#saleWarrantyEnd").value=warrantyEndDate(st,du);
  }
  function updateSalePreview(){
    const item=db.laptops.find(x=>x.id==$("#saleItem")?.value);
    if(!item)return;
    const key="LAPTOP|"+String(item.brand||"").trim()+"|"+String(item.model||"").trim();
    const specs=(db.modelSpecs&&db.modelSpecs[key])||item.specs||"Chưa có thông số model.";
    $("#saleSpecsPreview").innerHTML=
      `<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:12px"><img src="${getLaptopDisplayImage(item)||''}" onerror="this.style.display='none'" style="width:180px;height:120px;object-fit:contain;border-radius:10px;background:#08111f;border:1px solid #29476a"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:1">
        <div><b>Hãng:</b> ${escapeHtml(item.brand||"")}</div>
        <div><b>Model:</b> ${escapeHtml(item.model||"")}</div>
        <div><b>Số lượng còn:</b> ${item.qty||0}</div>
      </div></div>
      <div class="box" style="margin-top:10px"><b>📋 Thông số:</b><br>${escapeHtml(specs)}</div>`;
  }
  function updateSaleTotal(){
    const q=Math.max(0,num("saleQty")),p=num("salePrice");
    if($("#saleTotalPreview"))$("#saleTotalPreview").textContent=money(q*p);
  }

  $("#saleItem")?.addEventListener("change",updateSalePreview);
  $("#saleQty")?.addEventListener("input",updateSaleTotal);
  $("#salePrice")?.addEventListener("input",()=>{
    const el=$("#salePrice"),raw=(el.value||"").replace(/\D/g,"");
    el.value=raw?new Intl.NumberFormat("vi-VN").format(Number(raw)):"";
    updateSaleTotal();
  });
  $("#saleWarranty")?.addEventListener("change",updateSaleWarranty);
  $("#saleWarrantyStart")?.addEventListener("change",updateSaleWarranty);
  $("#saleWarrantyStart").value=new Date().toISOString().slice(0,10);
  updateSaleWarranty(); updateSalePreview(); updateSaleTotal();
  $("#saveSale").onclick=saveSale;
}

async function saveSale(){
  const selectedId=String($("#saleItem")?.value??"").trim();
  const item=db.laptops.find(x=>String(x.id)===selectedId);
  const q=Math.floor(Number($("#saleQty")?.value||0));
  const p=parseMoneyValue($("#salePrice")?.value||0);
  const customer=$("#customer")?.value.trim()||"Khách lẻ";
  if(!item)return alert("Chưa chọn laptop cần bán.");
  if(!Number.isFinite(q)||q<1||q>Number(item.qty||0))return alert("Số lượng bán không hợp lệ hoặc vượt quá tồn kho.");
  if(!Number.isFinite(p)||p<=0)return alert("Vui lòng nhập giá bán hợp lệ.");

  const key="LAPTOP|"+String(item.brand||"").trim()+"|"+String(item.model||"").trim();
  const specs=(db.modelSpecs&&db.modelSpecs[key])||item.specs||"Chưa có thông số model.";
  const warranty=$("#saleWarranty")?.value||"0";
  const warrantyStart=$("#saleWarrantyStart")?.value||"";
  const warrantyEnd=$("#saleWarrantyEnd")?.value||warrantyEndDate(warrantyStart,warranty);

  // Mở cửa sổ in NGAY trong thao tác click để trình duyệt không chặn popup sau await/save.
  const printWin=null;
  item.qty-=q;
  const total=q*p;
  const sale={
    id:Date.now(),time:new Date().toLocaleString("vi-VN"),
    name:(item.brand||"")+" "+(item.model||""),brand:item.brand||"",model:item.model||"",
    qty:q,price:p,total,customer,phone:$("#phone")?.value.trim()||"",
    specs,note:$("#saleNote")?.value.trim()||"",
    sourceLaptopId:item.id,image:getLaptopDisplayImage(item)||"",sourceLaptop:{id:item.id,brand:item.brand||"",model:item.model||"",cost:Number(item.cost||0),price:Number(item.price||0),repair:Number(item.repair||0),qty:0,specs:item.specs||specs,note:item.note||""},
    warranty,warrantyStart,warrantyEnd
  };
  db.sales.push(sale);
  save(); /* Đồng bộ server chạy nền; UI cập nhật ngay. */
  salesPage();
  // Không dùng alert(): alert chặn browser repaint nên lịch sử nhìn như chưa cập nhật.
  requestAnimationFrame(()=>showFastToast("Đã lưu đơn bán — lịch sử đã cập nhật ngay."));
  setTimeout(()=>printSale(sale.id, printWin),180);
}

window.printSale=function(id,targetWin=null){
  const x=db.sales.find(a=>a.id==id); if(!x)return;
  const specs=x.specs||"Chưa có thông số model.";
  const warranty=(x.warrantyStart&&x.warranty)
    ? warrantyText(x.warrantyStart,x.warranty,x.warrantyEnd)
    : (x.warrantyLabel||"Không bảo hành");
  const total=Number(x.total||((x.qty||1)*(x.price||0)));
  const img=x.image||((x.sourceLaptop&&getLaptopDisplayImage(x.sourceLaptop))||"");

  const html=`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Bill bán laptop</title>
  <style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#111;background:#fff;margin:0;padding:24px}
  .receipt{max-width:850px;margin:auto}.head{text-align:center;border-bottom:2px solid #111;padding-bottom:12px}
  h1{font-size:25px;margin:4px 0}.sub{font-size:13px}.info{display:grid;grid-template-columns:1fr 1fr;gap:7px 24px;margin:18px 0}
  .box{border:1px solid #777;padding:10px;margin-top:12px}.box h3{margin:0 0 8px}
  table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #555;padding:8px;font-size:13px}
  th{background:#eee}.r{text-align:right}.product{display:flex;gap:16px;align-items:center}
  .product img{width:170px;height:120px;object-fit:contain;border:1px solid #aaa;border-radius:8px}
  .total{text-align:right;font-size:21px;font-weight:bold;margin-top:14px}.note{min-height:50px}
  .sign{display:grid;grid-template-columns:1fr 1fr;text-align:center;margin-top:50px}.muted{color:#555;font-size:12px}
  .no-print{text-align:center;margin-top:25px}@media print{body{padding:8px}.no-print{display:none!important}}
  </style></head><body><div class="receipt">
  <div class="head"><h1>PHIẾU BÁN LAPTOP</h1><div class="sub">LAPTOP VE CHAI .COM</div></div>
  <div class="info"><div><b>Khách hàng:</b> ${escapeHtml(x.customer||"Khách lẻ")}</div>
    <div><b>SĐT:</b> ${escapeHtml(x.phone||"")}</div><div><b>Ngày bán:</b> ${escapeHtml(x.time||"")}</div>
    <div><b>Mã phiếu:</b> ${escapeHtml(String(x.id||""))}</div></div>
  <div class="box"><h3>💻 Thông tin laptop</h3>
    <div class="product">${img?`<img src="${img}" onerror="this.style.display='none'">`:''}
      <div><b>Hãng:</b> ${escapeHtml(x.brand||"")}<br><b>Model:</b> ${escapeHtml(x.model||x.name||"")}<br><b>Số lượng:</b> ${Number(x.qty||1)}</div>
    </div>
    <table><thead><tr><th>#</th><th>Hãng</th><th>Model</th><th>SL</th><th>Đơn giá bán</th><th>Thành tiền</th></tr></thead>
      <tbody><tr><td>1</td><td>${escapeHtml(x.brand||"")}</td><td>${escapeHtml(x.model||x.name||"")}</td>
      <td class="r">${x.qty||1}</td><td class="r">${money(x.price||0)}</td><td class="r">${money(total)}</td></tr></tbody></table>
  </div>
  <div class="box"><h3>📋 Thông số máy</h3><div>${escapeHtml(specs).replace(/\n/g,"<br>")}</div></div>
  <div class="box note"><b>📝 Ghi chú / phụ kiện / thỏa thuận:</b><br>${escapeHtml(x.note||"").replace(/\n/g,"<br>")||"Không có"}</div>
  <div class="box"><b>🛡️ Bảo hành:</b> ${escapeHtml(warranty)}</div>
  <div class="total">TỔNG THANH TOÁN: ${money(total)}</div>
  <div class="sign"><div><b>KHÁCH HÀNG</b><br><br><br><span class="muted">(Ký và ghi rõ họ tên)</span></div>
    <div><b>NHÂN VIÊN</b><br><br><br><span class="muted">(Ký và ghi rõ họ tên)</span></div></div>
  <div class="no-print"><button onclick="window.print()">🖨️ IN PHIẾU</button></div>
  </div></body></html>`;
  openPrintWindow(html,targetWin);
};


function openPrintWindow(html, targetWin=null){
  // V4.82: In bill NGAY TRÊN TRANG HIỆN TẠI.
  // Không dùng popup / about:blank / iframe ẩn vì Cốc Cốc có thể mở cửa sổ trắng.
  // Bill được render trước, sau đó gọi print() trên chính cửa sổ hiện tại.
  try{
    const oldLayer=document.getElementById("__lv_print_layer");
    if(oldLayer) oldLayer.remove();
    const oldStyle=document.getElementById("__lv_print_style");
    if(oldStyle) oldStyle.remove();

    const parser=new DOMParser();
    const parsed=parser.parseFromString(String(html||""),"text/html");
    const layer=document.createElement("div");
    layer.id="__lv_print_layer";
    layer.innerHTML=parsed.body ? parsed.body.innerHTML : String(html||"");

    const style=document.createElement("style");
    style.id="__lv_print_style";
    const sourceStyles=[...parsed.querySelectorAll("style")].map(s=>s.textContent||"").join("\n");
    style.textContent=`
      #__lv_print_layer{
        position:fixed;inset:0;z-index:2147483647;
        overflow:auto;background:#fff;color:#111;
        padding:20px;
      }
      #__lv_print_layer .receipt{margin:0 auto;max-width:850px}
      #__lv_print_layer .no-print{display:block}
      #__lv_print_layer img{max-width:100%}
      #__lv_print_layer button{cursor:pointer}
      @media print{
        body > *:not(#__lv_print_layer){display:none!important}
        #__lv_print_layer{
          position:static!important;display:block!important;
          width:auto!important;height:auto!important;
          min-height:0!important;overflow:visible!important;
          padding:8px!important;margin:0!important;
          background:#fff!important;color:#111!important;
        }
        #__lv_print_layer .no-print{display:none!important}
      }
      ${sourceStyles}
    `;
    document.head.appendChild(style);
    document.body.appendChild(layer);

    // Đã render bill thì cho trình duyệt paint trước khi mở hộp thoại in.
    const doPrint=()=>{
      try{
        window.focus();
        window.print();
      }catch(e){
        console.warn("Print failed",e);
      }
    };

    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        setTimeout(doPrint,120);
      });
    });

    // Sau khi đóng hộp thoại in, trả giao diện về trạng thái bình thường.
    const cleanup=()=>{
      setTimeout(()=>{
        try{document.getElementById("__lv_print_layer")?.remove();}catch(e){}
        try{document.getElementById("__lv_print_style")?.remove();}catch(e){}
        window.removeEventListener("afterprint",cleanup);
      },100);
    };
    window.addEventListener("afterprint",cleanup,{once:true});

    return window;
  }catch(e){
    console.error("openPrintWindow:",e);
    alert("Không thể tạo phiếu in. Hãy thử lại.");
    return null;
  }
}

function partSalesPage(){
  const available=db.parts.filter(x=>Number(x.qty)>0);
  const opts=available.map(x=>`<option value="${x.id}">${escapeHtml(x.type||"Linh kiện")} — ${escapeHtml(x.brand||"")} ${escapeHtml(x.model||"")} — còn ${x.qty}</option>`).join("");
  const rows=db.partSales.slice().reverse().slice(0,30).map(x=>{
    const items=Array.isArray(x.items)?x.items:[];
    const detail=items.length?items.map(i=>`${escapeHtml(i.name||"")} × ${i.qty||1} = ${money(i.total||0)}`).join("<br>"):escapeHtml(x.name||"");
    const qty=items.length?items.reduce((t,i)=>t+Number(i.qty||0),0):Number(x.qty||1);
    return `<tr><td>${escapeHtml(x.time||"")}</td><td>${escapeHtml(x.customer||"")}<br><small>${escapeHtml(x.phone||"")}</small></td><td>${detail}</td><td>${qty}</td><td><strong>${money(x.total||0)}</strong></td><td>${escapeHtml(x.warrantyStart&&x.warranty ? warrantyText(x.warrantyStart,x.warranty,x.warrantyEnd) : (x.warrantyLabel||""))}</td><td><button class="btn blue" onclick="printPartSale(${x.id})">🖨️ IN PHIẾU</button></td></tr>`;
  }).join("");
  const today=new Date().toISOString().slice(0,10);
  $("#content").innerHTML=`<div class="panel">
    <h3>🔩 Bán linh kiện — TẠO ĐƠN NHIỀU MÓN</h3>
    <div class="formgrid">
      <div class="field full"><label>Chọn linh kiện *</label><select id="partSaleItem"><option value="">-- Chọn linh kiện --</option>${opts}</select></div>
      <div class="field"><label>Số lượng *</label><input id="partSaleQty" type="number" min="1" value="1"></div>
      <div class="field"><label>Giá bán / cái *</label><input id="partSalePrice" type="text" inputmode="numeric" autocomplete="off" placeholder="250.000"></div>
      <div class="field full"><button class="btn blue" id="addPartToCart" type="button">➕ THÊM VÀO ĐƠN</button></div>
      <div class="field"><label>Tên khách hàng *</label><input id="partSaleCustomer" placeholder="Nguyễn Văn A"></div><div class="field"><label>Số điện thoại</label><input id="partSalePhone" placeholder="09..."></div>
      <div class="field full"><label>📝 Chi tiết / phụ kiện / ghi chú chung cho đơn</label><textarea id="partSaleNote" placeholder="VD: Lắp RAM cho Dell Inspiron 15; kèm ốc; vệ sinh máy..."></textarea></div>
      <div class="field"><label>🛡️ Bảo hành</label><select id="partSaleWarranty"><option value="0">Không bảo hành</option><option value="1w">1 tuần</option><option value="2w">2 tuần</option><option value="3w">3 tuần</option><option value="1m">1 tháng</option><option value="2m">2 tháng</option><option value="3m">3 tháng</option><option value="6m">6 tháng</option><option value="9m">9 tháng</option><option value="12m">12 tháng</option></select></div>
      <div class="field"><label>Ngày bắt đầu bảo hành</label><input id="partSaleWarrantyStart" type="date" value="${today}"></div><div class="field"><label>Ngày hết hạn</label><input id="partSaleWarrantyEnd" type="date" readonly></div>
    </div>
    <div class="box" style="margin-top:14px"><h3>🛒 Các món trong đơn hàng</h3><div class="tablewrap"><table class="table"><thead><tr><th>#</th><th>Loại</th><th>Hãng / Model</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th><th>Xóa</th></tr></thead><tbody id="partCartRows"><tr><td colspan="8" class="empty">Chưa có linh kiện trong đơn.</td></tr></tbody></table></div></div>
    <div id="partSalePreview" class="spec-display" style="margin-top:12px"><h3>🔩 Thông tin món đang chọn</h3><div id="partSpecsPreview">Chọn linh kiện để xem thông tin.</div></div>
    <div style="margin-top:12px;padding:14px;border:1px solid #334a6d;border-radius:10px;display:flex;justify-content:flex-end;gap:20px;align-items:center"><span style="font-size:18px">TỔNG ĐƠN HÀNG:</span><strong id="partSaleTotalPreview" style="font-size:24px;color:#ffc107">0 đ</strong></div>
    <div class="actions"><button class="btn green" id="savePartSale">💾 LƯU ĐƠN BÁN & IN PHIẾU</button></div>
  </div>
  <div class="panel"><h3>📋 Lịch sử bán linh kiện</h3><div class="tablewrap"><table class="table"><thead><tr><th>Thời gian</th><th>Khách hàng</th><th>Chi tiết đơn</th><th>Tổng SL</th><th>Tổng tiền</th><th>Bảo hành</th><th>In</th></tr></thead><tbody>${rows||'<tr><td colspan="8" class="empty">Chưa có đơn bán linh kiện</td></tr>'}</tbody></table></div></div>`;
  let cart=[];
  const selected=()=>db.parts.find(x=>x.id==$("#partSaleItem")?.value);
  function updateWarranty(){const st=$("#partSaleWarrantyStart")?.value||"",du=$("#partSaleWarranty")?.value||"0";if($("#partSaleWarrantyEnd"))$("#partSaleWarrantyEnd").value=warrantyEndDate(st,du);}
  function updatePreview(){const item=selected();if(!item){$("#partSpecsPreview").textContent="Chọn linh kiện để xem thông tin.";return;}$("#partSpecsPreview").innerHTML=`<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:12px"><img src="${getPartDisplayImage(item)||''}" onerror="this.style.display='none'" style="width:180px;height:120px;object-fit:contain;border-radius:10px;background:#08111f;border:1px solid #29476a"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:1"><div><b>Loại:</b> ${escapeHtml(item.type||"")}</div><div><b>Hãng:</b> ${escapeHtml(item.brand||"")}</div><div><b>Model:</b> ${escapeHtml(item.model||"")}</div><div><b>Số lượng còn:</b> ${item.qty||0}</div><div><b>Ghi chú:</b> ${escapeHtml(item.note||"")}</div></div>`;}
  function updateCart(){const body=$("#partCartRows");if(!body)return;if(!cart.length)body.innerHTML='<tr><td colspan="8" class="empty">Chưa có linh kiện trong đơn.</td></tr>';else body.innerHTML=cart.map((i,idx)=>`<tr><td>${idx+1}</td><td>${escapeHtml(i.type||"")}</td><td>${escapeHtml([i.brand,i.model].filter(Boolean).join(" — "))}</td><td>${i.qty}</td><td>${money(i.price)}</td><td><strong>${money(i.total)}</strong></td><td><button class="btn red" type="button" onclick="removePartCartItem(${idx})">🗑️</button></td></tr>`).join("");const total=cart.reduce((t,i)=>t+i.total,0);$("#partSaleTotalPreview").textContent=money(total);}
  window.removePartCartItem=function(idx){cart.splice(idx,1);updateCart();};
  $("#partSaleItem")?.addEventListener("change",updatePreview);
  $("#partSalePrice")?.addEventListener("input",()=>{const el=$("#partSalePrice"),raw=(el.value||"").replace(/\D/g,"");el.value=raw?new Intl.NumberFormat("vi-VN").format(Number(raw)):"";});
  $("#partSaleWarranty")?.addEventListener("change",updateWarranty);$("#partSaleWarrantyStart")?.addEventListener("change",updateWarranty);
  $("#addPartToCart").onclick=()=>{const item=selected(),q=parseInt($("#partSaleQty")?.value||0,10),price=parseMoneyValue($("#partSalePrice")?.value||0);if(!item||q<1||q>Number(item.qty)||price<=0)return alert("Vui lòng chọn linh kiện, số lượng và giá bán hợp lệ.");const existing=cart.find(i=>i.id==item.id&&Number(i.price)===price);if(existing){if(existing.qty+q>Number(item.qty))return alert("Số lượng vượt quá tồn kho.");existing.qty+=q;existing.total=existing.qty*existing.price;}else cart.push({id:item.id,type:item.type||"",brand:item.brand||"",model:item.model||"",name:[item.type,item.brand,item.model].filter(Boolean).join(" — "),qty:q,price,total:q*price,sourcePartId:item.id,image:getPartDisplayImage(item)||"",sourcePart:{id:item.id,type:item.type||"",brand:item.brand||"",model:item.model||"",price:Number(item.price||0),note:item.note||""}});updateCart();$("#partSaleQty").value=1;};
  $("#savePartSale").onclick=async()=>{
    // Cho phép bấm LƯU & IN ngay sau khi chọn linh kiện mà không bắt buộc phải bấm THÊM VÀO ĐƠN.
    if(!cart.length){
      const item=selected();
      const q=parseInt($("#partSaleQty")?.value||0,10);
      const price=parseMoneyValue($("#partSalePrice")?.value||0);
      if(!item||q<1||q>Number(item.qty||0)||!Number.isFinite(price)||price<=0)
        return alert("Vui lòng chọn linh kiện, số lượng và giá bán hợp lệ.");
      cart.push({id:item.id,type:item.type||"",brand:item.brand||"",model:item.model||"",name:[item.type,item.brand,item.model].filter(Boolean).join(" — "),qty:q,price,total:q*price,sourcePartId:item.id,image:getPartDisplayImage(item)||"",sourcePart:{id:item.id,type:item.type||"",brand:item.brand||"",model:item.model||"",price:Number(item.price||0),note:item.note||""}});
    }
    const printWin=null;
    const customer=$("#partSaleCustomer")?.value.trim()||"Khách lẻ";for(const i of cart){const live=db.parts.find(x=>String(x.id)===String(i.id));if(!live)return alert(`Không tìm thấy linh kiện: ${i.name}`);if(Number(i.qty)>Number(live.qty||0))return alert(`Không đủ tồn kho: ${i.name}`);}const total=cart.reduce((t,i)=>t+Number(i.total||0),0),qTotal=cart.reduce((t,i)=>t+Number(i.qty||0),0),warranty=$("#partSaleWarranty")?.value||"0",warrantyStart=$("#partSaleWarrantyStart")?.value||"",warrantyEnd=$("#partSaleWarrantyEnd")?.value||warrantyEndDate(warrantyStart,warranty);for(const i of cart){const live=db.parts.find(x=>String(x.id)===String(i.id));live.qty=Math.max(0,Number(live.qty)-Number(i.qty));}const sale={id:Date.now(),time:new Date().toLocaleString("vi-VN"),name:cart.length===1?cart[0].name:`${cart.length} món linh kiện`,items:cart.map(i=>({...i})),qty:qTotal,price:0,total,customer,phone:$("#partSalePhone")?.value.trim()||"",note:$("#partSaleNote")?.value.trim()||"",warranty,warrantyStart,warrantyEnd,partInfo:cart.map(i=>`${i.name} × ${i.qty} = ${money(i.total)}`).join(" | ")};db.partSales.push(sale);save();partSalesPage();
    requestAnimationFrame(()=>showFastToast(`Đã lưu đơn ${cart.length} món — lịch sử đã cập nhật ngay.`));
    setTimeout(()=>printPartSale(sale.id, printWin),180);};
  updateWarranty();updatePreview();updateCart();
}

window.printPartSale=function(id,targetWin=null){
  const x=db.partSales.find(a=>a.id==id);if(!x)return;
  const warranty=(x.warrantyStart&&x.warranty)
    ? warrantyText(x.warrantyStart,x.warranty,x.warrantyEnd)
    : (x.warrantyLabel||"Không bảo hành");
  const items=Array.isArray(x.items)&&x.items.length
    ? x.items
    : [{type:x.type||"",brand:x.brand||"",model:x.model||"",qty:x.qty||1,price:x.price||0,total:Number(x.total||0)}];
  const total=Number(x.total||items.reduce((t,i)=>t+Number(i.total||((i.qty||1)*(i.price||0))),0));

  const html=`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Bill bán linh kiện</title>
  <style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#111;background:#fff;margin:0;padding:24px}
  .receipt{max-width:850px;margin:auto}.head{text-align:center;border-bottom:2px solid #111;padding-bottom:12px}
  h1{font-size:25px;margin:4px 0}.sub{font-size:13px}.info{display:grid;grid-template-columns:1fr 1fr;gap:7px 24px;margin:18px 0}
  .box{border:1px solid #777;padding:10px;margin-top:12px}.box h3{margin:0 0 8px}
  table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #555;padding:8px;font-size:13px}
  th{background:#eee}.r{text-align:right}.total{text-align:right;font-size:21px;font-weight:bold;margin-top:14px}
  .note{min-height:50px}.sign{display:grid;grid-template-columns:1fr 1fr;text-align:center;margin-top:50px}
  .muted{color:#555;font-size:12px}.no-print{text-align:center;margin-top:25px}
  @media print{body{padding:8px}.no-print{display:none!important}}
  </style></head><body><div class="receipt">
  <div class="head"><h1>PHIẾU BÁN LINH KIỆN</h1><div class="sub">LAPTOP VE CHAI .COM</div></div>
  <div class="info"><div><b>Khách hàng:</b> ${escapeHtml(x.customer||"Khách lẻ")}</div>
    <div><b>SĐT:</b> ${escapeHtml(x.phone||"")}</div><div><b>Ngày bán:</b> ${escapeHtml(x.time||"")}</div>
    <div><b>Mã phiếu:</b> ${escapeHtml(String(x.id||""))}</div></div>
  <div class="box"><h3>🔩 Chi tiết linh kiện</h3>
    <table><thead><tr><th>#</th><th>Loại</th><th>Hãng</th><th>Model</th><th>SL</th><th>Đơn giá bán</th><th>Thành tiền</th></tr></thead>
    <tbody>${items.map((i,n)=>`<tr><td>${n+1}</td><td>${escapeHtml(i.type||"")}</td><td>${escapeHtml(i.brand||"")}</td>
      <td>${escapeHtml(i.model||"")}</td><td class="r">${i.qty||1}</td><td class="r">${money(i.price||0)}</td>
      <td class="r">${money(i.total||0)}</td></tr>`).join("")}</tbody></table>
  </div>
  <div class="box"><h3>📝 Ghi chú / phụ kiện / thỏa thuận</h3><div>${escapeHtml(x.note||"").replace(/\n/g,"<br>")||"Không có"}</div></div>
  <div class="box"><b>🛡️ Bảo hành:</b> ${escapeHtml(warranty)}</div>
  <div class="total">TỔNG THANH TOÁN: ${money(total)}</div>
  <div class="sign"><div><b>KHÁCH HÀNG</b><br><br><br><span class="muted">(Ký và ghi rõ họ tên)</span></div>
    <div><b>NHÂN VIÊN</b><br><br><br><span class="muted">(Ký và ghi rõ họ tên)</span></div></div>
  <div class="no-print"><button onclick="window.print()">🖨️ IN PHIẾU</button></div>
  </div></body></html>`;
  openPrintWindow(html,targetWin);
};

function repairsPage(){
  const rows=db.repairs.slice().reverse().map(x=>{
    const items=Array.isArray(x.items)?x.items:[];
    const detail=items.length
      ? items.map(i=>`${escapeHtml(i.name||"")} × ${i.qty||1} = ${money(i.total||0)}`).join("<br>")
      : escapeHtml(x.description||"");
    return `<tr>
      <td>${escapeHtml(x.time)}</td>
      <td>${escapeHtml(x.customer||"")}<br><small>${escapeHtml(x.phone||"")}</small></td>
      <td>${escapeHtml(x.device||"")}</td>
      <td>${detail}</td>
      <td><strong>${money(x.cost)}</strong></td>
      <td>${escapeHtml(warrantyText(x.warrantyStart||"",x.warranty||"0",x.warrantyEnd||""))}</td>
      <td>${escapeHtml(x.status||"Đang sửa")}</td>
      <td><button class="btn blue" onclick="printRepair(${x.id})">🖨️ IN PHIẾU</button></td>
    </tr>`;
  }).join("");

  $("#content").innerHTML=`<div class="panel">
    <h3>🛠️ Tiếp nhận sửa chữa</h3>
    <div class="formgrid">
      <div class="field"><label>Tên khách hàng *</label><input id="repairCustomer" placeholder="Nguyễn Văn A"></div>
      <div class="field"><label>Số điện thoại</label><input id="repairPhone" placeholder="09..."></div>
      <div class="field"><label>Thiết bị / Model *</label><input id="repairDevice" placeholder="Dell Inspiron 15"></div>
      <div class="field"><label>Trạng thái</label><select id="repairStatus"><option>Tiếp nhận</option><option>Đang kiểm tra</option><option>Đang sửa</option><option>Đã sửa xong</option><option>Đã trả máy</option></select></div>

      <div class="field full">
        <label>🔧 CHI TIẾT SỬA CHỮA / THAY THẾ</label>
        <div style="font-size:12px;color:#9fb2cf;margin:4px 0 10px">
          Ghi rõ từng món sửa/thay, số lượng và giá tiền. Tổng tiền sẽ tự cộng để in cho khách.
        </div>
        <div id="repairItems">
          <div class="repair-item-row" style="display:grid;grid-template-columns:150px 1fr 70px 150px 150px 45px;gap:8px;margin-bottom:8px;align-items:center">
            <select class="repair-item-type"><option>Sửa chữa</option><option>Thay linh kiện</option><option>Tiền công</option><option>Vệ sinh</option><option>Khác</option></select>
            <input class="repair-item-name" placeholder="VD: Thay bàn phím Dell">
            <input class="repair-item-qty" type="number" min="1" value="1">
            <input class="repair-item-price" type="text" inputmode="numeric" placeholder="Đơn giá">
            <input class="repair-item-total" type="text" readonly placeholder="Thành tiền">
            <button type="button" class="btn red repair-remove-item" title="Xóa dòng">✕</button>
          </div>
        </div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap">
          <button type="button" class="btn blue" id="addRepairItem">➕ THÊM HẠNG MỤC</button>
          <strong id="repairItemsTotal" style="color:#ffc107;font-size:18px">TỔNG SỬA CHỮA: 0 đ</strong>
        </div>
      </div>

      <div class="field full"><label>Mô tả / tình trạng máy</label><textarea id="repairDescription" placeholder="VD: Máy không lên nguồn, bàn phím liệt 5 phím, cổng USB chập chờn..."></textarea></div>
      <div class="field"><label>Ghi chú cho khách</label><input id="repairNote" placeholder="Linh kiện đã thay, tình trạng máy, lưu ý..."></div>
      <div class="field"><label>🛡️ Bảo hành</label><select id="serviceWarranty">
        <option value="0">Không bảo hành</option><option value="1w">1 tuần</option><option value="2w">2 tuần</option><option value="3w">3 tuần</option>
        <option value="1m">1 tháng</option><option value="2m">2 tháng</option><option value="3m">3 tháng</option><option value="6m">6 tháng</option><option value="9m">9 tháng</option><option value="12m">12 tháng</option>
      </select></div>
      <div class="field"><label>Ngày bắt đầu bảo hành</label><input id="serviceWarrantyStart" type="date"></div>
      <div class="field"><label>Ngày hết hạn</label><input id="serviceWarrantyEnd" type="date" readonly></div>
    </div>
    <div class="actions">
      <button class="btn green" id="saveRepair">💾 LƯU PHIẾU SỬA CHỮA</button>
    </div>
  </div>

  <div class="panel"><h3>📋 Danh sách sửa chữa</h3>
    <div class="tablewrap"><table class="table"><thead><tr>
      <th>Thời gian</th><th>Khách hàng</th><th>Thiết bị</th><th>Chi tiết sửa / thay</th><th>Tổng tiền</th><th>Bảo hành</th><th>Trạng thái</th><th>In</th>
    </tr></thead><tbody>${rows||'<tr><td colspan="8" class="empty">Chưa có phiếu sửa chữa</td></tr>'}</tbody></table></div>
  </div>`;

  const setMoneyInput=(el)=>{
    if(!el)return;
    el.addEventListener("input",()=>{
      const raw=(el.value||"").replace(/\D/g,"");
      el.value=raw?new Intl.NumberFormat("vi-VN").format(Number(raw)):"";
      updateRepairItemsTotal();
    });
  };
  function updateRow(row){
    const qty=Math.max(1,Number(row.querySelector(".repair-item-qty")?.value||1));
    const price=parseMoneyValue(row.querySelector(".repair-item-price")?.value||0);
    const total=qty*price;
    const out=row.querySelector(".repair-item-total");
    if(out)out.value=money(total);
    return total;
  }
  function updateRepairItemsTotal(){
    let total=0;
    document.querySelectorAll(".repair-item-row").forEach(row=>{total+=updateRow(row);});
    const el=$("#repairItemsTotal"); if(el)el.textContent="TỔNG SỬA CHỮA: "+money(total);
    return total;
  }
  function bindRepairRow(row){
    setMoneyInput(row.querySelector(".repair-item-price"));
    row.querySelector(".repair-item-qty")?.addEventListener("input",updateRepairItemsTotal);
    row.querySelector(".repair-item-name")?.addEventListener("input",updateRepairItemsTotal);
    row.querySelector(".repair-remove-item")?.addEventListener("click",()=>{
      const all=document.querySelectorAll(".repair-item-row");
      if(all.length>1)row.remove(); else {
        row.querySelector(".repair-item-name").value="";
        row.querySelector(".repair-item-price").value="";
        row.querySelector(".repair-item-qty").value=1;
      }
      updateRepairItemsTotal();
    });
  }
  document.querySelectorAll(".repair-item-row").forEach(bindRepairRow);
  $("#addRepairItem")?.addEventListener("click",()=>{
    const wrap=$("#repairItems");
    const row=document.createElement("div");
    row.className="repair-item-row";
    row.style.cssText="display:grid;grid-template-columns:150px 1fr 70px 150px 150px 45px;gap:8px;margin-bottom:8px;align-items:center";
    row.innerHTML=`<select class="repair-item-type"><option>Sửa chữa</option><option>Thay linh kiện</option><option>Tiền công</option><option>Vệ sinh</option><option>Khác</option></select>
      <input class="repair-item-name" placeholder="VD: Thay SSD 256GB">
      <input class="repair-item-qty" type="number" min="1" value="1">
      <input class="repair-item-price" type="text" inputmode="numeric" placeholder="Đơn giá">
      <input class="repair-item-total" type="text" readonly placeholder="Thành tiền">
      <button type="button" class="btn red repair-remove-item">✕</button>`;
    wrap.appendChild(row); bindRepairRow(row);
  });

  $("#saveRepair").onclick=saveRepair;
  if($("#serviceWarrantyStart"))$("#serviceWarrantyStart").value=new Date().toISOString().slice(0,10);
  function updateServiceWarranty(){
    const st=$("#serviceWarrantyStart")?.value||"",du=$("#serviceWarranty")?.value||"0";
    if($("#serviceWarrantyEnd"))$("#serviceWarrantyEnd").value=warrantyEndDate(st,du);
  }
  $("#serviceWarranty")?.addEventListener("change",updateServiceWarranty);
  $("#serviceWarrantyStart")?.addEventListener("change",updateServiceWarranty);
  updateServiceWarranty(); updateRepairItemsTotal();
}

async function saveRepair(){
  const customer=$("#repairCustomer").value.trim(),device=$("#repairDevice").value.trim();
  if(!customer||!device)return alert("Vui lòng nhập tên khách hàng và thiết bị/model.");

  const items=[...document.querySelectorAll(".repair-item-row")].map(row=>{
    const qty=Math.max(1,Number(row.querySelector(".repair-item-qty")?.value||1));
    const unitPrice=parseMoneyValue(row.querySelector(".repair-item-price")?.value||0);
    const name=row.querySelector(".repair-item-name")?.value.trim()||"";
    const type=row.querySelector(".repair-item-type")?.value||"Sửa chữa";
    return {type,name,qty,unitPrice,total:qty*unitPrice};
  }).filter(i=>i.name||i.unitPrice>0);

  const cost=items.reduce((sum,i)=>sum+i.total,0);
  if(!items.length && !confirm("Bạn chưa nhập hạng mục sửa chữa/thay thế. Vẫn lưu phiếu với tổng tiền 0 đ?"))return;

  db.repairs.push({
    id:Date.now(),time:new Date().toLocaleString("vi-VN"),
    customer,phone:$("#repairPhone").value.trim(),device,
    description:$("#repairDescription").value.trim(),items,cost,
    status:$("#repairStatus").value,note:$("#repairNote").value.trim(),
    warranty:$("#serviceWarranty")?.value||"0",
    warrantyStart:$("#serviceWarrantyStart")?.value||"",
    warrantyEnd:$("#serviceWarrantyEnd")?.value||warrantyEndDate($("#serviceWarrantyStart")?.value||"",$("#serviceWarranty")?.value||"0")
  });
  const savedId=db.repairs[db.repairs.length-1].id;
  save();
  repairsPage();
  requestAnimationFrame(()=>showFastToast("Đã lưu phiếu sửa chữa — lịch sử đã cập nhật ngay."));
  setTimeout(()=>printRepair(savedId),180);
}

window.printRepair=function(id){
  const x=db.repairs.find(a=>a.id==id); if(!x)return;
  const items=Array.isArray(x.items)?x.items:[];
  const itemRows=items.map((i,n)=>`<tr><td>${n+1}</td><td>${escapeHtml(i.type||"")}</td><td>${escapeHtml(i.name||"")}</td><td class="r">${i.qty||1}</td><td class="r">${money(i.unitPrice||0)}</td><td class="r">${money(i.total||0)}</td></tr>`).join("");
  const html=`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Phiếu sửa chữa</title>
  <style>
  *{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#111;background:#fff;margin:0;padding:24px}
  .receipt{max-width:850px;margin:auto}.head{text-align:center;border-bottom:2px solid #111;padding-bottom:12px}
  h1{font-size:24px;margin:4px 0}.sub{font-size:13px}.info{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin:18px 0}
  table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #555;padding:7px;font-size:13px}th{background:#eee}.r{text-align:right}
  .total{text-align:right;font-size:18px;font-weight:bold;margin-top:14px}.box{border:1px solid #777;padding:10px;margin-top:12px}
  .sign{display:grid;grid-template-columns:1fr 1fr;text-align:center;margin-top:45px}.muted{color:#555;font-size:12px}
  @media print{body{padding:8px}.no-print{display:none!important}}
  </style></head><body><div class="receipt">
  <div class="head"><h1>PHIẾU SỬA CHỮA / NÂNG CẤP</h1><div class="sub">LAPTOP VE CHAI .COM</div></div>
  <div class="info">
    <div><b>Khách hàng:</b> ${escapeHtml(x.customer||"")}</div><div><b>SĐT:</b> ${escapeHtml(x.phone||"")}</div>
    <div><b>Thiết bị:</b> ${escapeHtml(x.device||"")}</div><div><b>Ngày nhận:</b> ${escapeHtml(x.time||"")}</div>
    <div><b>Trạng thái:</b> ${escapeHtml(x.status||"")}</div>
  </div>
  <div class="box"><b>Tình trạng / yêu cầu:</b><br>${escapeHtml(x.description||"").replace(/\n/g,"<br>")||"Không ghi nhận"}</div>
  <table><thead><tr><th>#</th><th>Loại</th><th>Nội dung sửa / linh kiện thay</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead><tbody>
  ${itemRows||'<tr><td colspan="6">Không có hạng mục</td></tr>'}</tbody></table>
  <div class="total">TỔNG THANH TOÁN: ${money(x.cost||0)}</div>
  <div class="box"><b>Ghi chú:</b><br>${escapeHtml(x.note||"").replace(/\n/g,"<br>")||"Không có"}</div>
  <div class="box"><b>Bảo hành:</b> ${escapeHtml(warrantyText(x.warrantyStart||"",x.warranty||"0",x.warrantyEnd||""))}</div>
  <div class="sign"><div><b>KHÁCH HÀNG</b><br><br><br><span class="muted">(Ký và ghi rõ họ tên)</span></div><div><b>NHÂN VIÊN</b><br><br><br><span class="muted">(Ký và ghi rõ họ tên)</span></div></div>
  <div class="no-print" style="text-align:center;margin-top:25px"><button onclick="window.print()">🖨️ IN PHIẾU</button></div>
  </div></body></html>`;
  openPrintWindow(html,null);
};


function viewLiquidationStock(id){const item=(db.liquidationStock||[]).find(a=>a.id==id);if(!item)return;const x=item.record||{};const img=item.sourceType==='laptop'?getLaptopDisplayImage(x):getPartDisplayImage(x);const name=item.sourceType==='laptop'?`${x.brand||''} ${x.model||''}`:`${x.type||'Linh kiện'} — ${x.brand||''} ${x.model||''}`;showStockModal(`<h2>♻️ ${escapeHtml(name)}</h2><div class="detailGrid"><div><img class="detailImage" src="${img||''}" onerror="this.style.display='none'"/><p class="muted">Ảnh thực tế / ảnh model</p></div><div class="detailInfo"><b>Số lượng:</b> ${Number(x.qty||0)}<br><b>Giá:</b> ${money(x.price||x.cost||0)}<br><b>Chuyển sang thanh lý:</b> ${escapeHtml(item.movedAt||'')}<br><b>Nguồn:</b> ${item.sourceType==='laptop'?'Kho laptop':'Kho linh kiện'}</div></div><div class="actions"><button class="btn green" onclick="closeStockModal();returnLiquidationToStock(${item.id})">📦 ĐƯA VỀ KHO</button></div>`)}

function liquidationPage(){
  const items=[...(db.liquidations||[])].slice().reverse();
  const held=db.liquidationStock||[];

  // Chỉ cho chọn những món ĐÃ được chuyển từ Kho sang Thanh lý bằng nút TL.
  const stockOptions=[
    `<option value="">-- Chọn hàng từ Thanh lý --</option>`,
    ...held.map(item=>{
      const x=item.record||{};
      const type=item.sourceType==='laptop'?'laptop':'part';
      const name=type==='laptop'
        ? `${x.brand||''} — ${x.model||''}`
        : `${x.type||'Linh kiện'} — ${x.brand||''} — ${x.model||''}`;
      return `<option value="held:${item.id}">♻️ ${escapeHtml(name)} — còn ${Number(x.qty||0)}</option>`;
    })
  ].join("");

  const rows=items.map(x=>`<tr>
    <td>${escapeHtml(x.time||"")}</td>
    <td>${escapeHtml(x.customer||"")}<br><small>${escapeHtml(x.phone||"")}</small></td>
    <td>${escapeHtml(x.item||"")}</td>
    <td>${Number(x.qty||1)}</td>
    <td>${money(x.price||0)}</td>
    <td><b>${money(x.total||0)}</b></td>
    <td>${escapeHtml(x.note||"")}</td>
    <td><button class="btn blue" onclick="printLiquidation(${x.id})">🖨️ IN</button>
        <button class="btn red" onclick="deleteLiquidation(${x.id})">🗑️ XÓA</button></td>
  </tr>`).join("");

  const heldCards=held.length ? held.map(item=>{
    const x=item.record||{};
    const img=item.sourceType==='laptop'?getLaptopDisplayImage(x):getPartDisplayImage(x);
    const name=item.sourceType==='laptop'
      ? `${x.brand||''} — ${x.model||''}`
      : `${x.type||'Linh kiện'} — ${x.brand||''} — ${x.model||''}`;
    return `<div class="panel" style="margin-top:12px">
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
        <img src="${img||''}" onerror="this.style.display='none'"
          style="width:150px;height:105px;object-fit:contain;border-radius:10px;background:#08111f;border:1px solid #29476a">
        <div style="flex:1;min-width:260px">
          <h3 style="margin:0">${escapeHtml(name)}</h3>
          <p class="muted">${item.sourceType==='laptop'?'💻 Laptop':'🔧 Linh kiện'} • SL: ${Number(x.qty||0)} • Chuyển lúc: ${escapeHtml(item.movedAt||'')}</p>
          <p class="muted">Giá bán thanh lý sẽ nhập ở phiếu bên dưới.</p>
        </div>
        <div class="actions">
          <button class="btn blue" onclick="viewLiquidationStock(${item.id})">👁️ XEM</button>
          <button class="btn green" onclick="returnLiquidationToStock(${item.id})">📦 KHO</button>
          <button class="btn red" onclick="deleteLiquidationStock(${item.id})">🗑️ XÓA</button>
        </div>
      </div>
    </div>`;
  }).join("") : '<div class="empty" style="padding:25px">Chưa có laptop/linh kiện nào trong Thanh lý. Hãy vào Kho và bấm TL.</div>';

  $('#content').innerHTML=`
    <div class="panel">
      <h3>♻️ HÀNG ĐANG Ở THANH LÝ</h3>
      <p class="muted">Chỉ những món đã chuyển từ Kho bằng nút <b>TL</b> mới được bán trong phiếu thanh lý.</p>
      ${heldCards}
    </div>

    <div class="panel"><h3>♻️ BÁN HÀNG THANH LÝ</h3>
      <div class="formgrid">
        <div class="field"><label>Tên khách hàng</label><input id="liqCustomer" placeholder="Nguyễn Văn A"></div>
        <div class="field"><label>Số điện thoại</label><input id="liqPhone" placeholder="09..."></div>
        <div class="field full"><label>Chọn máy / linh kiện thanh lý *</label>
          <select id="liqSource">${stockOptions}</select>
        </div>

        <div class="field full">
          <div id="liqPreview" class="spec-display">
            Chọn một món trong danh sách Thanh lý để xem hình và thông tin.
          </div>
        </div>

        <div class="field"><label>Tên mặt hàng</label><input id="liqItem" placeholder="Tự điền khi chọn hàng"></div>
        <div class="field"><label>Số lượng *</label><input id="liqQty" type="number" min="1" value="1"></div>
        <div class="field"><label>Giá thanh lý / cái *</label><input id="liqPrice" type="text" inputmode="numeric" placeholder="500.000"></div>
        <div class="field"><label>Tình trạng</label><select id="liqCondition">
          <option>Máy lỗi</option><option>Hỏng nặng</option><option>Không còn nhu cầu</option>
          <option>Hàng cũ</option><option>Linh kiện tháo máy</option><option>Khác</option>
        </select></div>
        <div class="field full"><label>Ghi chú</label><textarea id="liqNote" placeholder="Mô tả tình trạng, thỏa thuận với khách..."></textarea></div>
      </div>

      <div class="actions">
        <strong id="liqTotal" style="color:#ffc107;font-size:20px">TỔNG THANH LÝ: 0 đ</strong>
        <button class="btn green" id="saveLiquidation">💾 LƯU PHIẾU & IN BILL</button>
      </div>
    </div>

    <div class="panel"><h3>📋 Lịch sử thanh lý</h3>
      <div class="tablewrap"><table class="table">
        <thead><tr><th>Thời gian</th><th>Khách hàng</th><th>Mặt hàng</th><th>SL</th><th>Giá bán</th><th>Tổng</th><th>Ghi chú</th><th>Thao tác</th></tr></thead>
        <tbody>${rows||'<tr><td colspan="8" class="empty">Chưa có phiếu thanh lý</td></tr>'}</tbody>
      </table></div>
    </div>`;

  const update=()=>{
    const q=Math.max(1,Number($('#liqQty')?.value||1));
    const p=parseMoneyValue($('#liqPrice')?.value||0);
    $('#liqTotal').textContent='TỔNG THANH LÝ: '+money(q*p);
  };

  $('#liqPrice')?.addEventListener('input',e=>{
    const raw=String(e.target.value||'').replace(/\D/g,'');
    e.target.value=raw?new Intl.NumberFormat('vi-VN').format(Number(raw)):'';
    update();
  });
  $('#liqQty')?.addEventListener('input',update);

  $('#liqSource')?.addEventListener('change',()=>{
    const v=$('#liqSource').value||'';
    const [kind,id]=v.split(':');
    const item=kind==='held' ? held.find(a=>String(a.id)===String(id)) : null;
    if(!item){
      $('#liqItem').value='';
      $('#liqPreview').innerHTML='Chọn một món trong danh sách Thanh lý để xem hình và thông tin.';
      update();
      return;
    }
    const x=item.record||{};
    const img=item.sourceType==='laptop'?getLaptopDisplayImage(x):getPartDisplayImage(x);
    const name=item.sourceType==='laptop'
      ? `${x.brand||''} — ${x.model||''}`
      : `${x.type||'Linh kiện'} — ${x.brand||''} — ${x.model||''}`;
    $('#liqItem').value=name;
    $('#liqQty').max=Number(x.qty||1);
    $('#liqQty').value=1;
    $('#liqPreview').innerHTML=`
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
        <img src="${img||''}" onerror="this.style.display='none'"
          style="width:180px;height:125px;object-fit:contain;border-radius:10px;background:#08111f;border:1px solid #29476a">
        <div>
          <h3 style="margin:0 0 8px">${escapeHtml(name)}</h3>
          <div><b>Số lượng thanh lý:</b> ${Number(x.qty||0)}</div>
          <div><b>Hãng:</b> ${escapeHtml(x.brand||'')}</div>
          <div><b>Model:</b> ${escapeHtml(x.model||'')}</div>
        </div>
      </div>`;
    update();
  });

  $('#saveLiquidation')?.addEventListener('click',async()=>{
    if(!canManageAccounts())return alert('Chỉ Quản trị viên mới được lưu phiếu thanh lý.');

    const source=$('#liqSource')?.value||'';
    const [kind,sourceId]=source.split(':');
    if(kind!=='held' || !sourceId)return alert('Hãy chọn đúng máy hoặc linh kiện đang ở Thanh lý.');

    const arr=db.liquidationStock||[];
    const heldItem=arr.find(a=>String(a.id)===String(sourceId));
    if(!heldItem)return alert('Không tìm thấy món này trong Thanh lý. Hãy tải lại trang.');

    const x=heldItem.record||{};
    const item=String($('#liqItem')?.value||'').trim();
    const qty=Math.floor(Number($('#liqQty')?.value||0));
    const price=parseMoneyValue($('#liqPrice')?.value||0);

    if(!item)return alert('Chưa chọn mặt hàng thanh lý.');
    if(!Number.isFinite(qty)||qty<1||qty>Number(x.qty||0))return alert(`Số lượng không hợp lệ. Thanh lý hiện còn ${Number(x.qty||0)}.`);
    if(!Number.isFinite(price)||price<=0)return alert('Vui lòng nhập giá thanh lý hợp lệ.');

    const record={
      id:Date.now(),
      time:new Date().toLocaleString('vi-VN'),
      customer:$('#liqCustomer')?.value.trim()||'Khách lẻ',
      phone:$('#liqPhone')?.value.trim()||'',
      item,qty,price,total:qty*price,
      condition:$('#liqCondition')?.value||'',
      note:$('#liqNote')?.value.trim()||'',
      sourceType:heldItem.sourceType,
      sourceId:heldItem.sourceId,
      liquidationStockId:heldItem.id,
      image:heldItem.sourceType==='laptop'?getLaptopDisplayImage(x):getPartDisplayImage(x),
      brand:x.brand||'',
      model:x.model||'',
      type:x.type||'',
      specs:x.specs||'',
      sourceRecord:JSON.parse(JSON.stringify(x))
    };

    // Bán từ Thanh lý: chỉ trừ khỏi danh sách Thanh lý, KHÔNG đưa về Kho và KHÔNG trừ Kho lần nữa.
    if(qty===Number(x.qty||0)){
      arr.splice(arr.indexOf(heldItem),1);
    }else{
      x.qty=Number(x.qty||0)-qty;
      heldItem.record=x;
    }

    db.liquidations.push(record);
    db.liquidationStock=arr;
    save();
    liquidationPage();
    requestAnimationFrame(()=>showFastToast("Đã lưu phiếu thanh lý — lịch sử đã cập nhật ngay."));
    setTimeout(()=>printLiquidation(record.id),220);
  });
}
window.deleteLiquidation=async function(id){
  if(!canManageAccounts())return alert('Chỉ Quản trị viên mới được xóa phiếu thanh lý.');
  const idx=(db.liquidations||[]).findIndex(x=>x.id==id);
  if(idx<0)return;
  const x=db.liquidations[idx];
  if(!confirm('Chuyển phiếu thanh lý này vào Thùng rác và hoàn lại món vào danh sách Thanh lý?'))return;

  // Hoàn lại đúng khu vực Thanh lý, không tự ý đưa thẳng về Kho.
  db.liquidationStock=db.liquidationStock||[];
  const existing=db.liquidationStock.find(a=>String(a.id)===String(x.liquidationStockId));
  if(existing){
    existing.record=existing.record||{};
    existing.record.qty=Number(existing.record.qty||0)+Number(x.qty||1);
  }else{
    const snap=JSON.parse(JSON.stringify(x.sourceRecord||{
      id:x.sourceId,brand:x.brand||'',model:x.model||'',type:x.type||'',qty:x.qty||1,
      specs:x.specs||'',price:0,cost:0,image:x.image||''
    }));
    snap.qty=Number(x.qty||1);
    db.liquidationStock.push({
      id:x.liquidationStockId||Date.now()+Math.floor(Math.random()*1000),
      sourceType:x.sourceType||'laptop',
      sourceId:x.sourceId,
      record:snap,
      movedAt:x.time||new Date().toLocaleString('vi-VN')
    });
  }

  db.liquidations.splice(idx,1);
  pushTrash('liquidation',x);
  await save();
  liquidationPage();
};

window.printLiquidation=function(id){
  const x=(db.liquidations||[]).find(a=>a.id==id);
  if(!x)return;

  const total=Number(x.total||((x.qty||1)*(x.price||0)));
  const warranty=x.warrantyStart&&x.warranty
    ? warrantyText(x.warrantyStart,x.warranty,x.warrantyEnd)
    : (x.warrantyLabel||'Không bảo hành');

  const img=x.image||'';
  const detail=x.sourceType==='laptop'
    ? `${x.brand||''} — ${x.model||x.item||''}`
    : `${x.type||'Linh kiện'} — ${x.brand||''} — ${x.model||x.item||''}`;

  const html=`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Bill thanh lý</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:Arial,sans-serif;color:#111;background:#fff;margin:0;padding:24px}
    .receipt{max-width:850px;margin:auto}
    .head{text-align:center;border-bottom:2px solid #111;padding-bottom:12px}
    h1{font-size:25px;margin:4px 0}.sub{font-size:13px}
    .info{display:grid;grid-template-columns:1fr 1fr;gap:7px 24px;margin:18px 0}
    .box{border:1px solid #777;padding:12px;margin-top:12px}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    th,td{border:1px solid #555;padding:9px;font-size:13px}
    th{background:#eee}.r{text-align:right}
    .product{display:flex;gap:16px;align-items:center}
    .product img{width:150px;height:105px;object-fit:contain;border:1px solid #aaa;border-radius:8px}
    .total{text-align:right;font-size:21px;font-weight:bold;margin-top:16px}
    .sign{display:grid;grid-template-columns:1fr 1fr;text-align:center;margin-top:55px}
    .muted{color:#555;font-size:12px}
    .no-print{text-align:center;margin-top:25px}
    @media print{body{padding:8px}.no-print{display:none!important}}
  </style></head><body><div class="receipt">
    <div class="head"><h1>PHIẾU BÁN HÀNG THANH LÝ</h1><div class="sub">LAPTOP VE CHAI .COM</div></div>
    <div class="info">
      <div><b>Khách hàng:</b> ${escapeHtml(x.customer||'Khách lẻ')}</div>
      <div><b>SĐT:</b> ${escapeHtml(x.phone||'')}</div>
      <div><b>Ngày bán:</b> ${escapeHtml(x.time||'')}</div>
      <div><b>Mã phiếu:</b> ${escapeHtml(String(x.id||''))}</div>
    </div>
    <div class="box"><b>📦 Hàng thanh lý</b>
      <div class="product" style="margin-top:12px">
        ${img?`<img src="${img}" onerror="this.style.display='none'">`:''}
        <div><h3 style="margin:0 0 8px">${escapeHtml(detail)}</h3>
          <div>Loại: ${x.sourceType==='laptop'?'Laptop':'Linh kiện'}</div>
          <div>Tình trạng: ${escapeHtml(x.condition||'')}</div>
        </div>
      </div>
    </div>
    <table><thead><tr><th>Mặt hàng</th><th>SL</th><th>Giá bán</th><th>Thành tiền</th></tr></thead>
      <tbody><tr><td>${escapeHtml(x.item||detail)}</td><td class="r">${Number(x.qty||1)}</td><td class="r">${money(x.price||0)}</td><td class="r">${money(total)}</td></tr></tbody>
    </table>
    <div class="box"><b>📝 Ghi chú / thỏa thuận:</b><br>${escapeHtml(x.note||'').replace(/\n/g,'<br>')||'Không có'}</div>
    <div class="total">TỔNG THANH TOÁN: ${money(total)}</div>
    <div class="sign"><div><b>KHÁCH HÀNG</b><br><br><br><span class="muted">(Ký và ghi rõ họ tên)</span></div>
      <div><b>NHÂN VIÊN</b><br><br><br><span class="muted">(Ký và ghi rõ họ tên)</span></div></div>
    <div class="no-print"><button onclick="window.print()">🖨️ IN PHIẾU</button></div>
  </div></body></html>`;

  openPrintWindow(html,null);
};

function trashLabel(t){return t==='saleLaptop'?'💻 Bán laptop':t==='salePart'?'🔩 Bán linh kiện':t==='stockLaptop'?'💻 Laptop trong kho':t==='stockPart'?'🔧 Linh kiện trong kho':t==='liquidation'?'♻️ Thanh lý':'🛠️ Sửa chữa';}
function trashDescription(t){
  const x=t.record||{};
  if(t.type==='saleLaptop') return `${escapeHtml(x.name||((x.brand||'')+' '+(x.model||'')))} × ${Number(x.qty||1)} — ${money(x.total||0)}`;
  if(t.type==='salePart') return (Array.isArray(x.items)?x.items:[]).map(i=>`${escapeHtml(i.name||[i.type,i.brand,i.model].filter(Boolean).join(' — '))} × ${Number(i.qty||1)}`).join('<br>')||escapeHtml(x.name||'Linh kiện');
  if(t.type==='stockLaptop') return `${escapeHtml(x.brand||'')} — ${escapeHtml(x.model||'')} — Còn ${Number(x.qty||0)} máy`;
  if(t.type==='stockPart') return `${escapeHtml(x.type||'')} — ${escapeHtml(x.brand||'')} — ${escapeHtml(x.model||'')} — Còn ${Number(x.qty||0)} cái`;
  if(t.type==='liquidation') return `${escapeHtml(x.item||'')} × ${Number(x.qty||1)} — ${money(x.total||0)}`;
  return `${escapeHtml(x.customer||'')} — ${escapeHtml(x.device||'')} — ${money(x.cost||0)}`;
}
function pushTrash(type,record){
  db.trash=db.trash||[];
  db.trash.push({id:Date.now()+Math.floor(Math.random()*1000),type,record:JSON.parse(JSON.stringify(record)),deletedAt:new Date().toLocaleString('vi-VN'),deletedBy:currentUser?.username||'admin'});
}
function restoreLaptopStockFromSale(x){
  const qty=Number(x.qty||1);
  let item=(x.sourceLaptopId!=null?db.laptops.find(a=>a.id==x.sourceLaptopId):null)||db.laptops.find(a=>String(a.brand||'').trim()===String(x.brand||'').trim()&&String(a.model||'').trim()===String(x.model||'').trim());
  if(!item){
    const snap=x.sourceLaptop||{};
    item={id:snap.id||Date.now(),brand:x.brand||snap.brand||'',model:x.model||snap.model||x.name||'',qty:0,cost:Number(snap.cost||0),price:Number(snap.price||0),repair:Number(snap.repair||0),specs:snap.specs||x.specs||'',note:snap.note||''};
    db.laptops.push(item);
  }
  item.qty=Number(item.qty||0)+qty;
}
function removeLaptopStockForRestore(x){
  const qty=Number(x.qty||1);
  let item=(x.sourceLaptopId!=null?db.laptops.find(a=>a.id==x.sourceLaptopId):null)||db.laptops.find(a=>String(a.brand||'').trim()===String(x.brand||'').trim()&&String(a.model||'').trim()===String(x.model||'').trim());
  if(!item) return {ok:true};
  if(Number(item.qty||0)<qty) return {ok:false,message:`Kho chỉ còn ${Number(item.qty||0)} máy ${x.brand||''} ${x.model||''}, không đủ ${qty} máy để phục hồi đơn.`};
  item.qty-=qty; return {ok:true};
}
function restorePartsStockFromSale(x){
  const items=Array.isArray(x.items)?x.items:[{id:x.sourcePartId,type:x.type,brand:x.brand,model:x.model,qty:x.qty||1,price:x.price||0,sourcePart:x.sourcePart}];
  items.forEach(i=>{
    const qty=Number(i.qty||1);
    let item=(i.sourcePartId!=null?db.parts.find(a=>a.id==i.sourcePartId):null)||db.parts.find(a=>String(a.type||'').trim()===String(i.type||'').trim()&&String(a.brand||'').trim()===String(i.brand||'').trim()&&String(a.model||'').trim()===String(i.model||'').trim());
    if(!item){const snap=i.sourcePart||{};item={id:snap.id||i.id||Date.now()+Math.floor(Math.random()*1000),type:i.type||snap.type||'Linh kiện',brand:i.brand||snap.brand||'',model:i.model||snap.model||'',qty:0,price:Number(i.price||snap.price||0),note:snap.note||''};db.parts.push(item);} 
    item.qty=Number(item.qty||0)+qty;
  });
}
function removePartsStockForRestore(x){
  const items=Array.isArray(x.items)?x.items:[{id:x.sourcePartId,type:x.type,brand:x.brand,model:x.model,qty:x.qty||1}];
  for(const i of items){
    const qty=Number(i.qty||1);
    const item=(i.sourcePartId!=null?db.parts.find(a=>a.id==i.sourcePartId):null)||db.parts.find(a=>String(a.type||'').trim()===String(i.type||'').trim()&&String(a.brand||'').trim()===String(i.brand||'').trim()&&String(a.model||'').trim()===String(i.model||'').trim());
    if(item && Number(item.qty||0)<qty) return {ok:false,message:`Kho không đủ ${i.name||[i.type,i.brand,i.model].filter(Boolean).join(' — ')} để phục hồi đơn.`};
  }
  items.forEach(i=>{const qty=Number(i.qty||1);const item=(i.sourcePartId!=null?db.parts.find(a=>a.id==i.sourcePartId):null)||db.parts.find(a=>String(a.type||'').trim()===String(i.type||'').trim()&&String(a.brand||'').trim()===String(i.brand||'').trim()&&String(a.model||'').trim()===String(i.model||'').trim());if(item)item.qty-=qty;});
  return {ok:true};
}
async function moveHistoryToTrash(type,id){
  if(!canManageAccounts()) return alert('Chỉ Quản trị viên mới được chuyển giao dịch vào Thùng rác.');
  const list=type==='saleLaptop'?db.sales:type==='salePart'?db.partSales:db.repairs;
  const idx=list.findIndex(x=>x.id==id); if(idx<0)return;
  const record=list[idx];
  if(!confirm(`Chuyển giao dịch này vào Thùng rác?\n\n${record.customer||''} — ${record.name||record.device||''}`))return;
  if(type==='saleLaptop') restoreLaptopStockFromSale(record);
  if(type==='salePart') restorePartsStockFromSale(record);
  list.splice(idx,1); pushTrash(type,record); await save(); historyPage();
}
async function moveSelectedHistoryToTrash(type){
  if(!canManageAccounts()) return alert('Chỉ Quản trị viên mới được chuyển giao dịch vào Thùng rác.');
  const boxes=[...document.querySelectorAll(`input[data-history-select="${type}"]:checked`)];
  const ids=boxes.map(b=>String(b.value));
  if(!ids.length)return alert('Bạn chưa chọn đơn nào.');
  const list=type==='saleLaptop'?db.sales:type==='salePart'?db.partSales:db.repairs;
  const selected=list.filter(x=>ids.includes(String(x.id)));
  if(!selected.length)return;
  const label=type==='saleLaptop'?'đơn bán laptop':type==='salePart'?'đơn bán linh kiện':'phiếu sửa chữa';
  if(!confirm(`Chuyển ${selected.length} ${label} đã chọn vào Thùng rác?\n\nHàng hóa sẽ được cộng trả lại kho.`))return;
  const idSet=new Set(ids);
  for(const record of selected){
    if(type==='saleLaptop') restoreLaptopStockFromSale(record);
    if(type==='salePart') restorePartsStockFromSale(record);
    pushTrash(type,record);
  }
  for(let i=list.length-1;i>=0;i--) if(idSet.has(String(list[i].id))) list.splice(i,1);
  await save(); historyPage();
}
function toggleHistorySelection(type,checked){
  document.querySelectorAll(`input[data-history-select="${type}"]`).forEach(b=>b.checked=checked);
  const count=document.querySelectorAll(`input[data-history-select="${type}"]:checked`).length;
  const el=document.querySelector(`[data-selected-count="${type}"]`); if(el) el.textContent=count?`Đã chọn ${count}`:'';
}
function updateHistorySelectionCount(type){
  const count=document.querySelectorAll(`input[data-history-select="${type}"]:checked`).length;
  const el=document.querySelector(`[data-selected-count="${type}"]`); if(el) el.textContent=count?`Đã chọn ${count}`:'';
}
async function restoreTrashItem(id){
  if(!canManageAccounts()) return alert('Chỉ Quản trị viên mới được phục hồi giao dịch.');
  const idx=(db.trash||[]).findIndex(x=>x.id==id); if(idx<0)return;
  const t=db.trash[idx], x=t.record;
  if(!confirm(`Phục hồi giao dịch này khỏi Thùng rác?\n\n${x.customer||''} — ${x.name||x.device||''}`))return;
  let check={ok:true};
  if(t.type==='saleLaptop') check=removeLaptopStockForRestore(x);
  if(t.type==='salePart') check=removePartsStockForRestore(x);
  if(t.type==='liquidation'){
    if(x.sourceType==='laptop'){const item=db.laptops.find(a=>String(a.id)===String(x.sourceId)); if(!item)return alert('Không tìm thấy laptop trong kho để phục hồi thanh lý.'); if(Number(item.qty||0)<Number(x.qty||1))return alert('Kho không đủ số lượng để phục hồi phiếu thanh lý.');}
    if(x.sourceType==='part'){const item=db.parts.find(a=>String(a.id)===String(x.sourceId)); if(!item)return alert('Không tìm thấy linh kiện trong kho để phục hồi thanh lý.'); if(Number(item.qty||0)<Number(x.qty||1))return alert('Kho không đủ số lượng để phục hồi phiếu thanh lý.');}
  }
  if(!check.ok)return alert(check.message);
  if(t.type==='saleLaptop') db.sales.push(x);
  else if(t.type==='salePart') db.partSales.push(x);
  else if(t.type==='stockLaptop'){ if(!db.laptops.some(a=>a.id==x.id)) db.laptops.push(x); else return alert('Laptop này đã tồn tại trong kho.'); }
  else if(t.type==='stockPart'){ if(!db.parts.some(a=>a.id==x.id)) db.parts.push(x); else return alert('Linh kiện này đã tồn tại trong kho.'); }
  else if(t.type==='liquidation'){ if(x.sourceType==='laptop'){const item=db.laptops.find(a=>String(a.id)===String(x.sourceId));if(item)item.qty-=Number(x.qty||1);} if(x.sourceType==='part'){const item=db.parts.find(a=>String(a.id)===String(x.sourceId));if(item)item.qty-=Number(x.qty||1);} if(!db.liquidations.some(a=>a.id==x.id)) db.liquidations.push(x); }
  else db.repairs.push(x);
  db.trash.splice(idx,1); await save(); trashPage();
}
async function permanentlyDeleteTrash(id){
  if(!canManageAccounts()) return alert('Chỉ Quản trị viên mới được xóa vĩnh viễn.');
  const idx=(db.trash||[]).findIndex(x=>x.id==id);if(idx<0)return;
  if(!confirm('XÓA VĨNH VIỄN giao dịch này? Không thể phục hồi lại.'))return;
  db.trash.splice(idx,1);await save();trashPage();
}
async function emptyTrash(){
  if(!canManageAccounts())return alert('Chỉ Quản trị viên mới được dọn Thùng rác.');
  if(!(db.trash||[]).length)return;
  if(!confirm(`Dọn sạch ${db.trash.length} giao dịch trong Thùng rác?\nKhông thể phục hồi sau khi dọn.`))return;
  db.trash=[];await save();trashPage();
}
function trashPage(){
  const items=[...(db.trash||[])].slice().reverse();
  const rows=items.map(t=>{const x=t.record||{};return `<tr><td>${escapeHtml(t.deletedAt||'')}</td><td>${trashLabel(t)}</td><td>${trashDescription(t)}</td><td>${escapeHtml(x.customer||'')}</td><td>${money(x.total||x.cost||0)}</td><td>${escapeHtml(t.deletedBy||'')}</td><td><button class="btn green" onclick="restoreTrashItem(${t.id})">↩️ PHỤC HỒI</button> <button class="btn red" onclick="permanentlyDeleteTrash(${t.id})">🗑️ XÓA VĨNH VIỄN</button></td></tr>`}).join('');
  const n=items.length;
  $('#content').innerHTML=`<div class="cards"><div class="card"><label>🗑️ TRONG THÙNG RÁC</label><strong>${n}</strong></div><div class="card"><label>💻 BÁN LAPTOP</label><strong>${items.filter(x=>x.type==='saleLaptop').length}</strong></div><div class="card"><label>🔩 BÁN LINH KIỆN</label><strong>${items.filter(x=>x.type==='salePart').length}</strong></div><div class="card"><label>🛠️ SỬA CHỮA</label><strong>${items.filter(x=>x.type==='repair').length}</strong></div><div class="card"><label>📦 HÀNG TRONG KHO</label><strong>${items.filter(x=>x.type==='stockLaptop'||x.type==='stockPart').length}</strong></div><div class="card"><label>♻️ THANH LÝ</label><strong>${items.filter(x=>x.type==='liquidation').length}</strong></div></div>
  <div class="panel"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><h3 style="margin-bottom:4px">🗑️ Thùng rác</h3><div class="muted">Giao dịch đã xóa được giữ lại để phục hồi, giống Thùng rác Windows.</div></div><button class="btn red" onclick="emptyTrash()" ${n?'':'disabled'}>🗑️ DỌN SẠCH THÙNG RÁC</button></div><div class="tablewrap" style="margin-top:16px"><table class="table"><thead><tr><th>Thời gian xóa</th><th>Loại</th><th>Chi tiết</th><th>Khách hàng</th><th>Số tiền</th><th>Người xóa</th><th>Thao tác</th></tr></thead><tbody>${rows||'<tr><td colspan="8" class="empty">🗑️ Thùng rác đang trống</td></tr>'}</tbody></table></div></div>`;
}

function historyPage(){
  const esc=v=>escapeHtml(String(v??""));
  const bulkBar=(type,count)=>`<div class="actions" style="justify-content:space-between;align-items:center;gap:8px;margin:8px 0 10px"><div style="display:flex;align-items:center;gap:10px"><label style="display:flex;align-items:center;gap:7px;cursor:pointer"><input type="checkbox" onchange="toggleHistorySelection('${type}',this.checked)"> <b>Chọn tất cả</b></label><span class="muted" data-selected-count="${type}"></span></div><button class="btn red" onclick="moveSelectedHistoryToTrash('${type}')" ${count?'':'disabled'}>🗑️ XÓA CÁC MỤC ĐÃ CHỌN</button></div>`;
  const laptopRows=[...db.sales].reverse().map(x=>`<tr>
    <td><input type="checkbox" data-history-select="saleLaptop" value="${x.id}" onchange="updateHistorySelectionCount('saleLaptop')"></td><td>${esc(x.time)}</td><td>${esc(x.name||((x.brand||"")+" "+(x.model||"")))}</td><td>${x.qty||0}</td>
    <td>${money(x.price||0)}</td><td><b>${money(x.total||0)}</b></td><td>${esc(x.customer)}</td>
    <td>${esc(x.warrantyLabel||((x.warranty&&x.warranty!=="0")?warrantyText(x.warrantyStart||"",x.warranty,x.warrantyEnd||""):"Không bảo hành"))}</td>
    <td><button class="btn blue" onclick="printSale(${x.id})">🖨️ IN</button> <button class="btn red" onclick="moveHistoryToTrash('saleLaptop',${x.id})">🗑️ XÓA</button></td>
  </tr>`).join("");
  const partRows=[...(db.partSales||[])].reverse().map(x=>{
    const items=Array.isArray(x.items)?x.items:[];
    const detail=items.length?items.map(i=>`${esc(i.name||[i.type,i.brand,i.model].filter(Boolean).join(" — "))} × ${i.qty||1}`).join("<br>"):esc(x.name||((x.type||"")+" — "+(x.brand||"")+" "+(x.model||"")));
    const qty=items.length?items.reduce((t,i)=>t+Number(i.qty||0),0):Number(x.qty||0);
    return `<tr><td><input type="checkbox" data-history-select="salePart" value="${x.id}" onchange="updateHistorySelectionCount('salePart')"></td><td>${esc(x.time)}</td><td>${detail}</td><td>${qty}</td><td>${money(x.total||0)}</td><td><b>${money(x.total||0)}</b></td><td>${esc(x.customer)}</td><td>${esc(x.warrantyLabel||((x.warranty&&x.warranty!=="0")?warrantyText(x.warrantyStart||"",x.warranty,x.warrantyEnd||""):"Không bảo hành"))}</td><td><button class="btn blue" onclick="printPartSale(${x.id})">🖨️ IN</button> <button class="btn red" onclick="moveHistoryToTrash('salePart',${x.id})">🗑️ XÓA</button></td></tr>`;
  }).join("");
  const repairRows=[...(db.repairs||[])].reverse().map(x=>{
    const items=Array.isArray(x.items)?x.items:[];
    const detail=items.map(i=>`${esc(i.type||"Sửa chữa")}: ${esc(i.name||"")} × ${i.qty||1} = ${money(i.total||0)}`).join("<br>")||"Chưa ghi hạng mục";
    const warranty=(x.warranty&&x.warranty!=="0")?warrantyText(x.warrantyStart||"",x.warranty,x.warrantyEnd||""):"Không bảo hành";
    return `<tr><td><input type="checkbox" data-history-select="repair" value="${x.id}" onchange="updateHistorySelectionCount('repair')"></td><td>${esc(x.time)}</td><td>${esc(x.customer)}</td><td>${esc(x.phone)}</td><td>${esc(x.device)}</td>
      <td>${detail}<br><b>Tổng: ${money(x.cost||0)}</b></td><td>${esc(x.status)}</td><td>${esc(warranty)}</td>
      <td><button class="btn blue" onclick="printRepair(${x.id})">🖨️ IN</button> <button class="btn red" onclick="moveHistoryToTrash('repair',${x.id})">🗑️ XÓA</button></td></tr>`;
  }).join("");
  const laptopTotal=db.sales.reduce((t,x)=>t+Number(x.total||0),0);
  const partTotal=(db.partSales||[]).reduce((t,x)=>t+Number(x.total||0),0);
  const repairTotal=(db.repairs||[]).reduce((t,x)=>t+Number(x.cost||0),0);
  const liquidationRows=[...(db.liquidations||[])].reverse().map(x=>`<tr><td>${esc(x.time)}</td><td>${esc(x.customer)}</td><td>${esc(x.item)}</td><td>${x.qty||1}</td><td>${money(x.total||0)}</td><td>${esc(x.condition)}</td><td><button class="btn blue" onclick="printLiquidation(${x.id})">🖨️ IN</button> <button class="btn red" onclick="deleteLiquidation(${x.id})">🗑️ XÓA</button></td></tr>`).join("");
  const liquidationTotal=(db.liquidations||[]).reduce((t,x)=>t+Number(x.total||0),0);
  $('#content').innerHTML=`
    <div class="cards">
      <div class="card"><label>💻 ĐƠN BÁN LAPTOP</label><strong>${db.sales.length}</strong></div>
      <div class="card"><label>🔩 ĐƠN BÁN LINH KIỆN</label><strong>${(db.partSales||[]).length}</strong></div>
      <div class="card"><label>🛠️ PHIẾU SỬA CHỮA</label><strong>${(db.repairs||[]).length}</strong></div><div class="card"><label>♻️ PHIẾU THANH LÝ</label><strong>${(db.liquidations||[]).length}</strong></div>
      <div class="card"><label>💰 TỔNG TIỀN</label><strong>${money(laptopTotal+partTotal+repairTotal+liquidationTotal)}</strong></div>
    </div>
    <div class="actions" style="justify-content:flex-end"><button class="btn orange" onclick="show('trash')">🗑️ MỞ THÙNG RÁC (${(db.trash||[]).length})</button></div>
    <div class="panel"><h3>💻 Lịch sử bán laptop</h3>${bulkBar('saleLaptop',db.sales.length)}<div class="tablewrap"><table class="table"><thead><tr>
      <th><input type="checkbox" onchange="toggleHistorySelection('saleLaptop',this.checked)" title="Chọn tất cả"></th><th>Thời gian</th><th>Laptop</th><th>SL</th><th>Giá bán</th><th>Tổng</th><th>Khách hàng</th><th>Bảo hành</th><th>Thao tác</th>
    </tr></thead><tbody>${laptopRows||'<tr><td colspan="9" class="empty">Chưa có đơn bán laptop</td></tr>'}</tbody></table></div></div>
    <div class="panel"><h3>🔩 Lịch sử bán linh kiện</h3>${bulkBar('salePart',(db.partSales||[]).length)}<div class="tablewrap"><table class="table"><thead><tr>
      <th><input type="checkbox" onchange="toggleHistorySelection('salePart',this.checked)" title="Chọn tất cả"></th><th>Thời gian</th><th>Linh kiện</th><th>SL</th><th>Giá bán</th><th>Tổng</th><th>Khách hàng</th><th>Bảo hành</th><th>Thao tác</th>
    </tr></thead><tbody>${partRows||'<tr><td colspan="9" class="empty">Chưa có đơn bán linh kiện</td></tr>'}</tbody></table></div></div>
    <div class="panel"><h3>🛠️ Lịch sử sửa chữa</h3>${bulkBar('repair',(db.repairs||[]).length)}<div class="tablewrap"><table class="table"><thead><tr>
      <th><input type="checkbox" onchange="toggleHistorySelection('repair',this.checked)" title="Chọn tất cả"></th><th>Thời gian</th><th>Khách hàng</th><th>SĐT</th><th>Thiết bị</th><th>Chi tiết sửa / thay</th><th>Trạng thái</th><th>Bảo hành</th><th>Thao tác</th>
    </tr></thead><tbody>${repairRows||'<tr><td colspan="9" class="empty">Chưa có phiếu sửa chữa</td></tr>'}</tbody></table></div></div>`;
}

document.addEventListener("click",e=>{
  const b=e.target.closest("[data-top-settings]");
  if(!b)return;
  const page=b.dataset.topSettings;
  const navBtn=document.querySelector(`.nav[data-page="${page}"]`);
  if(navBtn){document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));navBtn.classList.add("active");show(page);}
});
async function initApp(){applyUISettings(); authUserChip(); await pingServer(); const ok=await requireAuth(); if(!ok){setInterval(()=>$("#clock").textContent=new Date().toLocaleString("vi-VN"),1000);return;} await pingServer(); await loadSharedDB(); nav(); await show("dashboard"); setInterval(()=>$("#clock").textContent=new Date().toLocaleString("vi-VN"),1000)}
initApp();

// V4.2: Ảnh chụp thực tế luôn có độ ưu tiên cao nhất.
// actualImage = ảnh chụp của từng món hàng; modelImage = ảnh mẫu dùng chung theo Model.
