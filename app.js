import { db, ref, set, push, onValue, get, update } from "./firebase.js";

const uid = localStorage.getItem("uid");
if (!uid) location.href = "index.html";

const petRef = ref(db, "pet");
const usersRef = ref(db, "users");
const chatRef = ref(db, "chat");
const feedRef = ref(db, "feed");

let state = { happiness:80,hunger:80,energy:80 };
let user = null;
let cooldown = false;

// UI
const h = document.getElementById("h");
const hu = document.getElementById("hu");
const e = document.getElementById("e");
const pet = document.getElementById("pet");

const chatBox = document.getElementById("chat");
const feedBox = document.getElementById("feed");
const usersBox = document.getElementById("users");

// Load user
onValue(ref(db,"users/"+uid),snap=>{
  user = snap.val();
  document.getElementById("coins").innerText="✨"+user.coins;
  pet.innerText=user.pet;
});

// Pet sync
onValue(petRef,snap=>{
  if(snap.exists()) state=snap.val();
  updateUI();
});

function updateUI(){
  h.style.width=state.happiness+"%";
  hu.style.width=state.hunger+"%";
  e.style.width=state.energy+"%";
}

// Actions
window.feed=()=>{
  if(cooldown) return show("wait");
  cooldown=true; setTimeout(()=>cooldown=false,1000);

  state.hunger=Math.min(100,state.hunger+10);
  reward(5);
  log("🍓 "+user.name+" fed pet");
};

window.play=()=>{
  if(state.energy<10) return show("tired");

  state.happiness+=10;
  state.energy-=10;
  reward(8);
  log("🎮 "+user.name+" played");
};

window.sleep=()=>{
  state.energy+=15;
  reward(3);
  log("🌙 "+user.name+" slept");
};

function reward(c){
  update(ref(db,"users/"+uid),{
    coins:user.coins + c,
    xp:user.xp + c
  });
  save();
}

function save(){
  set(petRef,state);
}

// Chat
window.sendMsg=()=>{
  let msg=document.getElementById("msg").value;
  if(!msg) return;

  push(chatRef,{msg:user.name+": "+msg});
  document.getElementById("msg").value="";
};

// Feed + Chat
onValue(chatRef,s=>{
  chatBox.innerHTML="";
  s.forEach(d=>{
    let div=document.createElement("div");
    div.textContent=d.val().msg;
    chatBox.appendChild(div);
  });
});

onValue(feedRef,s=>{
  feedBox.innerHTML="";
  s.forEach(d=>{
    let div=document.createElement("div");
    div.textContent=d.val().msg;
    feedBox.appendChild(div);
  });
});

function log(m){
  push(feedRef,{msg:m});
}

// Users
onValue(usersRef,s=>{
  usersBox.innerHTML="";
  s.forEach(d=>{
    let u=d.val();
    let div=document.createElement("div");
    div.textContent="🟢 "+u.name;
    usersBox.appendChild(div);
  });
});

// Decay system
setInterval(()=>{
  state.hunger--;
  state.energy--;
  state.happiness--;

  if(state.hunger<=0 || state.energy<=0 || state.happiness<=0){
    show("pet died 💀");
    state={happiness:80,hunger:80,energy:80};
  }

  save();
},5000);

// Popup
function show(m){
  let p=document.getElementById("popup");
  p.innerText=m;
  p.classList.add("show");
  setTimeout(()=>p.classList.remove("show"),2000);
}