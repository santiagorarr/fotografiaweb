const FOTOS = [
  { archivo: "fotos/DSC00025.JPG", titulo: "Que facto",                  lugar: "Ciudad de México" },
  { archivo: "fotos/DSC00044.JPG", titulo: "Un poco de envidia, si",     lugar: "CCH Azcapotzalco" },
  { archivo: "fotos/DSC00002.JPG", titulo: "que pedazo feria chaval",    lugar: "Ciudad de México" },
  { archivo: "fotos/DSC00144.JPG", titulo: "Los Panchos :)",             lugar: "mi cuarto" },
  { archivo: "fotos/DSC00114.JPG", titulo: "el mar es inmenso",          lugar: "Acapulco" },
  { archivo: "fotos/DSC00123.JPG", titulo: "pinto llover en la escuela", lugar: "CCH Azcapotzalco" }
];

const mini = document.getElementById("mini");
const visor = document.getElementById("visor");
const vimg = document.getElementById("vimg");
let actual = 0;

FOTOS.forEach((f, i) => {
  const fig = document.createElement("figure");
  const btn = document.createElement("button");
  btn.setAttribute("aria-label", "Ampliar: " + f.titulo);
  const img = new Image();
  img.src = f.archivo; img.alt = f.titulo; img.loading = "lazy";
  img.onerror = () => {
    const ph = document.createElement("div");
    ph.className = "ph"; ph.textContent = "No hay " + f.archivo;
    img.replaceWith(ph); btn.disabled = true; btn.style.cursor = "default";
  };
  btn.append(img);
  btn.onclick = () => abrir(i);
  const cap = document.createElement("figcaption");
  cap.textContent = f.titulo;
  fig.append(btn, cap);
  mini.append(fig);
});

function abrir(i) {
  actual = (i + FOTOS.length) % FOTOS.length;
  const f = FOTOS[actual];
  vimg.src = f.archivo; vimg.alt = f.titulo;
  document.getElementById("vtit").textContent = f.titulo;
  document.getElementById("vtxt").textContent = (f.lugar ? f.lugar + " - " : "") + "Foto " + (actual + 1) + " de " + FOTOS.length;
  if (!visor.open) visor.showModal();
}
document.getElementById("cerrar").onclick = () => visor.close();
document.getElementById("ant").onclick = () => abrir(actual - 1);
document.getElementById("sig").onclick = () => abrir(actual + 1);
visor.addEventListener("click", e => { if (e.target === visor) visor.close(); });
document.addEventListener("keydown", e => {
  if (!visor.open) return;
  if (e.key === "ArrowLeft") abrir(actual - 1);
  if (e.key === "ArrowRight") abrir(actual + 1);
});

document.getElementById("anio").textContent = new Date().getFullYear();

let n = 1;
try { n = (parseInt(localStorage.getItem("visitas"), 10) || 0) + 1; localStorage.setItem("visitas", n); } catch (e) {}
document.getElementById("cont").textContent = String(n).padStart(6, "0");

const ventana = document.getElementById("ventana");
const barraVentana = ventana.querySelector(".barra");
const tarea = document.getElementById("tarea");
let ox = 0, oy = 0;

function estado() {
  tarea.classList.toggle("activa", !ventana.classList.contains("cerrada") && !ventana.classList.contains("min"));
}
function moverA(x, y) {
  ox = x; oy = y;
  ventana.style.transform = (x || y) ? "translate(" + x + "px," + y + "px)" : "";
}
function alternarMaximizar() {
  ventana.classList.remove("min");
  moverA(0, 0);
  ventana.classList.toggle("maxi");
  estado();
}

document.getElementById("min").onclick = () => { ventana.classList.toggle("min"); estado(); };
document.getElementById("max").onclick = alternarMaximizar;
document.getElementById("cerrarv").onclick = () => { ventana.classList.add("cerrada"); estado(); };
tarea.onclick = () => {
  if (ventana.classList.contains("cerrada")) ventana.classList.remove("cerrada", "min");
  else ventana.classList.toggle("min");
  estado();
};

let arrastre = null;
barraVentana.addEventListener("pointerdown", e => {
  if (e.target.closest("button") || ventana.classList.contains("maxi")) return;
  const r = ventana.getBoundingClientRect();
  arrastre = { sx: e.clientX, sy: e.clientY, ox: ox, oy: oy, izq: r.left - ox, arr: r.top - oy, ancho: r.width };
  barraVentana.setPointerCapture(e.pointerId);
  ventana.classList.add("arrastrando");
});
barraVentana.addEventListener("pointermove", e => {
  if (!arrastre) return;
  let x = arrastre.ox + (e.clientX - arrastre.sx);
  let y = arrastre.oy + (e.clientY - arrastre.sy);

  x = Math.max(-(arrastre.izq + arrastre.ancho - 90), Math.min(x, window.innerWidth - 90 - arrastre.izq));
  y = Math.max(-arrastre.arr, Math.min(y, window.innerHeight - 80 - arrastre.arr));
  moverA(x, y);
});
function soltar() { arrastre = null; ventana.classList.remove("arrastrando"); }
barraVentana.addEventListener("pointerup", soltar);
barraVentana.addEventListener("pointercancel", soltar);

barraVentana.addEventListener("dblclick", e => {
  if (e.target.closest("button")) return;
  alternarMaximizar();
});

function reloj() {
  document.getElementById("reloj").textContent = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}
reloj(); setInterval(reloj, 30000); estado();
